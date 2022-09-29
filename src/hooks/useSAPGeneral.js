import { useCallback } from "react";
import { gql, useLazyQuery } from "@apollo/client";
import { errorHandling } from "utils/graphQL/errorHandling";
import { GATEWAY_CONF } from "utils/sap/constans";
import { useSAPGlobalData } from "context/sapDataContext";
import { useGlobalData } from "context/globalDataContext";
import { useTranslations } from "translations/i18nContext";

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
    }
  }
`;

export default function useSAPGeneral() {
  const { getI18nText, tkeys, language } = useTranslations();
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

  return { buildSAPUrl2Connect };
}
