import { useState, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Toolbar,
  ToolbarSeparator,
  ToolbarSpacer,
  Button,
  Input,
} from "@ui5/webcomponents-react";
import "@ui5/webcomponents-icons/dist/AllIcons.js";
import PopupTransCopy from "components/transportOrder/popupTransCopy";
import {
  descriptionTransportCopyAction,
  textSearchAction,
  orderTaskSelectedAction,
} from "reduxStore/sapTransportOrderSlice";
import { useTranslations } from "translations/i18nContext";
import useSAPTransportOrder from "hooks/useSAPTransportOrder";
import { showToast, MESSAGE } from "utils/general/message";

export default function ToolbarTable(props) {
  const { getI18nText } = useTranslations();
  const dispatch = useDispatch();
  const { reloadUserOrders, doTransportCopy } = useSAPTransportOrder();
  const { orderTaskSelected } = useSelector((state) => state.SAPTransportOrder);
  const [openPopupTransCopy, setOpenPopupTransCopy] = useState(false);

  /*************************************
   * Funciones
   ************************************/

  return (
    <>
      <Toolbar>
        <ToolbarSpacer />
        <Button
          icon="duplicate"
          onClick={(e) => {
            e.stopPropagation();
            dispatch(
              descriptionTransportCopyAction(orderTaskSelected[0].description)
            );
            setOpenPopupTransCopy(true);
          }}
          tooltip={getI18nText("transportOrder.toolbarAction.transportCopy")}
          style={{
            ...(orderTaskSelected.length == 0 && { display: "none" }),
          }}
        />
        <ToolbarSeparator />
        <Input
          placeholder={getI18nText(
            "transportOrder.toolbarAction.textSearchPlaceholder"
          )}
          onInput={(e) => {
            if (e.target.value.length > 2 || e.target.value.length == 0) {
              // Quito las tareas seleccionadas porque sino hay una discrepancia entre la tabla
              // y los registros seleccionados y provoca que no funcione bien el transporte de copias.
              dispatch(orderTaskSelectedAction([]));
              dispatch(textSearchAction(e.target.value));
            }
          }}
        />
        <Button
          icon="refresh"
          onClick={(e) => {
            e.stopPropagation();
            reloadUserOrders();
          }}
          tooltip={getI18nText("transportOrder.toolbarAction.refreshOrders")}
        />
      </Toolbar>
      <PopupTransCopy
        open={openPopupTransCopy}
        onCloseButton={(e) => {
          setOpenPopupTransCopy(false);
        }}
        onConfirmButton={(data) => {
          setOpenPopupTransCopy(false);

          showToast(
            getI18nText(
              "transportOrder.transportCopy.popup.msgTransportInProcess"
            ),
            MESSAGE.TYPE.INFO
          );

          // Se lanza el proceso de transporte de copia
          doTransportCopy(data.system, data.description);
        }}
      />
    </>
  );
}
