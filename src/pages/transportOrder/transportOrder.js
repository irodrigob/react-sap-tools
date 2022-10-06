import { useEffect } from "react";
import SAPLayout from "components/layout/sap/sapLayout";
import SAPTransportOrderLayout from "components/layout/sap/sapTransOrderLayout";
import MainTransportOrder from "components/transportOrder/main";
import InstructionsWoSystem from "components/transportOrder/instructionsWoSystem";
import { useTranslations } from "translations/i18nContext";
import { useGlobalData } from "context/globalDataContext";

export default function TransportOrder(props) {
  const { getI18nText } = useTranslations();
  const { systemSelected, connectedToSystem } = useGlobalData();

  return (
    <SAPTransportOrderLayout>
      {(!systemSelected.name || !connectedToSystem) && <InstructionsWoSystem />}
      {systemSelected.name && connectedToSystem && <MainTransportOrder />}
    </SAPTransportOrderLayout>
  );
}
