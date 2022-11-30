import { useCallback } from "react";
import { useLazyQuery, gql, useQuery } from "@apollo/client";
import { errorHandling } from "utils/graphQL/errorHandling";

export const QUERY_TUNNELS = gql`
  query Query($apiToken: String!) {
    getTunnelsList(apiToken: $apiToken) {
      forwards_to
      id
      proto
      public_url
      started_at
    }
  }
`;

export default function useNgrokServices() {
  /*************************************
   * Funciones
   ************************************/
  /**
   * Función que obtiene los tuneles del API Token
   * @param apiToken | API Token
   * @param fnCallBackSuccess | Función que se ejecuta cuando ha terminado la lectura de datos
   * @param fnCallBackError | Función que se ejecuta cuando se ha producido un error.
   */
  const getTunnelsService = useCallback(
    (apiToken, fnCallBackSuccess, fnCallBackError) => {
      getNgrokTunnels({
        variables: {
          apiToken: apiToken,
        },
        onCompleted: (data) => {
          fnCallBackSuccess(data);
        },
        onError: (error) => {
          fnCallBackError(errorHandling(error));
        },
      });
    },
    []
  );

  /*************************************
   * Servicios GraphQL
   ************************************/
  const [getNgrokTunnels] = useLazyQuery(QUERY_TUNNELS, {
    ssr: false,
    fetchPolicy: "network-only",
  });

  return { getTunnelsService };
}
