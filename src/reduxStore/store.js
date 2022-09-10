import { configureStore } from "@reduxjs/toolkit";
import generalReducer from "./generalSlice";

export default configureStore({
  reducer: {
    general: generalReducer,
  },
});
