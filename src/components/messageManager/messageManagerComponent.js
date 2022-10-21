import { useCallback, useEffect, useState, useMemo } from "react";
import { MessageView, MessageViewButton } from "@ui5/webcomponents-react";
import IconInteractive from "components/messageManager/messageManagerIcon";
import { useTranslations } from "translations/i18nContext";
import useMessageManager, {
  MESSAGE_TYPE,
} from "components/messageManager/useMessageManager";

export function MessageManagerButton(props) {
  const { getI18nText, language } = useTranslations();
  const { messages, messagesNumber, unreadMessage } = useSelector(
    (state) => state.MessageManager
  );
  const [messageType, setMessageType] = useState(MESSAGE_TYPE.INFO);

  /*************************************
   * Efectos
   ************************************/
  useEffect(() => {
    if (messages.length > 0) {
      if (messages.find((row) => row.type == MESSAGE_TYPE.ERROR))
        setMessageType(MESSAGE_TYPE.ERROR);
      else if (messages.find((row) => row.type == MESSAGE_TYPE.INFO))
        setMessageType(MESSAGE_TYPE.INFO);
      else if (messages.find((row) => row.type == MESSAGE_TYPE.WARNING))
        setMessageType(MESSAGE_TYPE.WARNING);
      else if (messages.find((row) => row.type == MESSAGE_TYPE.SUCCESS))
        setMessageType(MESSAGE_TYPE.SUCCESS);
      else setMessageType(MESSAGE_TYPE.NONE);
    } else {
      setMessageType(MESSAGE_TYPE.INFO);
    }
  }, [messages]);

  /*************************************
   * Funciones
   ************************************/

  return (
    <IconInteractive
      showTooltip={true}
      accessibleName={getI18nText("messageManager.tooltipMessageIcon")}
    />
  );
}
