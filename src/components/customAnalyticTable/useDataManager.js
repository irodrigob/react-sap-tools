import { useCallback, useState } from "react";
import {
  COLUMN_PROPERTIES,
  DEFAULT_TABLE_PROPS,
  DEFAULT_VALUES_PROPERTIES,
  INTERNAL_FIELDS_DATA,
  ANALYTIC_TABLE,
} from "./constants";

/**
 * El objetivo de este HOOK es el tratamiento de los datos, en ningún caso se guardan datos.
 * Solo se hacen operaciones con ellos. Los datos se guardan en el hook useCustomAnalyticTable.
 * Lo que si se guardan datos que son inamovibles como el catalogo de campos
 */
export default function useDataManager() {
  const [fieldCatalog, setFieldCatalog] = useState([]);

  /**
   * Adapta los valores de la tabla añadiendole campos internos segun las columnas pasadas
   * @param {Array} columns | Array con los campos a mostrar en la tabla
   * @param {Array} values | Array con los valores de la tabla
   * @returns {object} Propiedadess segun los valores.
   */
  const fillData = useCallback((columns, values, tableProps) => {
    let newValues = [];
    let newValuesProperties = { ...DEFAULT_VALUES_PROPERTIES };

    // Primero sacamos los campos que tiene la propiedad editable
    let editColumns = [];

    if (tableProps.allowEdit)
      editColumns = columns.filter(
        (row) => row[COLUMN_PROPERTIES.EDIT] == true
      );

    let tabix = 0;
    values.forEach((row, indexValue) => {
      // Se añaden los campos más unos campos fijos para determinar si se puede borrar
      // o editar la fila.
      var newRow = {
        ...row,
      };
      newRow[INTERNAL_FIELDS_DATA.ROW_TABIX] = tabix;
      tabix += 1;

      // Si el campo que permite indicar el borrado de la fila la añado en base a la prop global
      if (INTERNAL_FIELDS_DATA.DELETABLE in newRow === false)
        newRow = {
          ...newRow,
          [INTERNAL_FIELDS_DATA.DELETABLE]: tableProps.allowDelete,
        };

      // Si es editable y además hay columnas que son editables se añaden los siguientes campos al modelo
      if (tableProps.allowEdit && editColumns.length > 0) {
        // Campo para indicar si la fila se esta editando.
        newRow = { ...newRow, [INTERNAL_FIELDS_DATA.ROW_EDITING]: false };

        // Campo que indica si la fila puede ser editable. Esto servirá para mostrar o no el icono de edición
        if (INTERNAL_FIELDS_DATA.EDITABLE in newRow === false)
          newRow = {
            ...newRow,
            [INTERNAL_FIELDS_DATA.EDITABLE]: tableProps.allowEdit,
          };

        // Como para la edición se activará el rowHighLigth de la tabla hay que añadir el campo "status", si no lo esta.
        if (ANALYTIC_TABLE.COLUMNS.ROW_HIGHLIGHT in newRow === false)
          newRow = {
            ...newRow,
            [ANALYTIC_TABLE.COLUMNS.ROW_HIGHLIGHT]:
              ANALYTIC_TABLE.ROW_HIGHLIGHT.NONE,
          };
      }

      // Pongo las propiedades según los valores de la tabla

      if (newRow[INTERNAL_FIELDS_DATA.EDITABLE])
        newValuesProperties.actionEdit = true;

      if (newRow[INTERNAL_FIELDS_DATA.DELETABLE])
        newValuesProperties.actionDelete = true;

      // El campo para indicar si se mostrará los highLight puede ser forzado, por que hay campos editables, o viene de serie
      // porque en la tabla ya viene informado.
      if (ANALYTIC_TABLE.COLUMNS.ROW_HIGHLIGHT in newRow)
        newValuesProperties.showRowHighLight = true;

      editColumns.forEach((column) => {
        // Se añade un campo con el mismo nombre el cual editable añadiendo el sufijo "_edit" y
        // el campo con el valor original
        newRow = {
          ...newRow,
          [column.accessor + INTERNAL_FIELDS_DATA.SUFFIX_EDIT]:
            column[COLUMN_PROPERTIES.EDIT],
          [INTERNAL_FIELDS_DATA.PREFIX_ORIGINAL_VALUE + column.accessor]:
            newRow[column.accessor],
        };
      });

      newValues.push(newRow);
    });
    return { data: newValues, valuesProperties: newValuesProperties };
  }, []);

  /**
   *
   * @param {Array} data | Array con los datos donde se actualiza
   * @param {number} index | Indice de la posición de la tabla
   * @param {string} field | Campo a actualizar
   * @param {any} value | Valor a actualizar
   * @returns Array con los nuevos valores
   */
  const updateCellValue = useCallback((data, index, field, value) => {
    let newTable = [...data];
    newTable[index][field] = value;
    return newTable;
  }, []);

  /**
   * Deshace los cambios realizados en los campos editables en una fila concreta.
   * @param {array} data
   * @param {number} index
   * @returns Array con los valores actualizados
   */
  const undoRowDataChanged = useCallback(
    (data, index) => {
      let newTable = [...data];

      fieldCatalog
        .filter((column) => column[COLUMN_PROPERTIES.EDIT] == true)
        .forEach((column) => {
          newTable[index][column.accessor] =
            newTable[index][
              INTERNAL_FIELDS_DATA.PREFIX_ORIGINAL_VALUE + column.accessor
            ];
        });

      return newTable;
    },
    [fieldCatalog]
  );

  /**
   * Desactiva el modo edición de una fila
   * @param {array} data
   * @param {number} index
   * @returns Array con los valores actualizados
   */
  const disableRowEditing = useCallback((data, index) => {
    let newTable = [...data];
    newTable[index][INTERNAL_FIELDS_DATA.ROW_EDITING] = false;
    return newTable;
  }, []);

  /**
   * Activa el modo edición de una fila
   * @param {array} data
   * @param {number} index
   * @returns Array con los valores actualizados
   */
  const enabledRowEditing = useCallback((data, index) => {
    let newTable = [...data];
    newTable[index][INTERNAL_FIELDS_DATA.ROW_EDITING] = true;
    return newTable;
  }, []);

  /**
   * Actualiza los datos original con los datos modificados.
   * @param {array} data
   * @param {number} index
   * @returns Array con los valores actualizados
   */
  const updateOriginalData = useCallback(
    (data, index) => {
      let newTable = [...data];

      fieldCatalog
        .filter((column) => column[COLUMN_PROPERTIES.EDIT] == true)
        .forEach((column) => {
          newTable[index][
            INTERNAL_FIELDS_DATA.PREFIX_ORIGINAL_VALUE + column.accessor
          ] = newTable[index][column.accessor];
        });

      return newTable;
    },
    [fieldCatalog]
  );

  /**
   * Informa un status en una fila en concreto.
   * @param {array} data
   * @param {number} index
   * @param {string} status
   * @returns Array con los valores actualizados
   */
  const setStatusRow = (data, index, status) => {
    return updateCellValue(
      data,
      index,
      ANALYTIC_TABLE.COLUMNS.ROW_HIGHLIGHT,
      status
    );
  };

  return {
    fillData,
    updateCellValue,
    setFieldCatalog,
    undoRowDataChanged,
    disableRowEditing,
    enabledRowEditing,
    updateOriginalData,
    setStatusRow,
  };
}
