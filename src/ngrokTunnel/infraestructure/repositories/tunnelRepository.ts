import TunnelRepositoryInterface from "ngrokTunnel/domain/interfaces/tunnelRepositoryInterface";
import { gql } from "@apollo/client";
import Tunnel from "ngrokTunnel/domain/entities/tunnel";
import graphQLRepository from "shared/infraestructure/repository/graphQLRepository";

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

export default class TunnelRepository
  extends graphQLRepository
  implements TunnelRepositoryInterface
{
  async getTunnels(apiToken: String): Promise<Tunnel[]> {
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
}
