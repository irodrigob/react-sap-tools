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
import { useSession } from "auth/authProvider";
import { useForm, Controller } from "react-hook-form";
import { useTranslations } from "translations/i18nContext";
import { responseNewSystemRepo } from "systems/infraestructure/types/repository";
import FooterDialog from "shared/frontend/components/footerDialog";
import SystemController from "systems/infraestructure/controller/SystemController";
import SystemFormatters from "systems/utils/formatters";
import Encrypt from "shared/utils/encrypt/Encrypt";
import { showToast, MESSAGE } from "utils/general/message";
import type { newSystemDTO } from "systems/infraestructure/dto/systemDTO";
import ErrorGraphql from "shared/errors/ErrorGraphql";
import System from "systems/domain/entities/system";
import useSystems from "systems/infraestructure/frontend/hooks/useSystems";

type FormValues = {
  name: string;
  host: string;
  sap_user: string;
  sap_password: string;
  ngrok_active: boolean;
  ngrok_api_token: string;
  ngrok_tunnel: string;
};

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
  } = useForm<FormValues>();
  const { session } = useSession();
  const { addSystem } = useSystems();
  const [btnSaveDisabled, setBtnSaveDisabled] = useState(false);
  const systemController = new SystemController();
  const watchNgrokActive = watch("ngrok_active");

  /*************************************
   * Funciones
   ************************************/
  const onSubmitForm = (data: FormValues) => {
    setBtnSaveDisabled(true);
    showToast(
      getI18nText("editSystem.saveInProcess", {
        newSystem: data.name,
      }),
      MESSAGE.TYPE.INFO
    );

    let newSystem: newSystemDTO = {
      user: session.email,
      name: data.name,
      host: SystemFormatters.formatterHost(data.host),
      sap_user: data.sap_user,
      sap_password:
        data.sap_password != "" ? Encrypt.encryptText(data.sap_password) : "",
      ngrok_active: data.ngrok_active,
      ngrok_api_token:
        data.ngrok_active && data.ngrok_api_token != ""
          ? Encrypt.encryptText(data.ngrok_api_token)
          : "",
      ngrok_tunnel: data.ngrok_active
        ? SystemFormatters.formatterHost(data.ngrok_tunnel)
        : "",
    };

    systemController
      .createNewSystem(newSystem)
      .then((response: responseNewSystemRepo) => {
        setBtnSaveDisabled(false);
        if (response.isSuccess) {
          addSystem(response.getValue() as System);
          // Mensaje de sistema añadido
          showToast(
            getI18nText("editSystem.saveSuccess", {
              newSystem: (response.getValue() as System).name,
            }),
            MESSAGE.TYPE.SUCCCES
          );
          // Se vuelve activar el botón de grabar
          setBtnSaveDisabled(false);

          // Reseteo los valores del form
          reset();

          // Cierre de la ventana
          onCloseButton();
        } else if (response.isFailure) {
          showToast(
            getI18nText("editSystem.errorCallServiceNew", {
              errorService: (
                response.getErrorValue() as ErrorGraphql
              ).getError().singleMessage,
            }),
            MESSAGE.TYPE.ERROR
          );
        }
      });
  };

  return (
    <Dialog
      open={open}
      headerText={getI18nText("editSystem.titleAddSystem")}
      footer={
        <FooterDialog
          textStartButton={getI18nText("general.btnTxtSave")}
          textEndButton={getI18nText("general.btnTxtCancel")}
          onEndButton={() => {
            reset();
            onCloseButton();
          }}
          onStartButton={handleSubmit(onSubmitForm)}
          disabledStartButton={btnSaveDisabled}
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
                    label={getI18nText("systems.labelConnectionTunnel")}
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
