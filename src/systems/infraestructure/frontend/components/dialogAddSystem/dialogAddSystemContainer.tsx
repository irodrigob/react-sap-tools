import { useState, FC, ReactNode } from "react";
import {
  Dialog,
  Button,
  Bar,
  Form,
  FormItem,
  CheckBox,
} from "@ui5/webcomponents-react";
import TextField from "@mui/material/TextField";
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
        <FormItem
          children={
            <Controller
              name="name"
              control={control}
              defaultValue=""
              render={({
                field: { onChange, value },
                fieldState: { error },
              }) => (
                <TextField
                  required
                  label={getI18nText("systems.labelName")}
                  variant="filled"
                  value={value}
                  onChange={onChange}
                  error={!!error}
                  helperText={error ? error.message : null}
                  sx={{
                    width: "15em",
                    fontFamily: "var(--sapFontFamily)",
                    fontSize: "var(--sapFontSize)",
                  }}
                />
              )}
              rules={{ required: getI18nText("general.fieldMandatory") }}
            />
          }
        />
        <FormItem
          children={
            <Controller
              name="host"
              control={control}
              defaultValue=""
              render={({
                field: { onChange, value },
                fieldState: { error },
              }) => (
                <TextField
                  required
                  label={getI18nText("systems.labelHOST")}
                  variant="filled"
                  value={value}
                  onChange={onChange}
                  error={!!error}
                  helperText={
                    !!error
                      ? error.type === "validate"
                        ? getI18nText("editSystem.msgErrorHostInvalid")
                        : error.message
                      : null
                  }
                  sx={{ width: "30em" }}
                />
              )}
              rules={{
                required: getI18nText("general.fieldMandatory"),
                validate: (value) => {
                  return true; //validateHost(value);
                },
              }}
            />
          }
        />
      </Form>
    </Dialog>
  );
};

export default DialogAddSystem;
