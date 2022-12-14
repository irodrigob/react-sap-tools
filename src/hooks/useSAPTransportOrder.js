import { useCallback } from "react";
import { gql, useLazyQuery } from "@apollo/client";
import { useSelector, useDispatch } from "react-redux";
import { errorHandling } from "utils/graphQL/errorHandling";
import { useTranslations } from "translations/i18nContext";
import { showToast, MESSAGE } from "utils/general/message";
import { GATEWAY_CONF, MSG_SAP_2_MSG_APP } from "utils/sap/constans";
import { useGlobalData } from "context/globalDataContext";
import { useSAPTransportOrderData } from "context/sapTransportOrder";
import { FIELDS_TREE_TABLE } from "utils/sap/transportOrder";
import useSAPGeneral from "hooks/useSAPGeneral";
import useMessageManager, {
  MESSAGE_TYPE,
} from "components/messageManager/useMessageManager";
import useFilterValues from "components/transportOrder/useFilterValues";
import {
  systemsTransportCopyAction,
  userOrderListFromServiceAction,
  userOrderListTreeAction,
  loadingOrdersAction,
  toolbarFiltersAction,
  systemChangedAction,
  systemTransportCopyAction,
  orderTaskSelectedAction,
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
    $releaseDateFrom: String
  ) {
    getUserOrderList(
      system: $system
      sap_user: $sap_user
      sap_password: $sap_password
      user: $user
      orderStatus: $orderStatus
      orderTypes: $orderTypes
      releaseDateFrom: $releaseDateFrom
    ) {
      taskStatusDesc
      taskStatus
      taskTypeDesc
      taskType
      taskUser
      task
      taskDesc
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
  const { systemSelected } = useGlobalData();
  const { URLOData, setURLOData } = useSAPTransportOrderData();
  const { addMessagesManager, clearMessagesManager } = useMessageManager();
  const { buildSAPUrl2Connect } = useSAPGeneral();
  const { getDefaultFilters, convertFilter2paramsGraphql } = useFilterValues();
  const dispatch = useDispatch();
  const {
    toolbarFilters,
    orderTaskSelected,
    systemsTransportCopy,
    userOrderListTree,
  } = useSelector((state) => state.SAPTransportOrder);

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
          userOrderListTreeAction(
            adaptSAPOrders2TreeTable(data.getUserOrderList)
          )
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
      // data.getSystemsTransport[0].systemName
      if (data.getSystemsTransport != null) {
        if (data.getSystemsTransport.length > 0) {
          // A??ado un registro al principio en blanco y por defecto lo selecciono para que se tenga que selecionar un sistema.
          // Lo tengo que hacer porque el componente Select de UI5 no lo hace y parece que tengas un sistema preseleccionado cuando no es as??.
          let values = [...data.getSystemsTransport];
          values.unshift({ systemName: "", systemDesc: "" });

          dispatch(systemTransportCopyAction(""));

          dispatch(systemsTransportCopyAction(values));
        }
      }
    },
    onError: (error) => {
      // Llamo a la funci??n que me gestiona los errores de graphQL y me devuelve una estructura com??n independientemente del tipo de error
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
   * Servicio que realiza el transporte de copias
   */
  const [srvDoTransportCopy] = useLazyQuery(QUERY_DO_TRANSPORT, {
    fetchPolicy: "cache-and-network",
    onCompleted: (data) => {
      if (data.doTransportCopy != null) {
        if (Array.isArray(data.doTransportCopy.return)) {
          // Si el par??metro de salida RETURN solo tiene un solo registro lo saco directamente.
          if (data.doTransportCopy.return.length == 1) {
            showToast(
              data.doTransportCopy.return[0].message,
              MSG_SAP_2_MSG_APP[
                data.doTransportCopy.return[0].type.toUpperCase()
              ]
            );
          }
          // Guardo los mensajes en el gestor de mensajes.
          addMessagesManager(data.doTransportCopy.return);

          // Guardo aqu?? el sistema seleccionado porque si lo hago en el momento de hacer el transporte
          // fastidia los procesos de actualizaci??n de estados y no funciona el proceso.
          dispatch(
            systemTransportCopyAction(data.doTransportCopy.systemTransport)
          );

          // Si en el primer registro de los sistema a transporte esta el systema "blanco" que se se a??ade al principio
          // del proceso lo borro porque como ya se ha seleccionado un sistema no tiene sentido que siga estando en la tabla.
          if (
            systemsTransportCopy[0].systemName == "" &&
            systemsTransportCopy[0].systemDesc == ""
          ) {
            let values = [...systemsTransportCopy];
            values.shift();

            dispatch(systemsTransportCopyAction(values));
          }
        }
      }
    },
    onError: (error) => {
      clearMessagesManager();

      let responseError = errorHandling(error);

      // Llamo a la funci??n que me gestiona los errores de graphQL y me devuelve una estructura com??n independientemente del tipo de error
      let message = getI18nText("systemSelect.errorCallServiceRead", {
        errorService: responseError.singleMessage,
      });

      addMessagesManager([{ message: message, type: MESSAGE_TYPE.ERROR }]);
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
    dispatch(systemChangedAction(false));

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

    setURLOData(url2Service);
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
        [FIELDS_TREE_TABLE.EXPANDED]: false,
        subRows: [],
      };

      id += 1;

      // Datos de la tarea
      orderGroups[order].forEach((task) => {
        // Solo se a??ade las tareas que tienen numero informadas. Si esta en blanco
        // son ordenes sin tareas.
        if (task.task != "") {
          let taskData = {
            id: id,
            orderTask: task.task,
            description: task.taskDesc,
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

  /**
   * Funci??n que realiza la lectura de nuevo de las ordendes del usuario
   * la diferencia. Esta funci??n solo realiza la llamada al m??todo de GraphQL y no tiene
   * que hacer nada m??s ya que los loader o lo que sea ya se gestiona desde fuera de esta llamada.
   */
  const reloadUserOrders = useCallback(() => {
    dispatch(orderTaskSelectedAction([]));
    dispatch(loadingOrdersAction(true));

    let paramsService = convertFilter2paramsGraphql(toolbarFilters);
    srvGetUserOrdersList({
      variables: {
        system: URLOData,
        sap_user: systemSelected.sap_user,
        sap_password: systemSelected.sap_password,
        user: systemSelected.sap_user,
        ...paramsService,
      },
    });
  }, [systemSelected, URLOData, toolbarFilters]);

  /**
   * Funci??n que limpia el listado de ordenes del usuario.
   * Se usar?? entre otros sitios cuando se borre un sistema para limpiar
   * las ordenes
   */
  const clearVariables = useCallback(() => {
    // Ordenes del usuario
    dispatch(userOrderListTreeAction([]));
    dispatch(userOrderListFromServiceAction([]));
    // Sistema seleccionado
    dispatch(systemTransportCopyAction(""));
    dispatch(orderTaskSelectedAction([]));
  }, []);

  /**
   * Funci??n que realiza el transporte de copias de las ordenes seleccionadas
   * @param pSystem | Sistema a transportar
   * @param pSystem | Descripci??n del transporte de copia
   */
  const doTransportCopy = useCallback(
    (pSystem, pOrderDescription) => {
      clearMessagesManager();

      srvDoTransportCopy({
        variables: {
          input: {
            system: URLOData,
            sap_user: systemSelected.sap_user,
            sap_password: systemSelected.sap_password,
            user: systemSelected.sap_user,
            langu: language,
            orders: orderTaskSelected.map((row) => {
              return { order: row.orderTask };
            }),
            systemTransport: pSystem,
            description: pOrderDescription,
          },
        },
      });
    },
    [orderTaskSelected, systemSelected, URLOData]
  );

  /**
   * B??squeda del texto pasado por par??metro en la tabla de ordenes en formato arbol
   * @param {string} searchText | Texto a buscar
   * @returns | Tabla con las ordenes filtradas
   */
  const searchOrdersTableTree = useCallback((ordersListTree, searchText) => {
    if (searchText == "") {
      return ordersListTree.map((row) => {
        return { ...row, FIELDS_TREE_TABLE: false };
      });
    } else {
      let newSearchText = searchText.toUpperCase().trim();

      let resultSearch = [];
      ordersListTree.forEach((row) => {
        // Filtramos por las tareas
        let filterSubRows = row.subRows.filter((subRow) => {
          return searchTextRowOrderTree(subRow, newSearchText);
        });
        let filterRow = searchTextRowOrderTree(row, newSearchText);

        // Si hay tareas devuelvo la orden y con las tareas subfiltradas. Si no hay tareas
        // pero si que conicide la orden entonces devuelvo la fila entera
        if (filterSubRows.length > 0) {
          let newRow = {
            ...row,
            subRows: filterSubRows,
            [FIELDS_TREE_TABLE.EXPANDED]: true,
          };
          resultSearch.push(newRow);
        } else if (filterRow) {
          resultSearch.push({ ...row, [FIELDS_TREE_TABLE.EXPANDED]: true });
        }
      });

      return resultSearch;
    }
  }, []);

  /**
   * B??squeda de un texto en la fila de ordenes/tareas
   * @param {object} row
   * @param {string} searchText
   * @returns | Fila si se cumplen los datos
   */
  const searchTextRowOrderTree = useCallback((row, searchText) => {
    if (
      row.orderTask.includes(searchText) ||
      row.description.toUpperCase().includes(searchText) ||
      row.statusDesc.toUpperCase().includes(searchText) ||
      row.typeDesc.toUpperCase().includes(searchText) ||
      row.user.toUpperCase().includes(searchText)
    )
      return row;
    else return null;
  }, []);

  return {
    loadInitialData,
    reloadUserOrders,
    clearVariables,
    doTransportCopy,
    searchOrdersTableTree,
  };
}
