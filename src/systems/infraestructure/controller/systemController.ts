import SystemApplication from "systems/domain/application/SystemApplication";
import type {
  responseSystemRepoArray,
  responseNewSystemRepo,
  responseSystemRepo,
} from "systems/infraestructure/types/repository";
import SystemApplicationValidations from "systems/domain/validations/SystemApplicationValidations";
import System from "systems/domain/entities/system";
import type { newSystemDTO } from "systems/infraestructure/dto/systemDTO";

export class SystemController {
  protected _systemApplication: SystemApplication;
  protected _systemValidations: SystemApplicationValidations;

  constructor() {
    this._systemApplication = new SystemApplication();
    this._systemValidations = new SystemApplicationValidations();
  }
  /**
   * Obtención de los usuarios de los sistemas
   * @param user | Usuario
   * @returns Array de sistemas
   */
  getUserSystems(user: String): Promise<responseSystemRepoArray> {
    return this._systemApplication.getUserSystems(user);
  }
  /**
   * Validación que el host este formateado.
   * @param host | Host
   * @returns Si es valido, o no.
   */
  validateHost(host: string): boolean {
    if (host.length > 0) return this._systemValidations.validateHost(host);
    else return true;
  }
  /**
   * Grabación de nuevo sistema
   * @param newSystem | Nuevo sistema
   * @returns Promisa con el resultado del proceso
   */
  createNewSystem(newSystem: newSystemDTO): Promise<responseNewSystemRepo> {
    return this._systemApplication.createNewSystem(newSystem);
  }
  /**
   * Actualiza un sistema
   * @param system | Sistema a actualizar
   * @returns  Promesa con el resultado o error del sistema actualizado
   */
  async updateSystem(system: System): Promise<responseSystemRepo> {
    return this._systemApplication.updateSystem(system);
  }
  /**
   * Borra un sistema
   * @param IDsystem | ID de sistema a eliminar
   * @returns  Promesa con el resultado o error del sistema borrado
   */
  async deleteSystem(IDsystem: string): Promise<responseSystemRepo> {
    return this._systemApplication.deleteSystem(IDsystem);
  }
  /**
   * Actualiza el tunel de conexión
   * @param system | Sistema a actualizar
   * @returns  Promesa con el resultado o error del tunel actualizado
   */
  async updateConnectionTunnel(
    IDsystem: string,
    connectionTunnel: string
  ): Promise<responseSystemRepo> {
    return this._systemApplication.updateConnectionTunnel(
      IDsystem,
      connectionTunnel
    );
  }
}
