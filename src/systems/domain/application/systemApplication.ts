import SystemRepository from "systems/infraestructure/repositories/systemRepository";
import { responseSystemRepoArray } from "systems/domain/interfaces/systemRepository";

export default class SystemApplication {
  private _systemReposity: SystemRepository;

  constructor() {
    this._systemReposity = new SystemRepository();
  }
  getUserSystems(user: String): Promise<responseSystemRepoArray> {
    return this._systemReposity.getUserSystems(user);
  }
}
