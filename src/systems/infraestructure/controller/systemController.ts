import SystemApplication from "systems/domain/application/SystemApplication";
import type {
  responseSystemRepoArray,
  responseNewSystemRepo,
} from "systems/infraestructure/types/general";
import SystemRepository from "systems/infraestructure/repositories/systemRepository";
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
    return this._systemValidations.validateHost(host);
  }
  /**
   * Grabación de nuevo sistema
   * @param newSystem | Nuevo sistema
   * @returns Promisa con el resultado del proceso
   */
  createNewSystem(newSystem: newSystemDTO): Promise<responseNewSystemRepo> {
    return this._systemApplication.createNewSystem(newSystem);
  }
}
