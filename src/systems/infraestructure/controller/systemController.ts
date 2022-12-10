import SystemApplication from "systems/domain/application/SystemApplication";
import { responseSystemRepoArray } from "systems/domain/interfaces/systemRepository";

export class SystemController {
  _systemApplication: SystemApplication;

  constructor() {
    this._systemApplication = new SystemApplication();
  }
  getUserSystems(user: String): Promise<responseSystemRepoArray> {
    return this._systemApplication.getUserSystems(user);
  }
}
