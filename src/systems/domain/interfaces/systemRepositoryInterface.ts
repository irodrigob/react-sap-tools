import System from "systems/domain/entities/system";
import type { newSystemDTO } from "systems/infraestructure/dto/systemDTO";

export default interface SystemRepositoryInterface {
  /**
   * Recupera los sistemas de un usuario
   * @param user | Usuario
   * @returns Promesa con un array de sistemas
   */
  getUserSystems(user: String): Promise<System[]>;

  /**
   * Graba un nuevo sistema
   * @param newSystem | Nuevo sistema
   * @returns Promesa con el sistema creado
   */
  saveNewSystem(newSystem: newSystemDTO): Promise<System>;
  /**
   * Actualiza un sistema
   * @param system | Sistema a actualizar
   * @returns Promesa con el sistema actualizado
   */
  updateSystem(system: System): Promise<System>;
  /**
   * Borra un sistema
   * @param IDsystem | ID del sistema a borrar
   * @returns Promesa con el sistema borrado
   */
  deleteSystem(IDSystem: string): Promise<System>;
  /**
   * Actualiza el tunel de conexión
   * @param IDSystem | ID del sistema a borrar
   * @param connectionTunnel | Tunel de conexión
   * @returns Promesa con el sistema actualizado
   */
  updateConnectionTunnel(
    IDSystem: string,
    connectionTunnel: string
  ): Promise<System>;
}
