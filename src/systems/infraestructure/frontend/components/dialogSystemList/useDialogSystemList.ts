import { useEffect, useState } from "react";
import { ValueState, FlexBox, Button } from "@ui5/webcomponents-react";
import { useTranslations } from "translations/i18nContext";
import IconInteractive from "shared/components/iconInteractive";
import CellAction from "./cellContents";

export default function useDialogSystemList() {
  const { getI18nText } = useTranslations();
  const [columns, setColumns] = useState<any>([]);

  /*************************************
   * Efectos
   ************************************/
  useEffect(() => {
    setColumns([
      {
        Cell: CellAction,
        Header: "Actions",
        accessor: "actions",
        disableFilters: true,
        disableGroupBy: true,
        disableResizing: true,
        disableSortBy: true,
        numberIcons: 1,
        id: "actions",
      },
      {
        Header: getI18nText("systems.labelName"),
        accessor: "name",
        headerTooltip: getI18nText("systems.labelName"),
        edit: true,
        required: true,
        width: 200,
      },
      {
        Header: getI18nText("systems.labelHOST"),
        accessor: "host",
        headerTooltip: getI18nText("systems.labelHOST"),
        edit: true,
        required: true,
        width: 400,
      },
      {
        Header: getI18nText("systems.labelSAPUser"),
        accessor: "sap_user",
        headerTooltip: getI18nText("systems.labelSAPUser"),
        edit: true,
        required: true,
        width: 150,
      },
      {
        Header: getI18nText("systems.labelSAPPassword"),
        accessor: "sap_password",
        headerTooltip: getI18nText("systems.labelSAPPassword"),
        edit: true,
        required: true,
        width: 150,
        type: "Password",
      },
      {
        Header: getI18nText("systems.labelNgrokActive"),
        accessor: "ngrok_active",
        headerTooltip: getI18nText("systems.labelNgrokActive"),
        edit: true,
        required: false,
        width: 100,
        componentType: "checkbox",
      },
      {
        Header: getI18nText("systems.labelNgrokApiToken"),
        accessor: "ngrok_api_token",
        headerTooltip: getI18nText("systems.labelNgrokApiToken"),
        edit: true,
        required: false,
        width: 200,
        type: "Password",
      },
      {
        Header: getI18nText("systems.labelNgrokTunnel"),
        accessor: "ngrok_tunnel",
        headerTooltip: getI18nText("systems.labelNgrokTunnel"),
        edit: true,
        required: false,
        width: 300,
      },
    ]);
  }, []);

  return { columns };
}
