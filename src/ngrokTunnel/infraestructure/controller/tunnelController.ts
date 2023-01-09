import {
  responseTunnelRepoArray,
  responseTunnelConfigRepo,
} from "ngrokTunnel/infraestructure/types/repository";
import TunnelApplication from "ngrokTunnel/domain/application/tunnelApplication";
import TunnelConfiguration from "ngrokTunnel/domain/entities/configuration";
import TunnelConfigurationApplication from "ngrokTunnel/domain/application/configurationApplication";

export default class TunnelController {
  protected tunnelApplication: TunnelApplication;
  protected tunnelConfApplication: TunnelConfigurationApplication;

  constructor() {
    this.tunnelApplication = new TunnelApplication();
    this.tunnelConfApplication = new TunnelConfigurationApplication();
  }
  /**
   * Devuelve la lista de tuneles activo
   * @param apiToken | Token de conexión con la API
   * @returns | Promise con el resultado o error del proceso
   */
  getTunnels(apiToken: string): Promise<responseTunnelRepoArray> {
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
  /**
   * Devuelve la configuración del tunel del usuario
   * @param user | Usuario
   * @returns | Promise con el resultado o error del proceso
   */
  getConfiguration(user: string): Promise<responseTunnelConfigRepo> {
    return this.tunnelConfApplication.getConfiguration(user);
  }
  /**
   * Actualización de la configuración para el tunel
   * @param configuration | Actualiza la configuración del tunel
   * @returns | Promise con el resultado o error del proceso
   */
  async editConfiguration(
    configuration: TunnelConfiguration
  ): Promise<responseTunnelConfigRepo> {
    return this.tunnelConfApplication.editConfiguration(configuration);
  }
}
