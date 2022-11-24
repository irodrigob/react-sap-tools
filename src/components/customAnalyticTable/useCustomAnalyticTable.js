import { useState, useCallback, useEffect } from "react";
import { ValueState } from "@ui5/webcomponents-react";
import CellActions from "./cellActions";
import CellEdit from "./cellEdit";
import CellView from "./cellView";
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
  const [propsEditable, setPropsEditable] = useState({});
  const {
    fillData,
    updateCellValue,
    setFieldCatalog: setFieldCatalogDataManager,
    undoRowDataChanged,
    disableRowEditing,
    enabledRowEditing,
    updateRowOriginalData,
    setStatusRow,
    getTabix,
    propagateValidationValue,
    existErrorInRow,
    addMessage,
    getRowOriginalData,
    convertFieldsInternalRow2External,
  } = useDataManager();
  const { rowValidations } = useDataValidations();
  const [openPopupMessages, setOpenPopupMessages] = useState(false);
  const [openPopupConfirmDelete, setOpenPopupConfirmDelete] = useState(false);
  const [instanceToDelete, setInstanceToDelete] = useState({});
  const [rowMessages, setRowMessages] = useState([]);

  // Aquí voy a guardar propiedases que me servirán para construir la tabla
  const [valuesProperties, setValuesProperties] = useState({
    ...DEFAULT_VALUES_PROPERTIES,
  });

  /**
   * Nota Iván del futuro: El tableValues sirve para alimentar el componente de la tabla de UI5 pero
   * no lo uso internamente porque a veces no esta informado. Lo soluciono utilizando los datos que vienen en
   * el objeto instance. Este objeto contiene toda la info de la tabla de UI5. Lo mismo aplica para las columnas
   */

  /*************************************
   * Efectos
   ************************************/
  /* Cualquier cambio en el catalogo de campo se actualiza dichos valores en el
  hook de gestión de datos.
  */
  /*useEffect(() => {
    setFieldCatalogDataManager(fieldCatalog);
  }, [fieldCatalog]);*/

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
    (valuesProps, propsEditable, columns) => {
      let buttonNumbers = calculateNumberActionButton(valuesProps);

      if (buttonNumbers > 0) {
        let customCellsActionsIndex = columns.findIndex(
          (o) => o.accessor == COLUMN_PROPERTIES.ACTIONS
        );

        let widthCell = buttonNumbers * COLUMN_ACTION.WIDTH_ICON;
        if (customCellsActionsIndex != -1)
          widthCell += columns[customCellsActionsIndex].width;

        return {
          /*

          */
          Cell: (instance) => {
            return (
              <>
                <span style={{ marginRight: "0.5rem" }}>
                  {instance.cell.column[
                    COLUMN_PROPERTIES.CELL_ORIGINAL_ACTIONS
                  ].Cell(instance)}
                </span>
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
                  onClickDelete={() => {
                    actionDeleteRow(instance);
                  }}
                />
              </>
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
          accessor: COLUMN_PROPERTIES.ACTIONS,
          width: "200",
          [COLUMN_PROPERTIES.CELL_ORIGINAL_ACTIONS]:
            customCellsActionsIndex != -1
              ? columns[customCellsActionsIndex]
              : null,
        };
      } else {
        return null;
      }
    },
    [tableValues, fieldCatalog, originalValues]
  );

  /**
   * Calcula el numero de botones según las propiedades de los valores
   * @param {object} valuesProps | Propiedades segun datos
   * @returns {integer} | Numero de botones
   */
  const calculateNumberActionButton = useCallback(
    (valuesProps) => {
      let buttonNumbers = 0;

      if (valuesProps.actionDelete) buttonNumbers += 1;
      if (valuesProps.actionEdit) buttonNumbers += 1;
      if (valuesProps.actionMessages) buttonNumbers += 1;
      if (tableProps.isTreeTable) buttonNumbers += 1;

      return buttonNumbers;
    },
    [tableProps]
  );

  /**
   * Columnas a medida en el catalogo de campos
   * @param {Array} columns | Configuración de columnas de la tabla.
   * @returns {Array} | Columnas con la propiedad Cell añadida con el control deseado
   */
  const customCellColumns = useCallback(
    (columns) => {
      let newColumns = [];
      columns.forEach((column) => {
        let newColumn = { ...column };

        newColumn[COLUMN_PROPERTIES.COMPONENT_TYPE] =
          column[COLUMN_PROPERTIES.COMPONENT_TYPE] != undefined
            ? column[COLUMN_PROPERTIES.COMPONENT_TYPE]
            : "";

        // El tipo de campo varia si la columna es editable o no.
        if (column[COLUMN_PROPERTIES.EDIT] === true) {
          newColumn = customEditCellColumn(newColumn);
        }
        // Si no es editable se mira que tenga el campo de "ComponentType" informado y con datos
        // y además que no tenga el atributo "Cell" predefinido.
        else if (
          column[COLUMN_PROPERTIES.COMPONENT_TYPE] != undefined &&
          column[COLUMN_PROPERTIES.COMPONENT_TYPE] != "" &&
          column[ANALYTIC_TABLE.COLUMNS.CELL_COMPONENT] == undefined
        ) {
          newColumn = customViewCellColumn(newColumn);
        }
        newColumns.push(newColumn);
      });
      return newColumns;
    },
    [tableValues, fieldCatalog, propsEditable]
  );
  /**
   * Columna editable a medida
   * @param {object} column | Columna de datos
   * @returns
   */
  const customEditCellColumn = useCallback(
    (column) => {
      let newColumn = { ...column };

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
              const { onRowValidation } = propsEditable;
              let returnValidations = rowValidations(
                instance,
                cellValue,
                onRowValidation
              );

              setTableValues(
                propagateValidationValue(
                  instance.data,
                  getTabix(instance),
                  returnValidations
                )
              );
            }}
            type={column.type}
          />
        );
      };

      return newColumn;
    },
    [propsEditable]
  );

  /**
   * Column de visualización a medida
   * @param {object} column | Datos de la columna
   * @returns Columna adaptada
   */
  const customViewCellColumn = (column) => {
    let newColumn = column;

    newColumn[ANALYTIC_TABLE.COLUMNS.CELL_COMPONENT] = (instance) => {
      return <CellView instance={instance} />;
    };

    return newColumn;
  };
  /**
   * Construye el catalogo de campos para la tabla en base a las columnas pasadas. Cosas que realiza:
   * 1.- Añade una columna de acciones cuando alguno campo tiene el atributo "EDIT" y la tabla a nivel general se puede editar. O
   * bien la tabla puede borrar registros.
   * @param {Array} columns | Array con los campos a mostrar en la tabla
   * @param {Object} valuesProperties | Propiedas general según los valores.
   * @param {Object} propsEditable | Props pasadas para las edición de datos
   * @param {Object} tableProps | Props determinas de la tabla
   */
  const buildFieldCatalog = useCallback(
    (columns, valuesProperties, propsEditable, tableProps) => {
      let newFieldCatalog = [];

      // Columnas a añadir. Si la tabla tendrá acciones propias, por temas de edición,
      // las acciones que se pasen en el catalogo se añadirán a las propias y se excluirán
      // cuando se añadan al catalogo final.
      let columnsToAdd = [];

      if (Array.isArray(columns) && columns.length > 0) {
        // Columnas de acciones si hay edición o se puede borrar filas.
        if (
          (columns.some((o) => COLUMN_PROPERTIES.EDIT in o) &&
            tableProps.allowEdit) ||
          tableProps.allowDelete ||
          columns.findIndex((o) => o.accessor == COLUMN_PROPERTIES.ACTIONS) !=
            -1
        ) {
          let actionColumn = addColumnActions(
            valuesProperties,
            propsEditable,
            columns
          );

          if (actionColumn) newFieldCatalog.push(actionColumn);

          columnsToAdd = columns.filter(
            (o) => o.accessor != COLUMN_PROPERTIES.ACTIONS
          );
        } else {
          columnsToAdd = columns;
        }

        newFieldCatalog = newFieldCatalog.concat(
          customCellColumns(columnsToAdd)
        );

        setFieldCatalog(newFieldCatalog);
      }
    },
    []
  );
  /**
   * Recalcula las propiedades en base a los valores de la tabla y lanza
   * los procesos que usan dichas propiedas para calcular o pintar cosas.
   */
  const recalculatePropsFromMessages = useCallback(() => {
    let newValuesProperties = { ...valuesProperties };

    if (
      tableValues.some(
        (o) =>
          o[INTERNAL_FIELDS_DATA.MESSAGES] &&
          o[INTERNAL_FIELDS_DATA.MESSAGES].length > 0
      )
    )
      newValuesProperties.actionMessages = true;
    else newValuesProperties.actionMessages = false;

    setValuesProperties(newValuesProperties);

    updateWidthActions(newValuesProperties);
  }, [valuesProperties, tableValues, fieldCatalog, tableProps]);

  /**
   * Actualiza el ancho de la columna de acciones en base a los botones que se muestran
   */
  const updateWidthActions = useCallback(
    (valuesProperties) => {
      let index = fieldCatalog.findIndex(
        (row) => row.id === COLUMN_PROPERTIES.ACTIONS
      );
      if (index !== -1) {
        let newFieldCatalog = [...fieldCatalog];

        let numberButtons = calculateNumberActionButton(valuesProperties);
        if (numberButtons > 0)
          newFieldCatalog[index].width =
            numberButtons * COLUMN_ACTION.WIDTH_ICON;

        setFieldCatalog(newFieldCatalog);
      }
    },
    [fieldCatalog, tableProps]
  );

  /**
   * Guarda los valores pasados por parámetros. Aunque esos valores se ajustan para el funcionamiento de la tabla
   * @param {Array} columns | Array con los campos a mostrar en la tabla
   * @param {Array} values | Array con los valores de la tabla
   * @returns {object} Propiedadess segun los valores.
   */
  const setData = useCallback(
    (columns, values, tableProps) => {
      setOriginalValues(values);
      const { data: newValues, valuesProperties: newValuesProperties } =
        fillData(columns, values, tableProps);

      setTableValues(newValues);
      setValuesProperties(newValuesProperties);

      return newValuesProperties;
    },
    [tableValues, valuesProperties]
  );
  /**
   * Función que se lanzará cuando se pulse el botón de editar, y cancelar la fila de la tabla.
   * Esto lo que hará es marcar esa fila como editabke
   * @param {object} instance | Instancia con los datos de la fila que devuelve UI5
   */
  const actionActiveEditRow = useCallback(
    (instance) => {
      setTableValues(enabledRowEditing(instance.data, getTabix(instance)));
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
            undoRowDataChanged(
              instance.data,
              instance.columns,
              getTabix(instance)
            ),
            getTabix(instance)
          ),
          getTabix(instance),
          ValueState.None
        )
      );
    },
    [tableValues, fieldCatalog, originalValues]
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
        let originalRow = getRowOriginalData(
          instance.data,
          instance.columns,
          getTabix(instance)
        );
        let changedRow = convertFieldsInternalRow2External(
          instance.data[getTabix(instance)]
        );

        propsEditable
          .onRowUpdate(changedRow, originalRow)
          .then((result) => {
            setTableValues(
              setStatusRow(
                disableRowEditing(
                  updateRowOriginalData(
                    instance.data,
                    instance.columns,
                    getTabix(instance)
                  ),
                  getTabix(instance)
                ),
                getTabix(instance),
                ANALYTIC_TABLE.ROW_HIGHLIGHT.NONE
              )
            );
          })
          .catch((reason) => {
            setTableValues(
              addMessage(instance.data, getTabix(instance), {
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
  const actionDeleteRow = useCallback((instance) => {
    setInstanceToDelete(instance);
    setOpenPopupConfirmDelete(true);
  }, []);

  const actionCloseConfirmDeleteRow = useCallback(
    (event) => {
      switch (event.detail.action) {
        case "OK":
          propsEditable
            .onRowDelete(
              convertFieldsInternalRow2External(instanceToDelete.row.original)
            )
            .then((result) => {
              /*
          setTableValues(
            setStatusRow(
              disableRowEditing(
                updateRowOriginalData(tableValues, getTabix(instance)),
                getTabix(instance)
              ),
              getTabix(instance),
              ANALYTIC_TABLE.ROW_HIGHLIGHT.NONE
            )
          );*/
            })
            .catch((reason) => {
              setTableValues(
                addMessage(tableValues, getTabix(instanceToDelete), {
                  ...DEFAULT_ROW_MESSAGE,
                  state: ValueState.Error,
                  message: reason,
                })
              );
            });
          break;
        case "Cancel":
          break;
      }
      setInstanceToDelete({});
      setOpenPopupConfirmDelete(false);
    },
    [instanceToDelete]
  );

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

    if (props.isTreeTable != undefined)
      newTableProps.isTreeTable = props.isTreeTable;

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
    openPopupConfirmDelete,
    actionCloseConfirmDeleteRow,
    setPropsEditable,
  };
}
