import { useSelector } from "react-redux";
import { DynamicPage, DynamicPageHeader } from "@ui5/webcomponents-react";
import FiltersOrdersTable from "components/transportOrder/filtersOrdersTable";
import OrdersTableTree from "components/transportOrder/ordersTableTree";
import { useTranslations } from "translations/i18nContext";

export default function MainTransportOrder(props) {
  const { getI18nText } = useTranslations();
  const { userOrderListTree } = useSelector((state) => state.SAPTransportOrder);

  return (
    <DynamicPage
      showHideHeaderButton={true}
      headerContentPinnable={false}
      headerContent={
        <DynamicPageHeader>
          {userOrderListTree && userOrderListTree.length > 0 ? (
            <FiltersOrdersTable />
          ) : null}
        </DynamicPageHeader>
      }
      style={{ paddingLeft: "0px", paddingRight: "0px" }}
    >
      <OrdersTableTree />
    </DynamicPage>
  );
}
