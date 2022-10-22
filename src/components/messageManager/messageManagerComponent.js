import { useCallback, useEffect, useState, useMemo } from "react";
import {
  MessageView,
  Button,
  Popover,
  MessageItem,
} from "@ui5/webcomponents-react";
import "@ui5/webcomponents-icons/dist/alert";
import IconInteractive from "components/messageManager/messageManagerIcon";
import { useTranslations } from "translations/i18nContext";
import useMessageManager, {
  MESSAGE_TYPE,
} from "components/messageManager/useMessageManager";

function MessageViewComponent(props) {
  return (
    <MessageView>
      {props.messages.map((row, index) => {
        return (
          <MessageItem
            key={index}
            titleText={row.message}
            subtitleText={row.subMessage}
            type={row.type}
          />
        );
      })}
    </MessageView>
  );
}

export function MessageManagerButton(props) {
  const { getI18nText, language } = useTranslations();
  /*const { messages, messagesNumber, unreadMessage } = useSelector(
    (state) => state.MessageManager
  );*/
  const { messages, messagesNumber, unreadMessage } = useMessageManager();
  const [messageType, setMessageType] = useState(MESSAGE_TYPE.INFO);
  const [openMessageView, setOpenMessageView] = useState(false);
  /*************************************
   * Efectos
   ************************************/
  useEffect(() => {
    if (messages.length > 0) {
      if (messages.find((row) => row.type == MESSAGE_TYPE.ERROR))
        setMessageType("Negative");
      else if (messages.find((row) => row.type == MESSAGE_TYPE.INFO))
        setMessageType("Positive");
      else if (messages.find((row) => row.type == MESSAGE_TYPE.WARNING))
        setMessageType("Attention");
      else if (messages.find((row) => row.type == MESSAGE_TYPE.SUCCESS))
        setMessageType("Positive");
      else setMessageType("Transparent");
    } else {
      setMessageType("Positive");
    }
  }, [messages]);

  /*************************************
   * Funciones
   ************************************/
  /*
  <MessageViewButton
      counter={2}
      type={MESSAGE_TYPE.INFO}
      tooltip={getI18nText("messageManager.tooltipMessageIcon")}
    />
*/
  return (
    <>
      <Button
        id="btnMessageManager"
        icon="alert"
        design={messageType}
        onClick={() => {
          setOpenMessageView(true);
        }}
      >
        {messagesNumber}
      </Button>
      <Popover
        opener="btnMessageManager"
        open={openMessageView}
        placementType="Bottom"
        onAfterClose={() => {
          setOpenMessageView(false);
        }}
      >
        <MessageViewComponent messages={messages} />
      </Popover>
    </>
  );
}
