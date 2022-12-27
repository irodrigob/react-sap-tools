import { AnalyticalTableColumnDefinition } from "@ui5/webcomponents-react";

export interface ColumnDefinition extends AnalyticalTableColumnDefinition {
  /**
   * Indica si el campo es editable por defecto es false
   */
  edit?: boolean;
  /**
   * En caso que el campo sea editable indica si se quiere validar si el campo es obligatorio. Solo
   * tiene usarlo si el campo es editable.
   */
  required?: boolean;
  /**
   * Solo aplica cuando se le pasa una columna de acciones a la tabla y se quiere poder editar o eliminar registros.
   * El indicar el numero de iconos de las acciones facilitará el calculo del ancho de la columna de acciones que viene
   * a la tabla + acciones propias del control.
   */
  numberIcons?: number;
}
