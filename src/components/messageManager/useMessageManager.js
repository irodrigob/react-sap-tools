import { useState, useCallback, useEffect } from "react";
import { ValueState } from "@ui5/webcomponents-react";
import { useDispatch, useSelector } from "react-redux";
import * as actions from "components/messageManager/messageManagerSlice";

// Constantes con los tipos de mensajes permitidos por el gestor
export const MESSAGE_TYPE = {
  ERROR: ValueState.Error,
  WARNING: ValueState.Warning,
  SUCCESS: ValueState.Success,
  INFO: ValueState.Information,
  NONE: ValueState.None,
};
export const MESSAGE_TYPE_SAP_2_INTERNAL = {
  E: ValueState.Error,
  W: ValueState.Warning,
  S: ValueState.Success,
  I: ValueState.Information,
  "": ValueState.None,
};

export default function useMessageManager() {
  const { messages, messagesNumber, unreadMessage } = useSelector(
    (state) => state.MessageManager
  );
  const dispatch = useDispatch();

  /*************************************
   * Funciones
   ************************************/

  /**
   * Añade un array de mensajes al gestor de mensaje
   * @param {object} aMessages | Array con con la siguiente estructura
   * type: Tipo de mensaje. Valores posibles: 'Error' - Error, 'W' - Warning y 'S' - Success.
   * message: Texto del mensaje
   * subMesssage: Subtexto del mensaje
   * @param {boolean} bKeepPreviosMessages | Indicador para que se mantengan los mensajes previos
   */
  const addMessagesManager = (aMessages = [], bKeepPreviosMessages = false) => {
    let newMessages = aMessages.map((row) => {
      return {
        type: MESSAGE_TYPE_SAP_2_INTERNAL[row.type]
          ? MESSAGE_TYPE_SAP_2_INTERNAL[row.type]
          : row.type,
        message: row.message,
        subMessage: row.subMessage ? row.subMessage : "",
      };
    });
    // La acción depende de si se quiere mantener los valores previos o no
    if (bKeepPreviosMessages) {
      newMessages = newMessages.concat(messages);
      dispatch(actions.addMessagesAction(newMessages));
    } else {
      dispatch(actions.setMessagesAction(newMessages));
    }

    // Marco que los mensajes no se han leído
    dispatch(actions.unreadMessageAction(true));
  };

  /**
   * Limpia la tabla de mensajes
   */
  const clearMessagesManager = useCallback(() => {
    dispatch(actions.clearMessagesAction());

    dispatch(actions.unreadMessageAction(false));
  }, []);

  /**
   * Establece si los mensajes han sido leídos
   */
  const setUnreadMessages = useCallback((bUnread) => {
    dispatch(actions.unreadMessageAction(bUnread));
  });

  return {
    messages,
    messagesNumber,
    unreadMessage,
    clearMessagesManager,
    addMessagesManager,
    setUnreadMessages,
  };
}
