import * as types from "./generalTypes";

/**
 * Texto del loader
 */
export const actionTextLoader = (data) => (dispatch) => {
  dispatch({
    type: types.TEXTLOADER,
    payload: data,
  });
};

/**
 * Icono del loader
 */
export const actionIconLoader = (data) => (dispatch) => {
  dispatch({
    type: types.ICONLOADER,
    payload: data,
  });
};

/**
 * Mostrar/ocultar el loader
 */
export const actionShowLoader = (data) => (dispatch) => {
  dispatch({
    type: types.SHOWLOADER,
    payload: data,
  });
};
