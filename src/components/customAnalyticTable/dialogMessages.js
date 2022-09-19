import {
  Dialog,
  Button,
  Bar,
  MessageView,
  MessageItem,
} from "@ui5/webcomponents-react";
import { useTranslations } from "translations/i18nContext";

const FooterDialog = (props) => {
  const { onClose } = props;
  const { getI18nText } = useTranslations();

  return (
    <Bar
      slot={props.slot}
      design="Footer"
      endContent={
        <Button style={{ marginTop: "1rem" }} onClick={onClose}>
          {getI18nText(
            "customAnalyticTable.localization.dialogMessages.footer.btnClose"
          )}
        </Button>
      }
      style={{
        marginTop: "1rem",
        marginBottom: "1rem",
      }}
    />
  );
};

export default function DialogMessages(props) {
  const { open, onClose, messages } = props;
  const { getI18nText } = useTranslations();
  /*

*/
  return (
    <>
      {messages.length > 0 && (
        <Dialog
          open={open}
          headerText={getI18nText(
            "customAnalyticTable.localization.dialogMessages.title"
          )}
          draggable={true}
          resizable={true}
          footer={
            <FooterDialog
              onClose={() => {
                onClose();
              }}
            />
          }
        >
          <MessageView>
            {messages.map((row, index) => {
              return (
                <MessageItem
                  key={index}
                  titleText={row.titleText}
                  subtitleText={row.subtitleText}
                  type={row.type}
                />
              );
            })}
          </MessageView>
        </Dialog>
      )}
    </>
  );
}
