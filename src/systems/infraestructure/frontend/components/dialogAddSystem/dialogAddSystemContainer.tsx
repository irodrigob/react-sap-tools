import { useState, FC, ReactNode } from "react";
import {
  Dialog,
  Button,
  Bar,
  Form,
  FormItem,
  CheckBox,
} from "@ui5/webcomponents-react";
import { useForm, Controller } from "react-hook-form";
import { useTranslations } from "translations/i18nContext";
import FooterDialog from "systems/infraestructure/frontend/components/dialogAddSystem/footerDialog";

interface Props {
  open: boolean;
  onCloseButton: () => void;
  children?: ReactNode;
}
const DialogAddSystem: FC<Props> = (props) => {
  const { onCloseButton, open } = props;
  const { getI18nText } = useTranslations();
  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm();
  const [btnSaveDisabled, setBtnSaveDisabled] = useState(false);
  /*************************************
   * Funciones
   ************************************/
  const onSubmitForm = () => {};

  return (
    <Dialog
      open={open}
      headerText={getI18nText("editSystem.titleAddSystem")}
      footer={
        <FooterDialog
          onCloseButton={() => {
            reset();
            onCloseButton();
          }}
          onSaveButton={handleSubmit(onSubmitForm)}
          btnSaveDisabled={btnSaveDisabled}
        />
      }
    >
      <Form>
        <FormItem></FormItem>
      </Form>
    </Dialog>
  );
};

export default DialogAddSystem;
