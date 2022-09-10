// Campos fijos en las propiedas de las columnas o catalogo de campos.
export const COLUMN_PROPERTIES = {
  EDIT: "edit",
  REQUIRED: "required",
};

// Campos o partes de campos internos que se añadirán a los valores pasados a la tabla
export const INTERNAL_FIELDS_DATA = {
  EDITABLE: "catbl_editable",
  DELETABLE: "catbl_deletable",
  ROW_EDITING: "catbl_row_editing",
  ROW_TABIX: "catbl_row_tabix",
  PREFIX_ORIGINAL_VALUE: "catbl_original_value_",
  SUFFIX_EDIT: "_edit",
};

// Propiedas por defecto de la tabla, son propiedas fuera de las estándar del propio control.
export const DEFAULT_TABLE_PROPS = {
  allowDelete: true,
  allowEdit: true,
};

// Propiedades según los valores de la tabla.
export const DEFAULT_VALUES_PROPERTIES = {
  actionDelete: false,
  actionEdit: false,
  showRowHighLight: false,
};

// Constantes sobre la tabla análitica estándar del componente de UI5
export const ANALYTIC_TABLE = {
  COLUMNS: {
    CELL_COMPONENT: "Cell",
    ROW_HIGHLIGHT: "status",
  },
  ROW_HIGHLIGHT: {
    NONE: "None",
    SUCCESS: "Success",
    WARNING: "Warning",
    ERROR: "Error",
    INFORMATION: "Information",
  },
};
