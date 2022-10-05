import SAPLayout from "components/layout/sap/sapLayout";
import { SAPTransportOrderProvider } from "context/sapTransportOrder";

export default function SAPTransportOrderLayout(props) {
  return (
    <SAPTransportOrderProvider>
      <SAPLayout>{props.children}</SAPLayout>
    </SAPTransportOrderProvider>
  );
}
