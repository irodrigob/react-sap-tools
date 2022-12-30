import { gql, ApolloClient } from "@apollo/client";
import System from "systems/domain/entities/system";
import SystemRepositoryInterface from "systems/domain/interfaces/systemRepositoryInterface";
import { initializeApollo } from "graphql/client";

import type {
  newSystemDTO,
  SystemDTO,
} from "systems/infraestructure/dto/systemDTO";

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

  async getUserSystems(user: String): Promise<System[]> {
    const response = await this._apolloClient.query({
      query: QUERY_USER_SYSTEMS,
      variables: {
        user: user,
      },
    });

    return response.data.getSystemsByUser.map((row: SystemDTO) => {
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
  }
  async saveNewSystem(newSystem: newSystemDTO): Promise<System> {
    const response = await this._apolloClient.mutate({
      mutation: MUTATION_NEW_SYSTEM,
      variables: {
        input: {
          user: newSystem.user,
          name: newSystem.name,
          host: newSystem.host,
          sap_password: newSystem.sap_password,
          sap_user: newSystem.sap_user,
          ngrok_active: newSystem.ngrok_active,
          ngrok_api_token: newSystem.ngrok_api_token,
          ngrok_tunnel: newSystem.ngrok_tunnel,
        },
      },
    });
    let newSystemResponse = response.data.newSystem as SystemDTO;
    return new System(
      newSystemResponse._id,
      newSystemResponse.user,
      newSystemResponse.name,
      newSystemResponse.host,
      newSystemResponse.sap_user,
      newSystemResponse.sap_password,
      newSystemResponse.ngrok_active,
      newSystemResponse.ngrok_api_token,
      newSystemResponse.ngrok_tunnel
    );
  }
  async updateSystem(system: System): Promise<System> {
    const response = await this._apolloClient.mutate({
      mutation: MUTATION_UPDATE_SYSTEM,
      variables: {
        id: system._id,
        input: {
          user: system.user,
          name: system.name,
          host: system.host,
          sap_password: system.sap_password,
          sap_user: system.sap_user,
          ngrok_active: system.ngrok_active,
          ngrok_api_token: system.ngrok_api_token,
          ngrok_tunnel: system.ngrok_tunnel,
        },
      },
    });
    let updatedSystem = response.data.updateSystem as System;
    return new System(
      updatedSystem._id,
      updatedSystem.user,
      updatedSystem.name,
      updatedSystem.host,
      updatedSystem.sap_user,
      updatedSystem.sap_password,
      updatedSystem.ngrok_active,
      updatedSystem.ngrok_api_token,
      updatedSystem.ngrok_tunnel
    );
  }
  async deleteSystem(IDsystem: string): Promise<System> {
    const response = await this._apolloClient.mutate({
      mutation: MUTATION_DELETE_SYSTEM,
      variables: {
        id: IDsystem,
      },
    });
    let deletedSystem = response.data.deleteSystem as System;
    return new System(
      deletedSystem._id,
      deletedSystem.user,
      deletedSystem.name,
      deletedSystem.host,
      deletedSystem.sap_user,
      deletedSystem.sap_password,
      deletedSystem.ngrok_active,
      deletedSystem.ngrok_api_token,
      deletedSystem.ngrok_tunnel
    );
  }
}
