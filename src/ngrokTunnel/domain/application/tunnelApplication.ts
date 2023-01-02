import { ApolloError } from "@apollo/client";
import TunnelRepository from "ngrokTunnel/infraestructure/repositories/tunnelRepository";
import { responseTunelRepoArray } from "ngrokTunnel/infraestructure/types/repository";
import { Result } from "shared/core/Result";
import ErrorGraphql from "shared/errors/ErrorGraphql";
import Tunnel from "../entities/tunnel";

export default class TunnelApplication {
  private tunnelRepository: TunnelRepository;

  constructor() {
    this.tunnelRepository = new TunnelRepository();
  }
  /**
   * Devuelve la lista de tuneles activo
   * @param apiToken | Token de conexión con la API
   * @returns | Promise con el resultado o error del proceso
   */
  async getTunnels(apiToken: string): Promise<responseTunelRepoArray> {
    try {
      let data = await this.tunnelRepository.getTunnels(apiToken);
      return Result.ok<Tunnel[]>(data);
    } catch (error) {
      return Result.fail<ErrorGraphql>(
        ErrorGraphql.create(error as ApolloError)
      );
    }
  }
}
