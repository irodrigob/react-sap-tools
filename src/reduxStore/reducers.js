import { combineReducers } from "redux";
import * as sapTransportOrderReducers from "./sapTransportOrderReducers";
import * as generalReducers from "./generalReducers";
//import * as messageManagerReducers from "components/messageManager/messageManagerReducers";

const reducers = {
  sapTransportOrder: sapTransportOrderReducers.SapTransportOrderReducers,
  general: generalReducers.GeneralReducers,
  //messageManager: messageManagerReducers.MessageManagerReducers,
};
export default combineReducers(reducers);
