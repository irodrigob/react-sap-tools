import SystemApplication from "systems/domain/application/SystemApplication";

export class SystemController {
  _systemApplication: SystemApplication;

  constructor() {
    this._systemApplication = new SystemApplication();
  }
  getUserSystems(user: String): void {
    this._systemApplication
      .getUserSystems(user)
      .then((data) => {
        console.log(data);
      })
      .catch((error) => {
        console.log("Errores--> ");
        console.log(error);
      });
  }
}
