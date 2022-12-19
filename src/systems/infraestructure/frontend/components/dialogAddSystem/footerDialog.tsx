import { FC } from "react";
import {
  Dialog,
  Button,
  Bar,
  Form,
  FormItem,
  CheckBox,
} from "@ui5/webcomponents-react";
import { useTranslations } from "translations/i18nContext";

interface Props {
  onCloseButton: () => void;
  onSaveButton: () => void;
  btnSaveDisabled: boolean;
  slot?: string;
}

const FooterDialog: FC<Props> = (props) => {
  const { onCloseButton, onSaveButton, btnSaveDisabled, slot } = props;
  const { getI18nText } = useTranslations();

  return (
    <Bar
      slot={slot}
      design="Footer"
      startContent={
        <Button
          style={{ marginTop: "1rem" }}
          onClick={onSaveButton}
          disabled={btnSaveDisabled}
        >
          {getI18nText("general.btnTxtSave")}
        </Button>
      }
      endContent={
        <Button style={{ marginTop: "1rem" }} onClick={onCloseButton}>
          {getI18nText("general.btnTxtCancel")}
        </Button>
      }
      style={{
        marginTop: "1rem",
        marginBottom: "1rem",
      }}
    />
  );
};

export default FooterDialog;