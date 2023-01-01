import TunnelRepositoryInterface from "ngrokTunnel/domain/interfaces/tunnelRepositoryInterface";
import Tunnel from "ngrokTunnel/domain/entities/tunnel";
import { ApolloClient } from "@apollo/client";
import { initializeApollo } from "graphql/client";

class TunnelRepository implements TunnelRepositoryInterface {
  async getTunnels(user: String): Promise<Tunnel[]> {
    return new Promise((resolve, reject) => {});
  }
}
