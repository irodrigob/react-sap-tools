import { useCallback } from "react";
import { gql, useLazyQuery } from "@apollo/client";
import { errorHandling } from "utils/graphQL/errorHandling";
import { GATEWAY_CONF } from "utils/sap/constans";
import { useSAPGlobalData } from "context/sapDataContext";
import { useGlobalData } from "context/globalDataContext";
import { useTranslations } from "translations/i18nContext";
import { showToast, MESSAGE } from "utils/general/message";

export const QUERY_METADATA = gql`
  query Query($system: String!, $sap_user: String!, $sap_password: String!) {
    getMetadata(
      system: $system
      sap_user: $sap_user
      sap_password: $sap_password
    ) {
      content
    }
  }
`;

export const QUERY_GET_USER_INFO = gql`
  query Query($system: String!, $sap_user: String!, $sap_password: String!) {
    getUserInfo(
      system: $system
      sap_user: $sap_user
      sap_password: $sap_password
    ) {
      username
      username_desc
    }
  }
`;

export const QUERY_GET_APPS_LIST = gql`
  query Query(
    $system: String!
    $sap_user: String!
    $sap_password: String!
    $langu: String!
  ) {
    getAppsList(
      langu: $langu
      system: $system
      sap_user: $sap_user
      sap_password: $sap_password
    ) {
      app
      appDesc
      service
      frontendPage
      icon
      urlHelp
    }
  }
`;

export default function useSAPGeneral() {
  const { getI18nText, tkeys, language } = useTranslations();
  const { setConnectedToSystem, setLoadingListApps, systemSelected } =
    useGlobalData();
  const { userInfo, setUserInfo, setAppsList, appsList, URLODataCore } =
    useSAPGlobalData();

  /*************************************
   * Funciones
   ************************************/

  /**
   * Construye la URL completa para conectarse a SAP
   * @param {object} pSystem | Objeto con el sistema
   * @returns
   */
  const buildSAPUrl2Connect = useCallback(
    (pSystem, pService = GATEWAY_CONF.ODATA_SERVICE) => {
      return `${pSystem}${GATEWAY_CONF.ODATA_PATH}${pService}`;
    },
    []
  );

  /**
   * Función que lanza los servicios de lectura iniciales. Que inicialmente son:
   * - Datos del usuario de conexión
   * - Aplicación configuradas. Esto es lo que saldrá en la barra de la izquierda
   */
  const loadInitialInfo = useCallback(() => {
    // Primero llamamos al servicio que obtiene la información del usuario de conexión.
    getUserInfo({
      variables: {
        system: URLODataCore,
        sap_user: systemSelected.sap_user,
        sap_password: systemSelected.sap_password,
      },
    });

    getAppsList({
      variables: {
        system: URLODataCore,
        sap_user: systemSelected.sap_user,
        sap_password: systemSelected.sap_password,
        langu: language,
      },
    });
  }, [systemSelected, URLODataCore]);

  /*************************************
   * Servicios graphQL
   ************************************/
  /**
   * Servicio que llama al $metadata de los servicio del Core. Este paso es necesario es básica en Gateway para que
   * se refresquen los cambios que haya podido haber en el servidor.
   * En este metada hay postprocesos ya que si algo falla es que no hay conexión con SAP o el servicio no existe.
   */
  const [getMetadataCore] = useLazyQuery(QUERY_METADATA, {
    ssr: false,
    fetchPolicy: "network-only",
    onError: (error) => {
      setLoadingListApps(false);

      // Llamo a la función que me gestiona los errores de graphQL y me devuelve una estructura común independientemente del tipo de error
      let responseError = errorHandling(error);
      showToast(
        getI18nText("systemSelect.errorCallServiceRead", {
          errorService: responseError.singleMessage,
        }),
        MESSAGE.TYPE.ERROR
      );
    },
    onCompleted: (data) => {
      // Hay veces que falla la llamada y entra por el onError y por el onCompleted, porque son errore que al no ser
      // de red entra por este evento. La única manera de solventarlo es mirar si el dato que devuelve es un nulo. Si lo es, no ejecute los pasos siguientes
      if (data.getMetadata != null) {
        // Indico que nos hemos conectado al sistema
        setConnectedToSystem(true);

        // Lectura de los procesos iniciales
        loadInitialInfo();
      }
    },
  });

  /**
   * Servicio que llama al servicio para obtener la información del usuario
   */
  const [getUserInfo] = useLazyQuery(QUERY_GET_USER_INFO, {
    fetchPolicy: "network-only",
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
    onCompleted: (data) => {
      // Hay veces que falla la llamada y entra por el onError y por el onCompleted, porque son errore que al no ser
      // de red entra por este evento. La única manera de solventarlo es mirar si el dato que devuelve es un nulo. Si lo es, no ejecute los pasos siguientes
      if (data.getUserInfo != null) {
        setUserInfo(data.getUserInfo);
      }
    },
  });
  /**
   * Servicio que llama al servicio para obtener la información del usuario
   */
  const [getAppsList] = useLazyQuery(QUERY_GET_APPS_LIST, {
    fetchPolicy: "network-only",
    onError: (error) => {
      setLoadingListApps(false);
      // Llamo a la función que me gestiona los errores de graphQL y me devuelve una estructura común independientemente del tipo de error
      let responseError = errorHandling(error);
      showToast(
        getI18nText("systemSelect.errorCallServiceRead", {
          errorService: responseError.singleMessage,
        }),
        MESSAGE.TYPE.ERROR
      );
    },
    onCompleted: (data) => {
      setLoadingListApps(false);
      // Hay veces que falla la llamada y entra por el onError y por el onCompleted, porque son errore que al no ser
      // de red entra por este evento. La única manera de solventarlo es mirar si el dato que devuelve es un nulo. Si lo es, no ejecute los pasos siguientes
      if (data.getAppsList != null) {
        // Si no es nullo es que no hay errores y guardo el resultado. Porque siempre devolverá un array, aunque este en blanco..
        setAppsList(data.getAppsList);

        // Llamo a los metadata de las aplicaciones
        data.getAppsList.forEach((row) => {
          let URLSystem2Connect = buildSAPUrl2Connect(
            systemSelected.host,
            row.service
          );

          getMetadataApps({
            variables: {
              system: URLSystem2Connect,
              sap_user: systemSelected.sap_user,
              sap_password: systemSelected.sap_password,
            },
          });
        });

        // Me vo a la página inicial por si se esta en otra página
        //router.push("/");
      }
    },
  });

  /**
   * Servicio que llama a los metadata de las aplicaciones. El resultado no se trata porque no se va hacer nada con el.
   */
  const [getMetadataApps] = useLazyQuery(QUERY_METADATA, {
    ssr: false,
    fetchPolicy: "network-only",
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
    onCompleted: (data) => {},
  });

  return { buildSAPUrl2Connect, getMetadataCore };
}
