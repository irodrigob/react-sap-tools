import { useCallback } from "react";
import useNgrok from "ngrokTunnel/application/useNgrok";

export default function useSystemsController() {
  const { determineTunnelForSystem } = useNgrok();
  /**
   * Actualización del tunel del sistema pasado por parámetro.
   * @param {object} oSystem | Estructura del sistema a actualizar
   * @param {function} fnCallBackSuccess | Función que se ejecuta en caso de éxito
   * @param {function} fnCallBackError | Función que se ejecuta cuando da error.
   */
  const updateTunnelService = (oSystem, fnCallBackSuccess, fnCallBackError) => {
    determineTunnelForSystem(
      oSystem,
      (httpTunnel) => {
        if (httpTunnel == oSystem.ngrok_tunnel) {
          fnCallBackSuccess({});
        } else {
        }
      },
      fnCallBackError
    );
  };

  return { updateTunnelService };
}
