import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { orderTaskSelectedAction } from "reduxStore/sapTransportOrderSlice";
import ToolbarTable from "components/transportOrder/toolbarTable";
import CustomAnalyticTable from "components/customAnalyticTable/CustomAnalyticTable";
import { useTranslations } from "translations/i18nContext";
import { useGlobalData } from "context/globalDataContext";
import useSAPTransportOrder from "hooks/useSAPTransportOrder";
import { FIELDS_TREE_TABLE } from "utils/sap/transportOrder";

/*
export const useStartExpanded = (hooks) => {
  hooks.useInstance.push(useInstance);
};
useStartExpanded.pluginName = "useStartExpanded";

const useInstance = (instance) => {
  const {
    state: { startExpanded },
    toggleAllRowsExpanded,
  } = instance;
  // toggleAllRowsExpanded(true);
};*/

export default function OrdersTableTree(props) {
  const refTable = useRef();
  const { getI18nText } = useTranslations();
  const { systemSelected, connectedToSystem } = useGlobalData();
  const { loadInitialData, searchOrdersTableTree } = useSAPTransportOrder();
  const dispatch = useDispatch();
  const {
    userOrderListTree,
    loadingOrders,
    systemChanged,
    orderTaskSelected,
    textSearch,
  } = useSelector((state) => state.SAPTransportOrder);

  /*************************************
   * Memo
   ************************************/
  /* Nota IRB: En React Table que es lo que se basa el componente estándar pone que se useMemo para los datos y columnas.
   Y en este tabla como va a tener más iteracción voy a seguir ese consejo. Aunque con el mismo componente para los sistemas
   me ha ido relativamente bien.
  */
  const valuesTable = useMemo(() => {
    return searchOrdersTableTree(userOrderListTree, textSearch);
  }, [userOrderListTree, textSearch]);

  // Memo para para poner los índices de los registros expandido
  const expandedRows = useMemo(() => {
    let rows = [];
    rows = valuesTable.map((row, index) => {
      if (row[FIELDS_TREE_TABLE.EXPANDED]) return { [index]: true };
    });
    return rows;
  }, [valuesTable]);

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
    // Si hay sistema seleccionado y el sistema ha cambiado se lee de nuevo
    if (systemSelected.name && systemChanged) loadInitialData();
  }, [systemSelected]);

  /*************************************
   * Funciones
   ************************************/

  return (
    <>
      <CustomAnalyticTable
        header={<ToolbarTable />}
        columns={columns}
        data={valuesTable}
        isTreeTable={true}
        filterable={true}
        allowDelete={false}
        tableInstance={refTable}
        loading={loadingOrders || !connectedToSystem}
        noDataText={getI18nText("transportOrder.noData")}
        visibleRows="19"
        reactTableOptions={{
          initialState: {
            expanded: expandedRows,
          },
        }}
        selectionMode="MultiSelect"
        selectionBehavior="RowSelector"
        onRowSelect={(event) => {
          let newOrderTaskSelected = [...orderTaskSelected];
          let tabix = newOrderTaskSelected.findIndex(
            (row) => row.id == event.detail.row.original.id
          );
          if (tabix !== -1)
            newOrderTaskSelected.splice(tabix, tabix >= 0 ? 1 : 0);
          else newOrderTaskSelected.push(event.detail.row.original);

          dispatch(orderTaskSelectedAction(newOrderTaskSelected));
        }}
      />
    </>
  );
}
