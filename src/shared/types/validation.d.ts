import { ValueState } from "@ui5/webcomponents-react";

export interface Validation {
  state: ValueState;
  message: string;
}

export interface RowValidations {
  column?: string;
  value?: any;
  validations?: Validation[];
}
