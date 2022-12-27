import { ValueState } from "@ui5/webcomponents-react";
import { ValidationDefinition } from "shared/components/customAnalyticTable/types/validations";

export interface EditableDefinition<T> {
  onRowUpdate?: (newData: T, oldData: T) => Promise<Result<T>>;
  onRowDelete?: (oldData: T) => Promise<Result<T>>;
  onRowValidation?: (
    newData: T,
    column: string,
    value: any
  ) => ValidationDefinition[];
}
