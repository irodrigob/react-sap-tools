import Tunnel from "ngrokTunnel/domain/entities/tunnel";
import System from "systems/domain/entities/system";

export default interface TunnelRepositoryInterface {
  /**
   * Recupera los sistemas de un usuario
   * @param user | Usuario
   * @returns Promesa con un array de sistemas
   */
  getTunnels(user: String): Promise<Tunnel[]>;
}
