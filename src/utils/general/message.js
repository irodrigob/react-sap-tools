import { toast } from "react-toastify";

export const MESSAGE = {
  TYPE: {
    SUCCCES: toast.TYPE.SUCCESS,
    ERROR: toast.TYPE.ERROR,
    INFO: toast.TYPE.INFO,
    WARNING: toast.TYPE.WARNING,
    DEFAULT: toast.TYPE.DEFAULT,
  },
  DEFAULTCONFTOAST: {
    position: toast.POSITION.TOP_RIGHT,
    autoClose: 5000,
    theme: "dark",
  },
};

/**
 * Devuelve un texto formateado con las variables pasadas en el array. Las variable debe de empezar
 * por &<numero>: &1, &2, etc
 * @param {string} sMessage - Texto del mensaje
 * @param {Array} aVariables - Variables que se reemplazan contra las variables &1, &2, etc..
 */
export function buildMessage(sMessage, aVariables) {
  var sMessageFormatted = sMessage;

  // Si hay variables se sustituye en el texto
  if (aVariables) {
    for (var x = 0; x < aVariables.length; x++) {
      sMessageFormatted = sMessageFormatted.replace(
        "&" + (x + 1),
        aVariables[x]
      );
    }
  }

  return sMessageFormatted;
}
/**
 * Muestra un mensaje toast a partir de la estructura a partir de unos parámetros.
 * Si falta algún parámetro se toma el valor por defecto.
 *
 * @param {string} sMessage - Mensaje
 * @param {string} pType - Tipo de mensaje
 * @param {object} params - Parametros de la llamada

 */
export function showToast(
  sMessage,
  pType = toast.TYPE.SUCCESS,
  pParams = MESSAGE.DEFAULTCONFTOAST
) {
  return toast[pType](sMessage, pParams);
}
