import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import CustomAnalyticTable from "components/customAnalyticTable/CustomAnalyticTable";
import { AnalyticalTable } from "@ui5/webcomponents-react";
import { useTranslations } from "translations/i18nContext";
import { useGlobalData } from "context/globalDataContext";
import useSAPTransportOrder from "hooks/useSAPTransportOrder";

export default function MainTransportOrder(props) {
  const { getI18nText } = useTranslations();
  const { systemSelected, connectedToSystem } = useGlobalData();
  const { loadInitialData } = useSAPTransportOrder();
  const [columns, setColumns] = useState([]);
  const { userOrderList } = useSelector((state) => state.SAPTransportOrder);

  /*************************************
   * Efectos
   ************************************/
  useEffect(() => {
    // Columnas de las tablas
    setColumns([
      {
        Header: getI18nText("transportOrder.tableOrder.labelOrdertask"),
        headerTooltip: getI18nText("transportOrder.tableOrder.labelOrdertask"),
        accessor: "orderTask",
      },
      {
        Header: getI18nText("transportOrder.tableOrder.labelDescription"),
        headerTooltip: getI18nText(
          "transportOrder.tableOrder.labelDescription"
        ),
        accessor: "description",
      },
      {
        Header: getI18nText("transportOrder.tableOrder.labelStatus"),
        headerTooltip: getI18nText("transportOrder.tableOrder.labelStatus"),
        accessor: "statusDesc",
      },
      {
        Header: getI18nText("transportOrder.tableOrder.labelOrderType"),
        headerTooltip: getI18nText("transportOrder.tableOrder.labelOrderType"),
        accessor: "typeDesc",
      },
      {
        Header: getI18nText("transportOrder.tableOrder.labelUser"),
        headerTooltip: getI18nText("transportOrder.tableOrder.labelUser"),
        accessor: "user",
      },
    ]);
  }, []);

  useEffect(() => {
    if (systemSelected.name) loadInitialData();
  }, [systemSelected]);

  return (
    <>
      <CustomAnalyticTable
        columns={columns}
        data={userOrderList}
        isTreeTable={true}
        filterable={true}
      />
    </>
  );
}
