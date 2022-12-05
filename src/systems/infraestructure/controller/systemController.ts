import SystemApplication from "systems/domain/application/systemApplication";

export default class SystemController {
  private _systemApplication: SystemApplication;

  constructor() {
    this._systemApplication = new SystemApplication();
  }
  getUserSystems(user: String) {
    this._systemApplication.getUserSystems(user);
  }
}
