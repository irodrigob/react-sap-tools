import { useState, useCallback, useEffect } from "react";
import { ValueState } from "@ui5/webcomponents-react";
import CellActions from "./cellActions";
import CellEdit from "./cellEdit";
import {
  COLUMN_PROPERTIES,
  DEFAULT_TABLE_PROPS,
  DEFAULT_VALUES_PROPERTIES,
  ANALYTIC_TABLE,
  INTERNAL_FIELDS_DATA,
  COLUMN_ACTION,
  DEFAULT_ROW_MESSAGE,
} from "./constants";
import { useTranslations } from "translations/i18nContext";
import { showToast, MESSAGE } from "utils/general/message";
import useDataManager from "./useDataManager";
import useDataValidations from "./useDataValidations";

export default function useCustomAnalyticTable() {
  const { getI18nText } = useTranslations();
  const [fieldCatalog, setFieldCatalog] = useState([]);
  const [tableValues, setTableValues] = useState([]);
  const [originalValues, setOriginalValues] = useState([]);
  const [tableProps, setTableProps] = useState({ ...DEFAULT_TABLE_PROPS });
  const {
    fillData,
    updateCellValue,
    setFieldCatalog: setFieldCatalogDataManager,
    undoRowDataChanged,
    disableRowEditing,
    enabledRowEditing,
    updateOriginalData,
    setStatusRow,
    getTabix,
    propagateValidation,
    existErrorInRow,
    addMessage,
  } = useDataManager();
  const { cellValidations } = useDataValidations();
  const [openPopupMessages, setOpenPopupMessages] = useState(false);
  const [openPopupConfirmDelete, setOpenPopupConfirmDelete] = useState(false);
  const [instanceToDelete,setInstanceToDelete]=useState({})
  const [rowMessages, setRowMessages] = useState([]);

  // Aquí voy a guardar propiedases que me servirán para construir la tabla
  const [valuesProperties, setValuesProperties] = useState({
    ...DEFAULT_VALUES_PROPERTIES,
  });

  /*************************************
   * Efectos
   ************************************/
  /* Cualquier cambio en el catalogo de campo se actualiza dichos valores en el
  hook de gestión de datos.
  */
  useEffect(() => {
    setFieldCatalogDataManager(fieldCatalog);
  }, [fieldCatalog]);

  /**
   * Efecto que cuando se cambian los valores de la tabla se recalcula
   * props internas y catalogo de campos para adpatarlo a los nuevos valores.
   * La cosa principal que hace es mirar si el icono de mensajes aparece en alguna fila
   * para recalcular el ancho de la columna y se vea.
   */
  useEffect(() => {
    if (Array.isArray(tableValues) && tableValues.length > 0)
      recalculatePropsFromMessages();
  }, [tableValues]);

  /*************************************
   * Funciones
   ************************************/

  /**
   * Función que añade la columnas de acciones según las propiedas que tenga el registro que se este procesando
   * @param {Object} valuesProperties | Propiedas general según los valores.
   * @param {Object} propsEditable | Props pasadas para las edición de datos
   */
  const addColumnActions = useCallback(
    (valuesProps, propsEditable) => {
      let buttonNumbers = calculateNumberActionButton(valuesProps);

      if (buttonNumbers > 0)
        return {
          Cell: (instance) => {
            return (
              <CellActions
                instance={instance}
                onClickEdit={() => {
                  actionActiveEditRow(instance);
                }}
                onClickDecline={() => {
                  actionDeclineEditRow(instance);
                }}
                onClickAccept={() => {
                  actionConfirmEditRow(instance, propsEditable);
                }}
                onClickShowMessages={() => {
                  actionOpenShowMessagesRow(instance);
                }}
                onClickDelete={()=>{actionDeleteRow(instance)}}
              />
            );
          },
          Header: getI18nText(
            "customAnalyticTable.localization.actions.lblColumnActions"
          ),
          headerTooltip: getI18nText(
            "customAnalyticTable.localization.actions.lblColumnActionsToolTip"
          ),
          disableFilters: true,
          disableGroupBy: true,
          disableResizing: false,
          disableSortBy: true,
          id: COLUMN_PROPERTIES.ACTIONS,
          width: buttonNumbers * COLUMN_ACTION.WIDTH_ICON,
        };
      else return null;
    },
    [tableValues, fieldCatalog, originalValues]
  );

  /**
   * Calcula el numero de botones según las propiedades de los valores
   * @param {object} valuesProps | Propiedades segun datos
   * @returns {integer} | Numero de botones
   */
  const calculateNumberActionButton = (valuesProps) => {
    let buttonNumbers = 0;

    if (valuesProps.actionDelete) buttonNumbers += 1;
    if (valuesProps.actionEdit) buttonNumbers += 1;
    if (valuesProps.actionMessages) buttonNumbers += 1;

    return buttonNumbers;
  };

  /**
   * Añado para las columnas editables
   * @param {Array} columns | Configuración de columnas de la tabla.
   * @returns {Array} | Columnas con la propiedad Cell añadida con el control deseado
   */
  const addCustomCellColumns = useCallback(
    (columns) => {
      let newColumns = [];
      columns.forEach((column) => {
        let newColumn = { ...column };

        // Solo se añade campo "Cell" cuando no viene previamente, existe el campo editable y este esta a true.
        if (
          ANALYTIC_TABLE.COLUMNS.CELL_COMPONENT in column === false &&
          COLUMN_PROPERTIES.EDIT in column === true &&
          column[COLUMN_PROPERTIES.EDIT] === true
        ) {
          // Se determina si el campo es obligatorio, si no viene la propiedad en el catalogo de campos se marcará como
          // no obligatorio.
          newColumn[COLUMN_PROPERTIES.REQUIRED] =
            column.required != undefined ? column.required : false;

          newColumn[ANALYTIC_TABLE.COLUMNS.CELL_COMPONENT] = (instance) => {
            return (
              <CellEdit
                instance={instance}
                required={newColumn[COLUMN_PROPERTIES.REQUIRED]}
                onChange={(instance, cellValue) => {
                  let returnValidations = cellValidations(instance, cellValue);

                  setTableValues(
                    propagateValidation(
                      tableValues,
                      getTabix(instance),
                      returnValidations
                    )
                  );

                  if (returnValidations.state != ValueState.Error)
                    setTableValues(
                      updateCellValue(
                        tableValues,
                        getTabix(instance),
                        instance.cell.column.id,
                        cellValue
                      )
                    );
                }}
              />
            );
          };
        }
        newColumns.push(newColumn);
      });
      return newColumns;
    },
    [tableValues, fieldCatalog]
  );

  /**
   * Construye el catalogo de campos para la tabla en base a las columnas pasadas. Cosas que realiza:
   * 1.- Añade una columna de acciones cuando alguno campo tiene el atributo "EDIT" y la tabla a nivel general se puede editar. O
   * bien la tabla puede borrar registros.
   * @param {Array} columns | Array con los campos a mostrar en la tabla
   * @param {Object} valuesProperties | Propiedas general según los valores.
   * @param {Object} propsEditable | Props pasadas para las edición de datos
   */
  const buildFieldCatalog = useCallback(
    (columns, valuesProperties, propsEditable) => {
      let newFieldCatalog = [];
      if (
        (columns.some((o) => COLUMN_PROPERTIES.EDIT in o) &&
          tableProps.allowEdit) ||
        tableProps.allowDelete
      ) {
        let actionColumn = addColumnActions(valuesProperties, propsEditable);
        if (actionColumn) newFieldCatalog.push(actionColumn);
        newFieldCatalog = newFieldCatalog.concat(addCustomCellColumns(columns));
      } else {
        newFieldCatalog = [...columns];
      }

      setFieldCatalog(newFieldCatalog);
    },
    [tableProps]
  );
  /**
   * Recalcula las propiedades en base a los valores de la tabla y lanza
   * los procesos que usan dichas propiedas para calcular o pintar cosas.
   */
  const recalculatePropsFromMessages = useCallback(() => {
    let newValuesProperties = { ...valuesProperties };

    if (tableValues.some((o) => o[INTERNAL_FIELDS_DATA.MESSAGES].length > 0))
      newValuesProperties.actionMessages = true;
    else newValuesProperties.actionMessages = false;

    setValuesProperties(newValuesProperties);

    updateWidthActions(newValuesProperties);
  }, [valuesProperties, tableValues, fieldCatalog]);

  /**
   * Actualiza el ancho de la columna de acciones en base a los botones que se muestran
   */
  const updateWidthActions = useCallback(
    (valuesProperties) => {
      let newFieldCatalog = [...fieldCatalog];

      let index = fieldCatalog.findIndex(
        (row) => row.id === COLUMN_PROPERTIES.ACTIONS
      );
      newFieldCatalog[index].width =
        calculateNumberActionButton(valuesProperties) *
        COLUMN_ACTION.WIDTH_ICON;

      setFieldCatalog(newFieldCatalog);
    },
    [fieldCatalog]
  );

  /**
   * Guarda los valores pasados por parámetros. Aunque esos valores se ajustan para el funcionamiento de la tabla
   * @param {Array} columns | Array con los campos a mostrar en la tabla
   * @param {Array} values | Array con los valores de la tabla
   * @returns {object} Propiedadess segun los valores.
   */
  const setData = useCallback((columns, values, tableProps) => {
    setOriginalValues(values);
    const { data: newValues, valuesProperties: newValuesProperties } = fillData(
      columns,
      values,
      tableProps
    );

    setTableValues(newValues);
    setValuesProperties(newValuesProperties);

    return newValuesProperties;
  }, []);
  /**
   * Función que se lanzará cuando se pulse el botón de editar, y cancelar la fila de la tabla.
   * Esto lo que hará es marcar esa fila como editabke
   * @param {object} instance | Instancia con los datos de la fila que devuelve UI5
   */
  const actionActiveEditRow = useCallback(
    (instance) => {
      setTableValues(enabledRowEditing(tableValues, getTabix(instance)));
    },
    [tableValues]
  );

  /**
   * Función que se lanzará cuando se pulse el botón de declinar el cambio. Esto aparte de dejar la
   * fila como no editable, se deshacen los cambios realizados.
   * @param {object} instance | Instancia con los datos de la fila que devuelve UI5
   */

  const actionDeclineEditRow = useCallback(
    (instance) => {
      setTableValues(
        setStatusRow(
          disableRowEditing(
            undoRowDataChanged(tableValues, getTabix(instance)),
            getTabix(instance)
          ),
          getTabix(instance),
          ValueState.None
        )
      );
    },
    [tableValues, fieldCatalog]
  );
  /**
   * Función que se lanzará cuando se pulse el botón de confirmar el cambio. Este proceso realiza los siguientes pasos:
   * 1) Recuperar el valor original de la fila, construir un registro con los campos originales pero con los nuevos valores.
   * Esto lo hago porque no quiero pasar a la función onRowUpdate la fila con los campos internos de la tabla. Es feo.
   * 2) Llamar a la función onRowUpdate del parámetro 'propsEditable'
   * 3) Si el proceso va bien entonces se actualiza el registro original con los nuevos valores
   * 4) Si va mal marcar de alguna la fila como errónea.
   * @param {object} instance | Instancia con los datos de la fila que devuelve UI5
   * @param {Object} propsEditable | Props pasadas para las edición de datos
   */

  const actionConfirmEditRow = useCallback(
    (instance, propsEditable) => {
      if (existErrorInRow(instance)) {
        showToast(
          getI18nText(
            "customAnalyticTable.localization.validations.rowWithErrors"
          ),
          MESSAGE.TYPE.INFO
        );
      } else {
        let originalRow = originalValues[getTabix(instance)];
        let changedRow = tableValues[getTabix(instance)];
        let updateRow = {};

        for (const key in originalRow) {
          // Los campos que comiencen por "__" son internos de objeto y no voy a copiarlo.
          if (key.substring(0, 2) != "__") updateRow[key] = changedRow[key];
        }
        propsEditable
          .onRowUpdate(updateRow, originalRow)
          .then((result) => {
            setTableValues(
              setStatusRow(
                disableRowEditing(
                  updateOriginalData(tableValues, getTabix(instance)),
                  getTabix(instance)
                ),
                getTabix(instance),
                ANALYTIC_TABLE.ROW_HIGHLIGHT.NONE
              )
            );
          })
          .catch((reason) => {
            setTableValues(
              addMessage(tableValues, getTabix(instance), {
                ...DEFAULT_ROW_MESSAGE,
                state: ValueState.Error,
                message: reason,
              })
            );
          });
      }
    },
    [tableValues, fieldCatalog, originalValues]
  );
  /**
   * Función que se lanzará cuando se pulse el botón de eliminar.
   * @param {object} instance | Instancia con los datos de la fila que devuelve UI5
   */
  const actionDeleteRow = useCallback((instance)=>{
    setInstanceToDelete(instance)
    setOpenPopupConfirmDelete(true)
  },[])

  const actionConfirmDeleteRow=useCallback((instance)=>{},[]) 
  /**
   * Función que mostrará los mensajes que hay a nivel de fila
   * @param {object} instance | Instancia con los datos de la fila que devuelve UI5
   */

  const actionOpenShowMessagesRow = useCallback((instance) => {
    let messagesPopup = [];
    messagesPopup = instance.row.original[INTERNAL_FIELDS_DATA.MESSAGES].map(
      (message) => {
        return {
          titleText:
            message.column === ""
              ? message.message
              : instance.columns.find((column) => column.id === message.column)
                  .Header,
          subtitleText: message.column != "" ? message.message : "",
          type: message.state,
        };
      }
    );
    setRowMessages(messagesPopup);
    setOpenPopupMessages(true);
  }, []);
  const actionCloseShowMessagesRow = useCallback(() => {
    setRowMessages([]);
    setOpenPopupMessages(false);
  }, []);

  /**
   * Rellena la estructura de las propiedades de la tabla que no son las propias del control de ui5.
   * @param {Array} columns | Array con los campos a mostrar en la tabla
   * @returns Objeto con las propiedas
   */
  const setTableProperties = useCallback((props) => {
    const newTableProps = { ...DEFAULT_TABLE_PROPS };

    if (props.allowDelete != undefined)
      newTableProps.allowDelete = props.allowDelete;

    if (props.allowEdit != undefined) newTableProps.allowEdit = props.allowEdit;

    setTableProps(newTableProps);

    return newTableProps;
  }, []);

  return {
    fieldCatalog,
    buildFieldCatalog,
    tableValues,
    setData,
    tableProps,
    setTableProperties,
    openPopupMessages,
    actionCloseShowMessagesRow,
    rowMessages,
    openPopupConfirmDelete
  };
}
