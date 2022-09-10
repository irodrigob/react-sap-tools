import { ApolloClient, InMemoryCache } from "@apollo/client";

let apolloClient;

function createIsomorphLink() {
  const { HttpLink } = require("@apollo/client/link/http");
  return new HttpLink({
    uri: "http://localhost:3001/api/graphql",
    credentials: "same-origin",
  });
}

export function createApolloClient() {
  return new ApolloClient({
    link: createIsomorphLink(),
    cache: new InMemoryCache(),
  });
}
