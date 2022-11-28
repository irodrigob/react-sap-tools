import { useLazyQuery, gql, useQuery } from "@apollo/client";
import { useGlobalData } from "context/globalDataContext";
import { useState } from "react";
import { useTranslations } from "translations/i18nContext";
import { showToast, MESSAGE } from "utils/general/message";
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

export default function useNgrok() {
  const { getI18nText } = useTranslations();
  const { systemsList } = useGlobalData();
  const [systemDetermineTunnel, setSystemDetermineTunnel] = useState({});
  const [fnCallBackDetermineTunnel, setFnCallBackDetermineTunnel] = useState();

  /*************************************
   * Funciones
   ************************************/

  const determineTunnelForSystem = (oSystem, fnCallBack) => {
    setSystemDetermineTunnel(oSystem);
    setFnCallBackDetermineTunnel(fnCallBack);
    getNgrokTunnels({
      variables: {
        apiToken: oSystem.ngrok_api_token,
      },
    });
  };

  /*************************************
   * Servicios graphQL
   ************************************/
  /**
   * Servicio que llama al $metadata de los servicio del Core. Este paso es necesario es básica en Gateway para que
   * se refresquen los cambios que haya podido haber en el servidor.
   * En este metada hay postprocesos ya que si algo falla es que no hay conexión con SAP o el servicio no existe.
   */

  const [getNgrokTunnels] = useLazyQuery(QUERY_TUNNELS, {
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
    onCompleted: (data) => {
      // Hay veces que falla la llamada y entra por el onError y por el onCompleted, porque son errore que al no ser
      // de red entra por este evento. La única manera de solventarlo es mirar si el dato que devuelve es un nulo. Si lo es, no ejecute los pasos siguientes
      if (data.getTunnelsList != null) {
        let systemIndex = data.getTunnelsList.findIndex(
          (row) => row.forwards_to.indexOf(systemDetermineTunnel.host) != -1
        );
        if (data.getTunnelsList.length == 0 || systemIndex == -1) {
          showToast(getI18nText("ngrok.withOutTunnels"), MESSAGE.TYPE.INFO);
        } else {
          if (
            data.getTunnelsList[systemIndex].public_url ==
            systemDetermineTunnel.ngrok_tunnel
          ) {
            showToast(getI18nText("ngrok.tunnelNotChange"), MESSAGE.TYPE.INFO);
          } else {
            console.log("tunnel no igual");
          }
        }
      }
    },
  });

  return { determineTunnelForSystem };
}
