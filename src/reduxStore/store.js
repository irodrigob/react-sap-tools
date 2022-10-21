import { configureStore } from "@reduxjs/toolkit";
import SAPTransportOrderReducer from "reduxStore/sapTransportOrderSlice";
import MessageManagerReducer from "components/messageManager/messageManagerSlice";

export default configureStore({
  reducer: {
    SAPTransportOrder: SAPTransportOrderReducer,
    MessageManager: MessageManagerReducer,
  },
});
