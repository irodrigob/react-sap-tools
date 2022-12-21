import type { MessageType } from "shared/types/general";

interface Message {
  type: MessageType;
  field: string;
  message: string;
}
export default class validationBase {
  protected messages: Message[];
  constructor() {
    this.messages = [];
  }
  protected addMessage(message: Message) {
    this.messages.push(message);
  }
  clearMessages() {
    this.messages = [];
  }
  getMessages(): Message[] {
    return this.messages;
  }
}
