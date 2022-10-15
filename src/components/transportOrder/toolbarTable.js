import { useSelector, useDispatch } from "react-redux";
import {
  Toolbar,
  ToolbarSeparator,
  ToolbarSpacer,
  Button,
} from "@ui5/webcomponents-react";

import { useTranslations } from "translations/i18nContext";
import useSAPTransportOrder from "hooks/useSAPTransportOrder";
import "@ui5/webcomponents-icons/dist/AllIcons.js";

export default function ToolbarTable(props) {
  const { getI18nText } = useTranslations();
  const { reloadUserOrders } = useSAPTransportOrder();
  return (
    <Toolbar>
      <Button
        icon="duplicate"
        onClick={(e) => {
          e.stopPropagation();
        }}
        tooltip={getI18nText("transportOrder.toolbarAction.transportCopy")}
      />
      <ToolbarSpacer />
      <ToolbarSeparator />
      <Button
        icon="refresh"
        onClick={(e) => {
          e.stopPropagation();
          reloadUserOrders();
        }}
        tooltip={getI18nText("transportOrder.toolbarAction.refreshOrders")}
      />
    </Toolbar>
  );
}
