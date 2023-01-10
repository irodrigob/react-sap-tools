import { FC } from "react";
import {
  Dialog,
  Button,
  Bar,
  Form,
  FormItem,
  CheckBox,
} from "@ui5/webcomponents-react";
import { useForm, Controller } from "react-hook-form";
import TextField from "@mui/material/TextField";
import { useTranslations } from "translations/i18nContext";
import FooterDialog from "shared/frontend/components/footerDialog";
import { TunnelConfigurationDTO } from "ngrokTunnel/infraestructure/dto/tunnelDTO";
import ErrorGraphql from "shared/errors/ErrorGraphql";
import useSystems from "systems/infraestructure/frontend/hooks/useSystems";
import { responseTunnelConfigRepo } from "ngrokTunnel/infraestructure/types/repository";

type FormValues = {
  authToken: string;
  apiToken: string;
};

interface Props {
  open: boolean;
  onCloseButton: () => void;
}
const PopupTunnelConfiguration: FC<Props> = (props) => {
  const { open, onCloseButton } = props;
  const { getI18nText } = useTranslations();
  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<FormValues>();

  /*************************************
   * Funciones
   ************************************/
  const onSubmitForm = (data: FormValues) => {};

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
      <Form>
        <FormItem
          children={
            <Controller
              name="authToken"
              control={control}
              defaultValue=""
              render={({
                field: { onChange, value },
                fieldState: { error },
              }) => (
                <TextField
                  label={getI18nText("tunneling.labelAuthToken")}
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
            />
          }
        />
        <FormItem
          children={
            <Controller
              name="apiToken"
              control={control}
              defaultValue=""
              render={({
                field: { onChange, value },
                fieldState: { error },
              }) => (
                <TextField
                  label={getI18nText("tunneling.labelApiToken")}
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
            />
          }
        />
      </Form>
    </Dialog>
  );
};

export default PopupTunnelConfiguration;
