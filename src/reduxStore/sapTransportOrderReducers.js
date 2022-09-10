import * as types from "./sapTransportOrderTypes";

/**
 * Reducer para los transportes de ordenes
 * @param {object} state - State
 * @param {object} action - type es el tipo de acción a realizar y payload
 */
export const SapTransportOrderReducers = (
  state = {
    orderTaskSelected: [],
    userOrderList: [],
    refreshUserOrders: false,
    systemTransportCopy: "",
  },
  action
) => {
  switch (action.type) {
    case types.ORDERTASKSELECTED:
      return { ...state, orderTaskSelected: action.payload };
    case types.USERORDERLIST:
      return { ...state, userOrderList: action.payload };
    case types.REFRESHUSERORDERS:
      return { ...state, refreshUserOrders: action.payload };
    case types.SYSTEMTRANSPORTCOPY:
      return { ...state, systemTransportCopy: action.payload };
    default:
      return state;
  }
};
