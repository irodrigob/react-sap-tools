import { ApolloError } from "@apollo/client";
import { Result } from "shared/core/Result";
import ErrorGraphql from "shared/errors/ErrorGraphql";
import { responseTunnelConfigRepo } from "ngrokTunnel/infraestructure/types/repository";
import TunnelConfiguration from "ngrokTunnel/domain/entities/configuration";
import TunnelRepository from "ngrokTunnel/infraestructure/repositories/tunnelRepository";

export default class TunnelConfigurationApplication {
  private tunnelRepository: TunnelRepository;

  constructor() {
    this.tunnelRepository = new TunnelRepository();
  }
  /**
   * Devuelve la configuración del usuario para el tunel
   * @param user | Usuario
   * @returns | Promise con el resultado o error del proceso
   */
  async getConfiguration(user: string): Promise<responseTunnelConfigRepo> {
    try {
      let data = await this.tunnelRepository.getConfiguration(user);
      return Result.ok<TunnelConfiguration>(data);
    } catch (error) {
      return Result.fail<ErrorGraphql>(
        ErrorGraphql.create(error as ApolloError)
      );
    }
  }
  /**
   * Actualización de la configuración para el tunel
   * @param configuration | Actualiza la configuración del tunel
   * @returns | Promise con el resultado o error del proceso
   */
  async editConfiguration(
    configuration: TunnelConfiguration
  ): Promise<responseTunnelConfigRepo> {
    try {
      let data = await this.tunnelRepository.editConfiguration(configuration);
      return Result.ok<TunnelConfiguration>(data);
    } catch (error) {
      return Result.fail<ErrorGraphql>(
        ErrorGraphql.create(error as ApolloError)
      );
    }
  }
}
