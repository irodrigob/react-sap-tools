import SystemApplication from "systems/domain/application/SystemApplication";
import { responseSystemRepoArray } from "systems/domain/interfaces/systemRepository";
import SystemApplicationValidations from "systems/domain/validations/SystemApplicationValidations";

export class SystemController {
  protected _systemApplication: SystemApplication;
  protected _systemValidations: SystemApplicationValidations;
  //protected _systemFormmatters:

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
}
