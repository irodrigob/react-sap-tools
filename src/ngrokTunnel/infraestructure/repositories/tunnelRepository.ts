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

export const MUTATION_EDIT_CONFIGURATION = gql`
  mutation Mutation(
    $id: String!
    $user: String!
    $input: InputTunnelConfiguration
  ) {
    updateSystem(id: $id, user: $user, input: $input) {
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
  async getConfiguration(user: string): Promise<TunnelConfiguration> {
    const response = await this._apolloClient.query({
      query: QUERY_CONFIGURATION,
      fetchPolicy: "network-only",
      variables: {
        user: user,
      },
    });

    if (
      Array.isArray(response.data.getTunnelsList) &&
      response.data.getTunnelsList.length > 0
    )
      return response.data.getTunnelsList.map((row: any) => {
        return new TunnelConfiguration(
          row._id,
          row.user,
          row.authToken,
          row.apiToken,
          row.provider
        );
      });
    else {
      return new TunnelConfiguration("", "", "", "");
    }
  }
  async editConfiguration(
    configuration: TunnelConfiguration
  ): Promise<TunnelConfiguration> {
    const response = await this._apolloClient.mutate({
      mutation: MUTATION_EDIT_CONFIGURATION,
      variables: {
        id: configuration._id,
        user: configuration.user,
        input: {
          provider: configuration.provider,
          authToken: configuration.authToken,
          apiToken: configuration.apiToken,
        },
      },
    });
    let updatedConf = response.data
      .editTunnelConfiguration as TunnelConfiguration;
    return new TunnelConfiguration(
      updatedConf._id,
      updatedConf.user,
      updatedConf.authToken,
      updatedConf.apiToken,
      updatedConf.provider
    );
  }
}
