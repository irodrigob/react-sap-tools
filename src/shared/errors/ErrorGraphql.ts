import { ApolloError, ServerError } from "@apollo/client";
import { GraphQLError } from "graphql";
import ErrorBase, { ErrorBaseProps } from "shared/errors/ErrorBase";
export default class ErrorGraphql extends ErrorBase {
  static create(oErrorGraphQL: ApolloError): ErrorGraphql {
    let valores: ErrorBaseProps;

    // Error en la llamada al servicio. Se produce el servicio peta y da un HTTP 400 o similares.
    if (oErrorGraphQL.networkError) {
      let networkError = oErrorGraphQL.networkError as ServerError;

      return new ErrorGraphql({
        networkError: true,
        HTTPStatusCode: networkError.statusCode,
        singleMessage: networkError.result?.errors[0].message
          ? networkError.result.errors[0].message
          : networkError.result?.message
          ? networkError.result.message
          : oErrorGraphQL.message,
        messages: networkError.result?.errors,
      });
    } else if (oErrorGraphQL.graphQLErrors) {
      return new ErrorGraphql({
        networkError: false,
        singleMessage: oErrorGraphQL.graphQLErrors[0].message,
        messages: oErrorGraphQL.graphQLErrors.map(
          (sRow: GraphQLError) => sRow.message
        ),
      });
    } else {
      return new ErrorGraphql({
        networkError: false,
        singleMessage: oErrorGraphQL.message,
        messages: [],
      });
    }
  }
}
