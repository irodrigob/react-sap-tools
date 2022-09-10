import * as types from "./sapTransportOrderTypes";

/**
 * Ordenes/Tareas seleccionadas
 */
export const actionOrderTaskSelected = (data) => (dispatch) => {
  dispatch({
    type: types.ORDERTASKSELECTED,
    payload: data,
  });
};

/**
 * Lista de ordenes del usuario
 */
export const actionUserOrderList = (data) => (dispatch) => {
  dispatch({
    type: types.USERORDERLIST,
    payload: data,
  });
};

/**
 * Indica que se tiene que leer las ordenes del usuario. Se usa
 * para lectura inicial como para refrescos
 */
export const actionRefreshUsersOrders = (data) => (dispatch) => {
  dispatch({
    type: types.REFRESHUSERORDERS,
    payload: data,
  });
};
/**
 * Systema seleccionado para el transporte de copia
 */
export const actionSystemTransportCopy = (data) => (dispatch) => {
  dispatch({
    type: types.SYSTEMTRANSPORTCOPY,
    payload: data,
  });
};
