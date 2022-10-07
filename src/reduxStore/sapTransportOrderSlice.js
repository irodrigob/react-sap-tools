import { createSlice } from "@reduxjs/toolkit";

export const SAPTransportOrderSlice = createSlice({
  name: "SAPTransportOrder",
  initialState: {
    orderTaskSelected: [],
    userOrderList: [],
    userOrderListFromService: [],
    refreshUserOrders: false,
    systemTransportCopy: "",
    systemsTransportCopy: [],
  },
  reducers: {
    orderTaskSelected: (state, action) => {
      state.orderTaskSelected = action.payload;
    },
    userOrderList: (state, action) => {
      state.userOrderList = action.payload;
    },
    userOrderListFromService: (state, action) => {
      state.userOrderListFromService = action.payload;
    },
    refreshUserOrders: (state, action) => {
      state.refreshUserOrders = action.payload;
    },
    systemTransportCopy: (state, action) => {
      state.systemTransportCopy = action.payload;
    },
    systemsTransportCopy: (state, action) => {
      state.systemsTransportCopy = action.payload;
    },
  },
});

export const {
  orderTaskSelected,
  userOrderList,
  refreshUserOrders,
  systemTransportCopy,
  systemsTransportCopy,
  userOrderListFromService,
} = SAPTransportOrderSlice.actions;

export default SAPTransportOrderSlice.reducer;
