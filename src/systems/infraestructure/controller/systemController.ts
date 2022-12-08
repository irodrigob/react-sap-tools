import SystemApplication from "systems/domain/application/SystemApplication";
import { responseSystemRepoArray } from "systems/domain/interfaces/systemRepository";
import System from "systems/domain/entities/system";
import { Result } from "shared/core/Result";

export class SystemController {
  _systemApplication: SystemApplication;

  constructor() {
    this._systemApplication = new SystemApplication();
  }
  getUserSystems(user: String): Promise<responseSystemRepoArray> {
    return this._systemApplication.getUserSystems(user);
  }
}
