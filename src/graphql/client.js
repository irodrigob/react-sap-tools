import { ApolloClient, InMemoryCache } from "@apollo/client";

let apolloClient;

function createIsomorphLink() {
  const { HttpLink } = require("@apollo/client/link/http");
  return new HttpLink({
    uri:
      process.env.REACT_APP_ENVIRONMENT === "production"
        ? "https://react-sap-tools-server.vercel.app/api/graphql"
        : "http://localhost:3001/api/graphql",
    credentials: "same-origin",
  });
}

function createApolloClient() {
  return new ApolloClient({
    link: createIsomorphLink(),
    cache: new InMemoryCache(),
  });
}

export function initializeApollo() {
  const _apolloClient = apolloClient ?? createApolloClient();
  if (!apolloClient) apolloClient = _apolloClient;

  return _apolloClient;
}
