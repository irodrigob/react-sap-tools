export interface ErrorBaseProps {
  networkError: boolean;
  HTTPStatusCode?: number;
  singleMessage: string;
  messages: string[];
  invalidArgs?: object;
}

export default class ErrorBase {
  protected error: ErrorBaseProps;

  constructor(errorProps: ErrorBaseProps) {
    this.error = errorProps;
  }
  getError(): ErrorBaseProps {
    return this.error;
  }
}
