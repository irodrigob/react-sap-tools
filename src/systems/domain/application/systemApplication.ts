import { ApolloError } from "@apollo/client";
import SystemRepository from "systems/infraestructure/repositories/systemRepository";
import System from "systems/domain/entities/system";
import type {
  responseSystemRepoArray,
  responseNewSystemRepo,
} from "systems/infraestructure/types/general";
import { Result } from "shared/core/Result";
import ErrorGraphql from "shared/errors/ErrorGraphql";
import type { newSystemDTO } from "systems/infraestructure/dto/systemDTO";

export default class SystemApplication {
  private _systemReposity: SystemRepository;

  constructor() {
    this._systemReposity = new SystemRepository();
  }
  /**
   * Devuelve los usuarios del sistema
   * @param user | Usuario
   * @returns | Promesa con la respuesta o error del proceso
   */
  async getUserSystems(user: String): Promise<responseSystemRepoArray> {
    try {
      let data = await this._systemReposity.getUserSystems(user);
      return Result.ok<System[]>(data);
    } catch (error) {
      return Result.fail<ErrorGraphql>(
        ErrorGraphql.create(error as ApolloError)
      );
    }
  }
  /**
   * Crea un nuevo sistema
   * @param newSystem | Crea un nuevo sistema
   * @returns | Promesa con el nuevo sistema
   */
  async createNewSystem(
    newSystem: newSystemDTO
  ): Promise<responseNewSystemRepo> {
    try {
      let data = await this._systemReposity.saveNewSystem(newSystem);
      return Result.ok<System>(data);
    } catch (error) {
      return Result.fail<ErrorGraphql>(
        ErrorGraphql.create(error as ApolloError)
      );
    }
  }
}
