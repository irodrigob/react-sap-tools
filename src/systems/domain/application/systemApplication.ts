import { ApolloError } from "@apollo/client";
import SystemRepository from "systems/infraestructure/repositories/systemRepository";
import System from "systems/domain/entities/system";
import { responseSystemRepoArray } from "systems/domain/interfaces/systemRepository";
import { Result } from "shared/core/Result";
import ErrorGraphql from "shared/errors/ErrorGraphql";

export default class SystemApplication {
  private _systemReposity: SystemRepository;

  constructor() {
    this._systemReposity = new SystemRepository();
  }
  async getUserSystems(user: String): Promise<responseSystemRepoArray> {
    try {
      let data = await this._systemReposity.getUserSystems(user);
      return Result.ok<System[]>(data);
    } catch (error) {
      return Result.fail(ErrorGraphql.create(error as ApolloError));
    }
  }
}
