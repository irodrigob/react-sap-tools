import System from "systems/domain/entities/system";
import SystemRepositoryInterface from "systems/domain/interfaces/systemRepository";
import { gql, ApolloClient, ApolloError } from "@apollo/client";
import { initializeApollo } from "graphql/client";
import { Result } from "shared/core/Result";
import { responseSystemRepoArray } from "systems/domain/interfaces/systemRepository";
import ErrorGraphql from "shared/errors/ErrorGraphql";
import { SystemDTO } from "systems/infraestructure/dto/systemDTO";

export const MAIN_SYSTEMS_FIELDS = gql`
  fragment MainSystemsFields on Systems {
    _id
    user
    name
    host
    sap_user
    sap_password
    ngrok_active
    ngrok_api_token
    ngrok_tunnel
  }
`;

export const QUERY_USER_SYSTEMS = gql`
  query Query($user: String!) {
    getSystemsByUser(user: $user) {
      ...MainSystemsFields
    }
  }
  ${MAIN_SYSTEMS_FIELDS}
`;

export const MUTATION_NEW_SYSTEM = gql`
  mutation Mutation($input: InputSystems) {
    newSystem(input: $input) {
      ...MainSystemsFields
    }
  }
  ${MAIN_SYSTEMS_FIELDS}
`;

export const MUTATION_UPDATE_SYSTEM = gql`
  mutation Mutation($id: String!, $input: InputSystems) {
    updateSystem(id: $id, input: $input) {
      ...MainSystemsFields
    }
  }
  ${MAIN_SYSTEMS_FIELDS}
`;

export const MUTATION_DELETE_SYSTEM = gql`
  mutation Mutation($id: String!) {
    deleteSystem(id: $id) {
      ...MainSystemsFields
    }
  }
  ${MAIN_SYSTEMS_FIELDS}
`;

export default class SystemRepository implements SystemRepositoryInterface {
  private _apolloClient: ApolloClient<any>;

  constructor() {
    this._apolloClient = initializeApollo();
  }
  async getUserSystems(user: String): Promise<responseSystemRepoArray> {
    try {
      const response = await this._apolloClient.query({
        query: QUERY_USER_SYSTEMS,
        variables: {
          user: user,
        },
      });

      let tt = response.data.getSystemsByUser.map((row: SystemDTO) => {
        return new System(
          row._id,
          row.user,
          row.name,
          row.host,
          row.sap_user,
          row.sap_password,
          row.ngrok_active,
          row.ngrok_api_token,
          row.ngrok_tunnel
        );
      });
      return Result.ok<System[]>(tt);
    } catch (error) {
      return Result.fail(ErrorGraphql.create(error as ApolloError));
    }
  }
}
