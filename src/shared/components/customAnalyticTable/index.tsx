import { FC } from "react";
import { AnalyticalTablePropTypes } from "@ui5/webcomponents-react";
import type { ColumnDefinition } from "shared/components/customAnalyticTable/types/column";
import { Result } from "shared/components/customAnalyticTable/core/Result";
import { EditableDefinition } from "shared/components/customAnalyticTable/types/editable";

export interface AnalyticTableProps<T>
  extends Omit<AnalyticalTablePropTypes, "columns"> {
  columns: ColumnDefinition;
  /**
   * Indica si es editable la tabla a nivel general
   */
  allowEdit: boolean;
  /**
   * Indica si se pueden borrar registros a nivel general
   */
  allowDelete: boolean;
  editable?: EditableDefinition<T>;
}

const CustomAnalyticalTable = <T extends object>(
  props: AnalyticTableProps<T>
) => {
  return <p></p>;
};

export default CustomAnalyticalTable;
