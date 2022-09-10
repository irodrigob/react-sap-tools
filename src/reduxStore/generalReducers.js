import * as types from "./generalTypes";

/**
 * Reducer para la aplicación general
 * @param {object} state - State
 * @param {object} action - type es el tipo de acción a realizar y payload
 */
export const GeneralReducers = (
  state = {
    textLoader: "",
    showLoader: false,
    iconLoader: null,
  },
  action
) => {
  switch (action.type) {
    case types.TEXTLOADER:
      return { ...state, textLoader: action.payload };
    case types.ICONLOADER:
      return { ...state, iconLoader: action.payload };
    case types.SHOWLOADER:
      return { ...state, showLoader: action.payload };
    default:
      return state;
  }
};
