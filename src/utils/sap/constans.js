import { MESSAGE } from "utils/general/message";

export const GATEWAY_CONF = {
  ODATA_SERVICE: "/ZSAP_TOOLS_CORE_SRV",
  ODATA_TRANSP_SERVICE: "/ZSAP_TOOLS_TRANS_ORDER_SRV",
  ODATA_PATH: "/sap/opu/odata/sap",
};

export const MSG_SAP_2_MSG_APP = {
  e: MESSAGE.TYPE.ERROR,
  s: MESSAGE.TYPE.SUCCCES,
  w: MESSAGE.TYPE.WARNING,
};

export const CSS = {
  FOOTER_HEIGHT: 51.19,
};
