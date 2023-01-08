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
  onEndButton: () => void;
  onStartButton: () => void;
  disabledStartButton?: boolean;
  textStartButton: string;
  textEndButton: string;
  slot?: string;
}

const FooterDialog: FC<Props> = (props) => {
  const {
    onStartButton,
    onEndButton,
    disabledStartButton,
    slot,
    textStartButton,
    textEndButton,
  } = props;
  const { getI18nText } = useTranslations();

  return (
    <Bar
      slot={slot}
      design="Footer"
      startContent={
        <Button
          style={{ marginTop: "1rem" }}
          onClick={onStartButton}
          disabled={disabledStartButton}
        >
          {textStartButton}
        </Button>
      }
      endContent={
        <Button style={{ marginTop: "1rem" }} onClick={onEndButton}>
          {textEndButton}
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
