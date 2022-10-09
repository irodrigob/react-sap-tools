import SAPTransportOrderLayout from "components/layout/sap/sapTransOrderLayout";
import MainTransportOrder from "components/transportOrder/main";
import InstructionsWoSystem from "components/transportOrder/instructionsWoSystem";
import { useGlobalData } from "context/globalDataContext";
export default function TransportOrder(props) {
  const { systemSelected, connectedToSystem } = useGlobalData();

  return (
    <SAPTransportOrderLayout>
      {!systemSelected.name && <InstructionsWoSystem />}
      {systemSelected.name && <MainTransportOrder />}
    </SAPTransportOrderLayout>
  );
}
