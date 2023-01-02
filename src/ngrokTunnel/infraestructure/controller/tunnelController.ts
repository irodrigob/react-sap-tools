import { responseTunelRepoArray } from "ngrokTunnel/infraestructure/types/repository";
import TunnelApplication from "ngrokTunnel/domain/application/tunnelApplication";

export default class TunnelController {
  protected tunnelApplication: TunnelApplication;

  constructor() {
    this.tunnelApplication = new TunnelApplication();
  }
  /**
   * Devuelve la lista de tuneles activo
   * @param apiToken | Token de conexión con la API
   * @returns | Promise con el resultado o error del proceso
   */
  getTunnels(apiToken: string): Promise<responseTunelRepoArray> {
    return this.tunnelApplication.getTunnels(apiToken);
  }
}
