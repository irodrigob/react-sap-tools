import { createSlice } from "@reduxjs/toolkit";

export const SAPTransportOrderSlice = createSlice({
  name: "SAPTransportOrder",
  initialState: {
    orderTaskSelected: [],
    userOrderListTree: [],
    userOrderListFromService: [],
    refreshUserOrders: false,
    systemTransportCopy: "",
    descriptionTransportCopy: "",
    systemsTransportCopy: [],
    loadingOrders: false,
    toolbarFilters: {
      orderTypes: [],
      orderStatus: [],
      releaseDateFrom: null,
    },
    toolbarFiltersState: {
      orderTypes: "None",
      orderTypesDesc: "",
      orderStatus: "None",
      orderStatusDesc: "",
      releaseDate: "None",
      releaseDateDesc: "",
    },
    systemChanged: true,
    textSearch: "",
  },
  reducers: {
    orderTaskSelectedAction: (state, action) => {
      state.orderTaskSelected = action.payload;
    },
    userOrderListTreeAction: (state, action) => {
      state.userOrderListTree = action.payload;
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
    toolbarFiltersStateAction: (state, action) => {
      state.toolbarFiltersState = action.payload;
    },
    systemChangedAction: (state, action) => {
      state.systemChanged = action.payload;
    },
    descriptionTransportCopyAction: (state, action) => {
      state.descriptionTransportCopy = action.payload;
    },
    textSearchAction: (state, action) => {
      state.textSearch = action.payload;
    },
  },
});

export const {
  orderTaskSelectedAction,
  userOrderListTreeAction,
  refreshUserOrdersAction,
  systemTransportCopyAction,
  systemsTransportCopyAction,
  userOrderListFromServiceAction,
  loadingOrdersAction,
  toolbarFiltersAction,
  systemChangedAction,
  descriptionTransportCopyAction,
  toolbarFiltersStateAction,
  textSearchAction,
} = SAPTransportOrderSlice.actions;

export default SAPTransportOrderSlice.reducer;
