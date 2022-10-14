import { useSelector } from "react-redux";
import { DynamicPage, DynamicPageHeader } from "@ui5/webcomponents-react";
import FiltersOrdersTable from "components/transportOrder/filtersOrdersTable";
import OrdersTable from "components/transportOrder/ordersTable";
import { useTranslations } from "translations/i18nContext";

export default function MainTransportOrder(props) {
  const { getI18nText } = useTranslations();
  const { userOrderList } = useSelector((state) => state.SAPTransportOrder);

  return (
    <DynamicPage
      showHideHeaderButton={true}
      headerContentPinnable={false}
      headerContent={
        <DynamicPageHeader>
          {userOrderList && userOrderList.length > 0 ? (
            <FiltersOrdersTable />
          ) : null}
        </DynamicPageHeader>
      }
      style={{ paddingLeft: "0px", paddingRight: "0px" }}
    >
      <OrdersTable />
    </DynamicPage>
  );
}
