import { ApolloClient } from "@apollo/client";
import { initializeApollo } from "graphql/client";

export default class graphQLRepository {
  protected _apolloClient: ApolloClient<any>;

  constructor() {
    this._apolloClient = initializeApollo();
  }
}
