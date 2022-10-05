import { gql, useLazyQuery } from "@apollo/client";
import { errorHandling } from "utils/graphQL/errorHandling";
import { useTranslations } from "translations/i18nContext";
import { showToast, MESSAGE } from "utils/general/message";

export const QUERY_USER_ORDERS = gql`
  query Query(
    $system: String!
    $sap_user: String!
    $sap_password: String!
    $user: String!
  ) {
    getUserOrderList(
      system: $system
      sap_user: $sap_user
      sap_password: $sap_password
      user: $user
    ) {
      taskStatusDesc
      taskStatus
      taskTypeDesc
      taskType
      taskUser
      task
      orderTypeDesc
      orderType
      orderUser
      orderDesc
      order
    }
  }
`;

export const QUERY_SYSTEMS_TRANSPORT = gql`
  query Query(
    $system: String!
    $sap_user: String!
    $sap_password: String!
    $user: String!
    $langu: String!
  ) {
    getSystemsTransport(
      system: $system
      sap_user: $sap_user
      sap_password: $sap_password
      user: $user
      langu: $langu
    ) {
      systemName
      systemDesc
    }
  }
`;

export const QUERY_DO_TRANSPORT = gql`
  query Query($input: inputTransportCopy) {
    doTransportCopy(input: $input) {
      order
      systemTransport
      return {
        type
        message
      }
    }
  }
`;

export default function useSAPTransportOrder() {
  /*************************************
   * Servicios GraphQL
   ************************************/
  /**
   * Servicio que obtiene las ordenes del usuario
   * Nota: fetchPolicy: "cache-and-network" --> Hace que entre en el evento oncompleted
   * aunque los datos recuperados sean iguales a los que tiene en el cache
   */
  const [srvGetUserOrdersList, { loading: loadingOrders }] = useLazyQuery(
    QUERY_USER_ORDERS,
    {
      fetchPolicy: "network-only",
      notifyOnNetworkStatusChange: true,
      onCompleted: (data) => {
        if (data.getUserOrderList != null) {
          //   dispatch(actionUserOrderList(data.getUserOrderList));
        }
      },
      onError: (error) => {
        // Llamo a la función que me gestiona los errores de graphQL y me devuelve una estructura común independientemente del tipo de error
        let responseError = errorHandling(error);
        showToast(
          getI18nText("systemSelect.errorCallServiceRead", {
            errorService: responseError.singleMessage,
          }),
          MESSAGE.TYPE.ERROR
        );
      },
    }
  );

  /**
   * Servicio que obtiene los sistemas a donde se puede transportar
   */
  const [srvGetSystemsTransport] = useLazyQuery(QUERY_SYSTEMS_TRANSPORT, {
    fetchPolicy: "network-only",
    onCompleted: (data) => {
      if (data.getSystemsTransport != null) {
        setSstemsTransport(data.getSystemsTransport);
      }
    },
    onError: (error) => {
      hiddeLoader();
      // Llamo a la función que me gestiona los errores de graphQL y me devuelve una estructura común independientemente del tipo de error
      let responseError = errorHandling(error);
      showToast(
        enqueueSnackbar,
        buildMessage(getI18nText(tkeys.general.services.errorCallGeneric), [
          responseError.singleMessage,
        ]),
        MESSAGE.TYPE.ERROR,
        {
          position: {
            vertical: "bottom",
            horizontal: "center",
          },
        }
      );
    },
  });
}
