export interface ValidationMessageDefinition {
  state: ValueState;
  message: string;
}
export interface ValidationDefinition {
  column: string;
  messages: ValidationMessageDefinition[];
}
