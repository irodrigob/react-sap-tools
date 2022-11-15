import { useState, useEffect } from "react";
import {
  Dialog,
  Button,
  Bar,
  Form,
  FormItem,
  CheckBox,
} from "@ui5/webcomponents-react";
import "@ui5/webcomponents/dist/features/InputElementsFormSupport.js";
import { useMutation } from "@apollo/client";
import TextField from "@mui/material/TextField";
import { useTranslations } from "translations/i18nContext";
import { useForm, Controller } from "react-hook-form";
import useSystems, { MUTATION_NEW_SYSTEM } from "hooks/useSystems";
import { encryptText } from "utils/general/security";
import { showToast, MESSAGE } from "utils/general/message";
import { errorHandling } from "utils/graphQL/errorHandling";

const FooterDialog = (props) => {
  const { onCloseButton, onSaveButton, btnSaveDisabled } = props;
  const { getI18nText } = useTranslations();

  return (
    <Bar
      slot={props.slot}
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
export default function DialogAddSystem(props) {
  const { open, onCloseButton } = props;
  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm();
  const { getI18nText } = useTranslations();
  const { formatterHost, validateHost, addSystem, session } = useSystems();
  const [btnSaveDisabled, setBtnSaveDisabled] = useState(false);
  const watchNgrokActive = watch("ngrok_active");

  /*************************************
   * Funciones
   ************************************/
  const onSubmitForm = (data) => {
    //setBtnSaveDisabled(true);
    // Formateo del host
    data.host = formatterHost(data.host);
    data.sap_password = encryptText(data.sap_password);
    data.ngrok_api_token =
      data.ngrok_api_token != "" ? encryptText(data.ngrok_api_token) : "";
    showToast(
      getI18nText("editSystem.saveInProcess", {
        newSystem: data.name,
      }),
      MESSAGE.TYPE.INFO
    );
    newSystemFunction({
      variables: {
        input: {
          user: session.email,
          name: data.name,
          host: data.host,
          sap_password: data.sap_password,
          sap_user: data.sap_user,
          ngrok_active: data.ngrok_active,
          ngrok_api_token: data.ngrok_api_token,
          ngrok_tunnel: data.ngrok_tunnel,
        },
      },
    });
  };

  /*************************************
   * Servicios GraphQL
   ************************************/

  // Como la llamada a la mutation es un HOOK se tiene que llamar en el propio componente y no en el hook
  // que tengo para la gestión de sistemas.
  // Además, uso los eventos propios de gestión de errores y datos completados porque como la función que devuelve el hook se llama
  // Dentro de una rutina del useForm no se termina de gestionar bien cuando termina, cuando hay errores, etc..
  // Ejemplo: La variable "error" que se desestructura dentro del onSubmit no refleja los errores pero si que lo fuera de la función.
  // Pero si pongo el error fuera entonces el snackbar me da warning al renderizarse y además me duplica mensajes. Total, que he optado
  // por el uso de los eventos propios y de esta manera no tengo problemas.
  const [
    newSystemFunction,
    { loading: loadingAddSystem, reset: resetAddSystem },
  ] = useMutation(MUTATION_NEW_SYSTEM, {
    onError: (error) => {
      // Reseteo los estados de la mutation debido al error
      resetAddSystem();

      // Llamo a la función que me gestiona los errores de graphQL y me devuelve una estructura común independientemente del tipo de error
      let responseError = errorHandling(error);

      // Si es un error de red se produce una excepción de red (ejemplo que se pase un campo que no existe)
      // Como se puede producir varios mensajes lo que hago es sacar el primero.
      showToast(
        getI18nText("editSystem.errorCallServiceNew", {
          errorService: responseError.singleMessage,
        }),
        MESSAGE.TYPE.ERROR
      );

      // Se vuelve activar el botón de grabar
      setBtnSaveDisabled(false);
    },
    onCompleted: (data) => {
      addSystem(data.newSystem); // Se añade el sistema

      // Mensaje de sistema añadido
      showToast(
        getI18nText("editSystem.saveSuccess", {
          newSystem: data.newSystem.name,
        }),
        MESSAGE.TYPE.SUCCCES
      );
      // Se vuelve activar el botón de grabar
      setBtnSaveDisabled(false);

      // Reseteo los valores del form
      reset();

      // Cierre de la ventana
      onCloseButton();
    },
  });

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
      <Form
        style={{
          alignItems: "center",
        }}
      >
        <FormItem>
          <Controller
            name="name"
            control={control}
            defaultValue=""
            render={({ field: { onChange, value }, fieldState: { error } }) => (
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
        </FormItem>
        <FormItem>
          <Controller
            name="host"
            control={control}
            defaultValue=""
            render={({ field: { onChange, value }, fieldState: { error } }) => (
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
                return validateHost(value);
              },
            }}
          />
        </FormItem>
        <FormItem>
          <Controller
            name="sap_user"
            control={control}
            defaultValue=""
            render={({ field: { onChange, value }, fieldState: { error } }) => (
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
        </FormItem>
        <FormItem>
          <Controller
            name="sap_password"
            control={control}
            defaultValue=""
            render={({ field: { onChange, value }, fieldState: { error } }) => (
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
        </FormItem>
        <FormItem>
          <Controller
            name="ngrok_active"
            control={control}
            defaultValue={false}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <CheckBox
                text={getI18nText("systems.labelNgrokActive")}
                checked={value}
                onChange={(e) => {
                  onChange(e.target.checked);
                }}
              />
            )}
          />
        </FormItem>
        {watchNgrokActive && (
          <FormItem>
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
                  type="text"
                />
              )}
              rules={{ validate: (value) => value !== "" && watchNgrokActive }}
            />
          </FormItem>
        )}
        {watchNgrokActive && (
          <FormItem>
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
                        ? getI18nText("general.fieldMandatory")
                        : error.message
                      : null
                  }
                  sx={{ width: "15em" }}
                  type="text"
                />
              )}
            />
          </FormItem>
        )}
      </Form>
    </Dialog>
  );
}
