/**
 *
 * @param {objeto} oErrorGraphQL | Objeto con el error que se produce en GrpahQL
 * @returns | Estructura simplifica del mensaje que se produce. Los campos son:
 * networkError: Booleano indicado si el error esta en el propio servicio. Suele error HTTP 400 o similares
 * HTTPStatusCode: Número y solo se rellena en caso de mensaje de red.
 * singleMessage: Primer mensaje de errores que se produce
 * messages: Array con todos los mensajes que se producen
 */
export function errorHandling(oErrorGraphQL) {
  // Monto la respuesta de la función
  let sResponse = {
    networkError: false,
    HTTPStatusCode: 0,
    singleMessage: "",
    messages: [],
    invalidArgs: {},
  };
  // Error en la llamada al servicio. Se produce el servicio peta y da un HTTP 400 o similares.
  if (oErrorGraphQL.networkError) {
    sResponse.networkError = true;
    sResponse.HTTPStatusCode = oErrorGraphQL.networkError.statusCode;
    sResponse.singleMessage = oErrorGraphQL.networkError.result?.errors[0]
      .message
      ? oErrorGraphQL.networkError.result.errors[0].message
      : oErrorGraphQL.networkError.result?.message
      ? oErrorGraphQL.networkError.result.message
      : oErrorGraphQL.message;
  }
  // El servicio se llama bien pero hay errores con la validación de datos.
  else if (oErrorGraphQL.graphQLErrors) {
    sResponse.singleMessage = oErrorGraphQL.graphQLErrors[0].message;
    sResponse.messages = oErrorGraphQL.graphQLErrors.map((sRow) => {
      return { message: sRow.message };
    });
  } else {
    // Cualquier otro tipo de error
    sResponse.singleMessage = oErrorGraphQL.message;
  }
  sResponse.invalidArgs = oErrorGraphQL.invalidArgs;

  return sResponse;
}
