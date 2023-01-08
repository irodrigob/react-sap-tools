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
import FooterDialog from "shared/frontend/components/footerDialog";

interface Props {
  open: boolean;
  onCloseButton: () => void;
}
const PopupTunnelConfiguration: FC<Props> = (props) => {
  const { open, onCloseButton } = props;
  const { getI18nText } = useTranslations();

  return (
    <Dialog
      open={open}
      headerText={getI18nText("editSystem.titleAddSystem")}
      footer={
        <FooterDialog
          textStartButton={getI18nText("general.btnTxtSave")}
          textEndButton={getI18nText("general.btnTxtCancel")}
          onEndButton={() => {
            //reset();
            onCloseButton();
          }}
          onStartButton={() => {
            //handleSubmit(onSubmitForm)
          }}
        />
      }
    >
      <p>gola</p>
    </Dialog>
  );
};

export default PopupTunnelConfiguration;
