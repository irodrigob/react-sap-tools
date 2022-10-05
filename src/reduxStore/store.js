import { configureStore } from "@reduxjs/toolkit";
import SAPTransportOrderReducer from "./sapTransportOrderSlice";

export default configureStore({
  reducer: {
    SAPTransportOrderReducer: SAPTransportOrderReducer,
  },
});
