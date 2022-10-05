import { createSlice } from "@reduxjs/toolkit";

export const SAPTransportOrderSlice = createSlice({
  name: "SAPTransportOrder",
  initialState: {
    orderTaskSelected: [],
    userOrderList: [],
    refreshUserOrders: false,
    systemTransportCopy: "",
  },
  reducers: {
    orderTaskSelected: (state, action) => {
      state.orderTaskSelected = action.payload;
    },
    userOrderList: (state, action) => {
      state.userOrderList = action.payload;
    },
    refreshUserOrders: (state, action) => {
      state.refreshUserOrders = action.payload;
    },
    systemTransportCopy: (state, action) => {
      state.systemTransportCopy = action.payload;
    },
  },
});

export const {
  orderTaskSelected,
  userOrderList,
  refreshUserOrders,
  systemTransportCopy,
} = SAPTransportOrderSlice.actions;

export default SAPTransportOrderSlice.reducer;
