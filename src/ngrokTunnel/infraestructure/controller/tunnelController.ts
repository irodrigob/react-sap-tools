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
  /**
   * Devuelve el contenido para el fichero que lanza el tunnel
   * @param host | Host donde hay que hacer el tunnel
   * @returns String con el contenido a guardar en el fichero
   */
  getContentLaunchTunnel(host: string): string {
    return this.tunnelApplication.getContentLaunchTunnel(host);
  }
}
