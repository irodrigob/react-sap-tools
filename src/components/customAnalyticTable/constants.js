import { ValueState } from "@ui5/webcomponents-react";

// Campos fijos en las propiedas de las columnas o catalogo de campos.
export const COLUMN_PROPERTIES = {
  EDIT: "edit",
  REQUIRED: "required",
  ACTIONS: "actions",
};

export const COLUMN_ACTION = {
  WIDTH_ICON: 40,
};

export const INTERNAL_FIELD_PATTERN = "calt";

// Campos o partes de campos internos que se añadirán a los valores pasados a la tabla
export const INTERNAL_FIELDS_DATA = {
  EDITABLE: `${INTERNAL_FIELD_PATTERN}_editable`,
  DELETABLE: `${INTERNAL_FIELD_PATTERN}_deletable`,
  EDITING: `${INTERNAL_FIELD_PATTERN}_editing`,
  TABIX: `${INTERNAL_FIELD_PATTERN}_tabix`,
  MESSAGES: `${INTERNAL_FIELD_PATTERN}_messages`,
  PREFIX_VALUE_STATE: `${INTERNAL_FIELD_PATTERN}_valueState_`,
  PREFIX_VALUE_STATE_MESSAGE: `${INTERNAL_FIELD_PATTERN}_valueStateMessage_`,
  PREFIX_ORIGINAL_VALUE: `${INTERNAL_FIELD_PATTERN}_original_value_`,
  SUFFIX_EDIT: `_${INTERNAL_FIELD_PATTERN}_edit`,
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
  actionMessages: false,
  showRowHighLight: false,
};

// Constantes sobre la tabla análitica estándar del componente de UI5
export const ANALYTIC_TABLE = {
  COLUMNS: {
    CELL_COMPONENT: "Cell",
    ROW_HIGHLIGHT: "status",
  },
};

// Estructura de campos para los errores a nivel de fila o columna con sus valores por defecto.
export const DEFAULT_ROW_MESSAGE = {
  column: "",
  state: ValueState.None,
  message: "",
};

export const DEFAULT_SINGLE_VALIDATION = { state: "", message: "" };
