import { useCallback } from "react";
import { gql, useLazyQuery } from "@apollo/client";
import { useSelector, useDispatch } from "react-redux";
import { errorHandling } from "utils/graphQL/errorHandling";
import { useTranslations } from "translations/i18nContext";
import { showToast, MESSAGE } from "utils/general/message";
import { GATEWAY_CONF, MSG_SAP_2_MSG_APP } from "utils/sap/constans";
import { useGlobalData } from "context/globalDataContext";
import useSAPGeneral from "hooks/useSAPGeneral";
import useFilterValues from "components/transportOrder/useFilterValues";
import {
  systemsTransportCopyAction,
  userOrderListFromServiceAction,
  userOrderListAction,
  loadingOrdersAction,
  toolbarFiltersAction,
} from "reduxStore/sapTransportOrderSlice";

const _ = require("lodash");

export const QUERY_USER_ORDERS = gql`
  query Query(
    $system: String!
    $sap_user: String!
    $sap_password: String!
    $user: String!
    $orderStatus: [inputStatus]
    $orderTypes: [inputTypes]
  ) {
    getUserOrderList(
      system: $system
      sap_user: $sap_user
      sap_password: $sap_password
      user: $user
      orderStatus: $orderStatus
      orderTypes: $orderTypes
    ) {
      taskStatusDesc
      taskStatus
      taskTypeDesc
      taskType
      taskUser
      task
      orderTypeDesc
      orderType
      orderStatusDesc
      orderStatus
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
  const { getI18nText, language } = useTranslations();
  const { systemURL2Connect, systemSelected, setConnectedToSystem } =
    useGlobalData();
  const { buildSAPUrl2Connect } = useSAPGeneral();
  const { getDefaultFilters, convertFilter2paramsGraphql } = useFilterValues();
  const dispatch = useDispatch();

  /*************************************
   * Servicios GraphQL
   ************************************/
  /**
   * Servicio que obtiene las ordenes del usuario
   * Nota: fetchPolicy: "cache-and-network" --> Hace que entre en el evento oncompleted
   * aunque los datos recuperados sean iguales a los que tiene en el cache
   */
  const [srvGetUserOrdersList] = useLazyQuery(QUERY_USER_ORDERS, {
    fetchPolicy: "network-only",
    notifyOnNetworkStatusChange: true,
    onCompleted: (data) => {
      dispatch(loadingOrdersAction(false));
      if (data.getUserOrderList != null) {
        dispatch(
          userOrderListAction(adaptSAPOrders2TreeTable(data.getUserOrderList))
        );
        dispatch(userOrderListFromServiceAction(data.getUserOrderList));
      }
    },
    onError: (error) => {
      dispatch(loadingOrdersAction(false));

      let responseError = errorHandling(error);
      showToast(
        getI18nText("systemSelect.errorCallServiceRead", {
          errorService: responseError.singleMessage,
        }),
        MESSAGE.TYPE.ERROR
      );
    },
  });

  /**
   * Servicio que obtiene los sistemas a donde se puede transportar
   */
  const [srvGetSystemsTransport] = useLazyQuery(QUERY_SYSTEMS_TRANSPORT, {
    fetchPolicy: "network-only",
    onCompleted: (data) => {
      if (data.getSystemsTransport != null) {
        dispatch(systemsTransportCopyAction(data.getSystemsTransport));
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
  });

  /*************************************
   * Funciones
   ************************************/
  /**
   * Proceso de lectura de datos de las ordenes del usuario
   */
  const loadInitialData = useCallback(() => {
    dispatch(loadingOrdersAction(true));

    let filterValues = getDefaultFilters();
    dispatch(toolbarFiltersAction(filterValues));

    let paramsService = convertFilter2paramsGraphql(filterValues);

    let url2Service = buildSAPUrl2Connect(
      systemSelected.host,
      GATEWAY_CONF.ODATA_TRANSP_SERVICE
    );

    // Ordenes del usuario
    srvGetUserOrdersList({
      variables: {
        system: url2Service,
        sap_user: systemSelected.sap_user,
        sap_password: systemSelected.sap_password,
        user: systemSelected.sap_user,
        ...paramsService,
      },
    });

    // Se leen a que sistemas se va a poder transportar
    srvGetSystemsTransport({
      variables: {
        system: url2Service,
        sap_user: systemSelected.sap_user,
        sap_password: systemSelected.sap_password,
        user: systemSelected.sap_user,
        langu: language,
      },
    });
  }, [systemSelected]);

  const adaptSAPOrders2TreeTable = useCallback((aSAPOrders) => {
    // Se agrupa la lista de ordenes por la orden
    let orderGroups = _.groupBy(aSAPOrders, "order");
    let id = 1;

    let newData = [];
    for (const order in orderGroups) {
      // Datos de la orden
      let idParent = id;
      let orderData = {
        id: id,
        orderTask: order,
        description: orderGroups[order][0].orderDesc,
        status: orderGroups[order][0].orderStatus,
        statusDesc: orderGroups[order][0].orderStatusDesc,
        type: orderGroups[order][0].orderType,
        typeDesc: orderGroups[order][0].orderTypeDesc,
        user: orderGroups[order][0].orderUser,
        subRows: [],
      };

      id += 1;

      // Datos de la tarea
      orderGroups[order].forEach((task) => {
        // Solo se añade las tareas que tienen numero informadas. Si esta en blanco
        // son ordenes sin tareas.
        if (task.task != "") {
          let taskData = {
            id: id,
            orderTask: task.task,
            description: task.orderDesc,
            status: task.taskStatus,
            statusDesc: task.taskStatusDesc,
            type: task.taskType,
            typeDesc: task.taskTypeDesc,
            user: task.taskUser,
            //            parentId: idParent,
          };
          orderData.subRows.push(taskData);
          id += 1;
        }
      });

      newData.push(orderData);
    }

    return newData;
  }, []);

  return { loadInitialData };
}
