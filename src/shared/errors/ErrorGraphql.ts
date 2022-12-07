import { ApolloError, ServerError } from "@apollo/client";
import { GraphQLError } from "graphql";
import ErrorBase, { ErrorBaseProps } from "./ErrorBase";
export default class ErrorGraphql extends ErrorBase {
  static create(oErrorGraphQL: ApolloError) {
    let valores: ErrorBaseProps;

    // Error en la llamada al servicio. Se produce el servicio peta y da un HTTP 400 o similares.
    if (oErrorGraphQL.networkError) {
      let networkError = oErrorGraphQL.networkError as ServerError;

      return new ErrorGraphql({
        networkError: true,
        HTTPStatusCode: networkError.statusCode,
        singleMessage: networkError.result?.errors[0],
        messages: networkError.result?.errors[0].message
          ? networkError.result.errors[0].message
          : networkError.result?.message
          ? networkError.result.message
          : oErrorGraphQL.message,
      });
    } else if (oErrorGraphQL.graphQLErrors) {
      return new ErrorGraphql({
        networkError: false,
        singleMessage: oErrorGraphQL.graphQLErrors[0].message,
        messages: oErrorGraphQL.graphQLErrors.map(
          (sRow: GraphQLError) => sRow.message
        ),
      });
    }
  }
}
