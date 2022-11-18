import { useEffect, useState } from "react";
import { useMutation } from "@apollo/client";
import { Dialog, Button, Bar, ValueState } from "@ui5/webcomponents-react";
import CustomAnalyticTable from "components/customAnalyticTable/CustomAnalyticTable";
import { useTranslations } from "translations/i18nContext";
import { useGlobalData } from "context/globalDataContext";
import useSystems, {
  MUTATION_UPDATE_SYSTEM,
  MUTATION_DELETE_SYSTEM,
} from "hooks/useSystems";
import { showToast, MESSAGE, closeToast } from "utils/general/message";
import { encryptText } from "utils/general/security";
import { errorHandling } from "utils/graphQL/errorHandling";

const FooterDialog = (props) => {
  const { onCloseButton } = props;
  const { getI18nText } = useTranslations();

  return (
    <Bar
      slot={props.slot}
      design="Footer"
      endContent={
        <Button style={{ marginTop: "1rem" }} onClick={onCloseButton}>
          {getI18nText("systems.btnClose")}
        </Button>
      }
      style={{
        marginTop: "1rem",
        marginBottom: "1rem",
      }}
    />
  );
};

export default function DialogSystemList(props) {
  const { open, onCloseButton } = props;
  const { getI18nText } = useTranslations();
  const { systemsList } = useGlobalData();
  const [columns, setColumns] = useState([]);
  const [toastID, setToastID] = useState("");
  const { formatterHost, updateSystem, deleteSystem, validateHost } =
    useSystems();

  /*************************************
   * Efectos
   ************************************/
  useEffect(() => {
    setColumns([
      {
        Header: getI18nText("systems.labelName"),
        accessor: "name",
        headerTooltip: getI18nText("systems.labelName"),
        edit: true,
        required: true,
        width: 200,
      },
      {
        Header: getI18nText("systems.labelHOST"),
        accessor: "host",
        headerTooltip: getI18nText("systems.labelHOST"),
        edit: true,
        required: true,
        width: 400,
      },
      {
        Header: getI18nText("systems.labelSAPUser"),
        accessor: "sap_user",
        headerTooltip: getI18nText("systems.labelSAPUser"),
        edit: true,
        required: true,
        width: 150,
      },
      {
        Header: getI18nText("systems.labelSAPPassword"),
        accessor: "sap_password",
        headerTooltip: getI18nText("systems.labelSAPPassword"),
        edit: true,
        required: true,
        width: 150,
        type: "Password",
      },
      {
        Header: getI18nText("systems.labelNgrokActive"),
        accessor: "ngrok_active",
        headerTooltip: getI18nText("systems.labelNgrokActive"),
        edit: true,
        required: false,
        width: 100,
        componentType: "checkbox",
      },
      {
        Header: getI18nText("systems.labelNgrokApiToken"),
        accessor: "ngrok_api_token",
        headerTooltip: getI18nText("systems.labelNgrokApiToken"),
        edit: true,
        required: false,
        width: 200,
        type: "Password",
      },
      {
        Header: getI18nText("systems.labelNgrokTunnel"),
        accessor: "ngrok_tunnel",
        headerTooltip: getI18nText("systems.labelNgrokTunnel"),
        edit: true,
        required: false,
        width: 300,
      },
    ]);
  }, []);

  /*************************************
   * Funciones
   ************************************/

  /*************************************
   * GraphQL
   ************************************/
  /**
   * Mutation para la actualización del sistema
   */
  const [
    updateSystemFunction,
    { loading: loadingUpdateSystem, reset: resetEditSystem },
  ] = useMutation(MUTATION_UPDATE_SYSTEM, {
    onError: (error) => {
      closeToast(toastID);
      // Reseteo los estados de la mutation debido al error
      resetEditSystem();

      // Llamo a la función que me gestiona los errores de graphQL y me devuelve una estructura común independientemente del tipo de error
      let responseError = errorHandling(error);

      // Si es un error de red se produce una excepción de red (ejemplo que se pase un campo que no existe)
      // Como se puede producir varios mensajes lo que hago es sacar el primer.
      showToast(
        getI18nText("editSystem.errorCallServiceNew", {
          errorService: responseError.singleMessage,
        }),
        MESSAGE.TYPE.ERROR
      );
    },
    onCompleted: (data) => {
      closeToast(toastID);
      // Actualizo el sistema
      updateSystem(data.updateSystem);
      // Mensaje de sistema grabado
      showToast(
        getI18nText("editSystem.saveSuccess", {
          newSystem: data.updateSystem.name,
        }),
        MESSAGE.TYPE.SUCCCES
      );
    },
  });

  /**
   * Mutation para el borrado del sistema
   */
  const [
    deleteSystemFunction,
    { loading: loadingDeleteSystem, reset: resetDeletetSystem },
  ] = useMutation(MUTATION_DELETE_SYSTEM, {
    onError: (error) => {
      closeToast(toastID);
      // Reseteo los estados de la mutation debido al error
      resetEditSystem();

      // Llamo a la función que me gestiona los errores de graphQL y me devuelve una estructura común independientemente del tipo de error
      let responseError = errorHandling(error);

      // Si es un error de red se produce una excepción de red (ejemplo que se pase un campo que no existe)
      // Como se puede producir varios mensajes lo que hago es sacar el primer.
      showToast(
        getI18nText("editSystem.errorCallServiceNew", {
          errorService: responseError.singleMessage,
        }),
        MESSAGE.TYPE.ERROR
      );
    },
    onCompleted: (data) => {
      closeToast(toastID);

      // Actualizo el sistema
      deleteSystem(data.deleteSystem._id);

      showToast(
        getI18nText("editSystem.deleteSuccess", {
          system: data.deleteSystem.name,
        }),
        MESSAGE.TYPE.SUCCCES
      );
    },
  });

  /*return new Promise((resolve, reject) => {
              resolve("prueba de mensaje");
            });*/

  /*


  */
  return (
    <Dialog
      open={open}
      headerText={getI18nText("systemList.title")}
      draggable={true}
      resizable={true}
      footer={
        <FooterDialog
          onCloseButton={() => {
            onCloseButton();
          }}
        />
      }
    >
      <CustomAnalyticTable
        columns={columns}
        data={systemsList}
        editable={{
          onRowUpdate: (newData, oldData) => {
            let toastID = showToast(
              getI18nText("editSystem.saveInProcess", {
                newSystem: newData.name,
              }),
              MESSAGE.TYPE.INFO
            );
            setToastID(toastID);

            newData.host = formatterHost(newData.host);

            // Si el password nuevo y el original son distintos es que lo ha cambio y hay que cifrarlo.
            // En caso contrario se deja el mismo porque ya esta cifrado.
            if (newData.sap_password != oldData.sap_password)
              newData.sap_password = encryptText(newData.sap_password);

            if (newData.ngrok_active) {
              newData.ngrok_tunnel = formatterHost(newData.ngrok_tunnel);
              if (newData.ngrok_api_token != oldData.ngrok_api_token)
                newData.ngrok_api_token = encryptText(newData.ngrok_api_token);
            } else {
              newData.ngrok_api_token = "";
              newData.ngrok_tunnel = "";
            }

            return updateSystemFunction({
              variables: {
                id: newData._id,
                input: {
                  user: newData.user,
                  name: newData.name,
                  host: newData.host,
                  sap_password: newData.sap_password,
                  sap_user: newData.sap_user,
                  ngrok_active: newData.ngrok_active,
                  ngrok_api_token: newData.ngrok_api_token,
                  ngrok_tunnel: newData.ngrok_tunnel,
                },
              },
            });
          },
          onRowDelete: (oldData) => {
            let toastID = showToast(
              getI18nText("editSystem.deleteInProcess", {
                newSystem: oldData.name,
              }),
              MESSAGE.TYPE.INFO
            );
            setToastID(toastID);

            return deleteSystemFunction({
              variables: {
                id: oldData._id,
              },
            });
          },
          onRowValidation: (newData, column, value) => {
            switch (column) {
              case "host":
                if (!validateHost(value))
                  return [
                    {
                      state: ValueState.Error,
                      message: getI18nText("editSystem.msgErrorHostInvalid"),
                    },
                  ];
              case "ngrok_tunnel":
                if (newData.ngrok_active) {
                  if (!validateHost(value))
                    return [
                      {
                        state: ValueState.Error,
                        message: getI18nText("editSystem.msgErrorHostInvalid"),
                      },
                    ];
                } else {
                  return [{ column: "ngrok_tunnel", value: "" }];
                }
              case "ngrok_api_token":
                value = newData.ngrok_active ? value : "";
            }
            return [{ state: ValueState.None, message: "" }];
          },
        }}
      />
    </Dialog>
  );
}
