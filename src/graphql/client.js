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

export function createApolloClient() {
  return new ApolloClient({
    link: createIsomorphLink(),
    cache: new InMemoryCache(),
  });
}
