import system from "systems/domain/entities/system";
import SystemRepositoryInterface from "systems/domain/interfaces/systemRepository";
import { useLazyQuery, gql } from "@apollo/client";

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

export default class systemRepository implements SystemRepositoryInterface {
  async getUserSystems(user: String): Promise<system[]> {}
}
