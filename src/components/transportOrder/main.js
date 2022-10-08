import { useEffect, useState, useMemo, useRef } from "react";
import { useSelector } from "react-redux";
import CustomAnalyticTable from "components/customAnalyticTable/CustomAnalyticTable";
import { AnalyticalTableHooks } from "@ui5/webcomponents-react";
import { useTranslations } from "translations/i18nContext";
import { useGlobalData } from "context/globalDataContext";
import useSAPTransportOrder from "hooks/useSAPTransportOrder";

export const useStartExpanded = (hooks) => {
  hooks.useInstance.push(useInstance);
};
useStartExpanded.pluginName = "useStartExpanded";

const useInstance = (instance) => {
  /* const {
    state: { startExpanded },
    toggleAllRowsExpanded,
  } = instance;*/
  // toggleAllRowsExpanded(true);
};

export default function MainTransportOrder(props) {
  const refTable = useRef();
  const { getI18nText } = useTranslations();
  const { systemSelected, connectedToSystem } = useGlobalData();
  const { loadInitialData } = useSAPTransportOrder();
  const { userOrderList, loadingOrders } = useSelector(
    (state) => state.SAPTransportOrder
  );

  /*************************************
   * Memo
   ************************************/
  /* Nota IRB: En React Table que es lo que se basa el componente estándar pone que se useMemo para los datos y columnas.
 Y en este tabla como va a tener más iteracción voy a seguir ese consejo. Aunque con el mismo componente para los sistemas
 me ha ido relativamente bien.
*/
  const valuesTable = useMemo(() => {
    return userOrderList;
  }, [userOrderList]);

  // Memo para para poner los índices de los registros expandido por defecto
  const expandedRows = useMemo(() => {
    let rows = [];
    rows = userOrderList.map((row, index) => {
      if (row.subRows.length > 0) return { [index]: true };
    });
    return rows;
  }, [userOrderList]);

  const columns = useMemo(
    () => [
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
    ],
    []
  );

  /*************************************
   * Efectos
   ************************************/

  useEffect(() => {
    if (systemSelected.name) loadInitialData();
  }, [systemSelected]);

  return (
    <>
      <CustomAnalyticTable
        columns={columns}
        data={valuesTable}
        isTreeTable={true}
        filterable={true}
        allowDelete={false}
        tableInstance={refTable}
        tableHooks={[useInstance]}
        loading={loadingOrders || !connectedToSystem}
        noDataText={
          loadingOrders || !connectedToSystem
            ? getI18nText("transportOrder.loadingOrder")
            : getI18nText("transportOrder.noData")
        }
        reactTableOptions={{
          initialState: {
            expanded: expandedRows,
          },
        }}
      />
    </>
  );
}
