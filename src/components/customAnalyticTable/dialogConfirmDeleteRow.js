import { MessageBox } from "@ui5/webcomponents-react";
import { useTranslations } from "translations/i18nContext";

export default function DialogConfirmDeleteRow(props) {
  const { open, onClose } = props;
  const { getI18nText } = useTranslations();

  return (
    <>
      <MessageBox
        open={open}
        onClose={onClose}
        titleText={getI18nText(
          "customAnalyticTable.localization.editRow.deleteTitle"
        )}
      >
        {getI18nText("customAnalyticTable.localization.editRow.deleteText")}
      </MessageBox>
    </>
  );
}
