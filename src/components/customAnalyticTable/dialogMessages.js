import { Dialog, Button, Bar } from "@ui5/webcomponents-react";
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

  return (
    <Dialog
      open={open}
      headerText={"customAnalyticTable.localization.dialogMessages.title"}
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
      <p>prueba</p>
    </Dialog>
  );
}
