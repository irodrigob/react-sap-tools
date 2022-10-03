import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SAPLayout from "components/layout/sap/sapLayout";
import MainTransportOrder from "components/transportOrder/main";
import { useTranslations } from "../../translations/i18nContext";
import { useGlobalData } from "context/globalDataContext";

export default function TransportOrder(props) {
  const { getI18nText } = useTranslations();
  const { systemSelected } = useGlobalData();
  const navigate = useNavigate();

  /*************************************
   * Efectos
   ************************************/
  useEffect(() => {
    console.log("entra");
  }, []);

  useEffect(() => {
    if (!systemSelected.name) navigate("/");
  }, [systemSelected]);

  return (
    <SAPLayout>
      <MainTransportOrder />
    </SAPLayout>
  );
}
