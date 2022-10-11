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
    loadingOrders: false,
    toolbarFilters: { types: [], status: [] },
  },
  reducers: {
    orderTaskSelectedAction: (state, action) => {
      state.orderTaskSelected = action.payload;
    },
    userOrderListAction: (state, action) => {
      state.userOrderList = action.payload;
    },
    userOrderListFromServiceAction: (state, action) => {
      state.userOrderListFromService = action.payload;
    },
    refreshUserOrdersAction: (state, action) => {
      state.refreshUserOrders = action.payload;
    },
    systemTransportCopyAction: (state, action) => {
      state.systemTransportCopy = action.payload;
    },
    systemsTransportCopyAction: (state, action) => {
      state.systemsTransportCopy = action.payload;
    },
    loadingOrdersAction: (state, action) => {
      state.loadingOrders = action.payload;
    },
    toolbarFiltersAction: (state, action) => {
      state.toolbarFilters = action.payload;
    },
  },
});

export const {
  orderTaskSelectedAction,
  userOrderListAction,
  refreshUserOrdersAction,
  systemTransportCopyAction,
  systemsTransportCopyAction,
  userOrderListFromServiceAction,
  loadingOrdersAction,
  toolbarFiltersAction,
} = SAPTransportOrderSlice.actions;

export default SAPTransportOrderSlice.reducer;
