import { createSlice } from "@reduxjs/toolkit";

export const generalSlice = createSlice({
  name: "general",
  initialState: {
    textLoader: "",
    showLoader: false,
    iconLoader: null,
  },
  reducers: {
    textLoader: (state, action) => {
      state.textLoader = action.payload;
    },
    iconLoader: (state, action) => {
      state.iconLoader = action.payload;
    },
    showLoader: (state, action) => {
      state.iconLoader = action.payload;
    },
  },
});

export const { actionTextLoader, actionIconLoader, actionShowLoader } =
  generalSlice.actions;

export const selectGeneral = (state) => state;

export default generalSlice.reducer;
