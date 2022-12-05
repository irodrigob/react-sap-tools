import SystemRepository from "systems/infraestructure/repositories/systemRepository";
import System from "../entities/system";
export default class SystemApplication {
  private _systemReposity: SystemRepository;

  constructor() {
    this._systemReposity = new SystemRepository();
  }
  getUserSystems(user: String): Promise<System[]> {
    return this._systemReposity.getUserSystems(user);
  }
}
