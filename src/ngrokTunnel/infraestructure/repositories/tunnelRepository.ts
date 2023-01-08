import TunnelRepositoryInterface from "ngrokTunnel/domain/interfaces/tunnelRepositoryInterface";
import { gql } from "@apollo/client";
import Tunnel from "ngrokTunnel/domain/entities/tunnel";
import graphQLRepository from "shared/infraestructure/repository/graphQLRepository";
import TunnelConfiguration from "ngrokTunnel/domain/entities/configuration";

export const QUERY_TUNNELS = gql`
  query Query($apiToken: String!) {
    getTunnelsList(apiToken: $apiToken) {
      forwards_to
      id
      proto
      public_url
      started_at
    }
  }
`;

export const QUERY_CONFIGURATION = gql`
  query Query($user: String!) {
    getTunnelConfiguration(user: $user) {
      _id
      user
      provider
      authToken
      apiToken
    }
  }
`;

export default class TunnelRepository
  extends graphQLRepository
  implements TunnelRepositoryInterface
{
  async getTunnels(apiToken: string): Promise<Tunnel[]> {
    const response = await this._apolloClient.query({
      query: QUERY_TUNNELS,
      fetchPolicy: "network-only",
      variables: {
        apiToken: apiToken,
      },
    });

    return response.data.getTunnelsList.map((row: any) => {
      return new Tunnel(
        row.forwards_to,
        row.id,
        row.proto,
        row.public_url,
        row.started_at
      );
    });
  }
  async getTunnelConfiguration(user: string): Promise<TunnelConfiguration> {
    const response = await this._apolloClient.query({
      query: QUERY_CONFIGURATION,
      fetchPolicy: "network-only",
      variables: {
        user: user,
      },
    });

    return response.data.getTunnelsList.map((row: any) => {
      return new TunnelConfiguration(
        row._id,
        row.authToken,
        row.apiToken,
        row.provider
      );
    });
  }
}
