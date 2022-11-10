import { useEffect, useState } from "react";
import { useMutation } from "@apollo/client";
import { Dialog, Button, Bar } from "@ui5/webcomponents-react";
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
  const { formatterHost, updateSystem, deleteSystem } = useSystems();

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
        width: 270,
      },
      {
        Header: getI18nText("systems.labelHOST"),
        accessor: "host",
        headerTooltip: getI18nText("systems.labelHOST"),
        edit: true,
        required: true,
        width: 500,
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
        width: 300,
        type: "Password",
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

            return updateSystemFunction({
              variables: {
                id: newData._id,
                input: {
                  user: newData.user,
                  name: newData.name,
                  host: newData.host,
                  sap_password: newData.sap_password,
                  sap_user: newData.sap_user,
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
        }}
      />
    </Dialog>
  );
}
