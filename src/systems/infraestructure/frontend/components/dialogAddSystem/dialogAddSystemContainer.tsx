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
import { SystemController } from "systems/infraestructure/controller/SystemController";
import SystemFormatters from "systems/utils/formatters";
import Encrypt from "shared/utils/encrypt/Encrypt";
import System from "systems/domain/entities/system";

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
  const systemController = new SystemController();
  const watchNgrokActive = watch("ngrok_active");

  /*************************************
   * Funciones
   ************************************/
  const onSubmitForm = (data: System | any) => {
    //let newSystem = new System( )
  };

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
                  return systemController.validateHost(value);
                },
              }}
            />
          }
        />

        <FormItem
          children={
            <Controller
              name="sap_user"
              control={control}
              defaultValue=""
              render={({
                field: { onChange, value },
                fieldState: { error },
              }) => (
                <TextField
                  required
                  label={getI18nText("systems.labelSAPUser")}
                  variant="filled"
                  value={value}
                  onChange={(e) => {
                    e.target.value = e.target.value.toUpperCase();
                    onChange(e);
                  }}
                  error={!!error}
                  helperText={error ? error.message : null}
                  sx={{ width: "15em" }}
                />
              )}
              rules={{ required: getI18nText("general.fieldMandatory") }}
            />
          }
        />
        <FormItem
          children={
            <Controller
              name="sap_password"
              control={control}
              defaultValue=""
              render={({
                field: { onChange, value },
                fieldState: { error },
              }) => (
                <TextField
                  required
                  label={getI18nText("systems.labelSAPPassword")}
                  variant="filled"
                  value={value}
                  onChange={onChange}
                  error={!!error}
                  helperText={error ? error.message : null}
                  sx={{ width: "15em" }}
                  type="password"
                />
              )}
              rules={{ required: getI18nText("general.fieldMandatory") }}
            />
          }
        />
        <FormItem
          children={
            <Controller
              name="ngrok_active"
              control={control}
              defaultValue={false}
              render={({
                field: { onChange, value },
                fieldState: { error },
              }) => (
                <CheckBox
                  text={getI18nText("systems.labelNgrokActive")}
                  checked={value}
                  onChange={(e) => {
                    onChange(e.target.checked);
                  }}
                />
              )}
            />
          }
        />
        {watchNgrokActive && (
          <FormItem
            children={
              <Controller
                name="ngrok_api_token"
                control={control}
                defaultValue=""
                render={({
                  field: { onChange, value },
                  fieldState: { error },
                }) => (
                  <TextField
                    required
                    label={getI18nText("systems.labelNgrokApiToken")}
                    variant="filled"
                    value={value}
                    onChange={onChange}
                    error={!!error}
                    helperText={
                      !!error
                        ? error.type === "validate"
                          ? getI18nText("general.fieldMandatory")
                          : error.message
                        : null
                    }
                    sx={{ width: "15em" }}
                    type="password"
                  />
                )}
                /*rules={{
              validate: (value) => value !== "" && watchNgrokActive,
            }}*/
              />
            }
          />
        )}
        {watchNgrokActive && (
          <FormItem
            children={
              <Controller
                name="ngrok_tunnel"
                control={control}
                defaultValue=""
                render={({
                  field: { onChange, value },
                  fieldState: { error },
                }) => (
                  <TextField
                    label={getI18nText("systems.labelNgrokTunnel")}
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
                    sx={{ width: "15em" }}
                    type="text"
                  />
                )}
                rules={{
                  validate: (value) => {
                    return systemController.validateHost(value);
                  },
                }}
              />
            }
          />
        )}
      </Form>
    </Dialog>
  );
};

export default DialogAddSystem;
