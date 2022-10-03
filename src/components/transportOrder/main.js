import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Text } from "@ui5/webcomponents-react";
import Grid from "@mui/material/Unstable_Grid2";
import { useTranslations } from "../../translations/i18nContext";
import { useGlobalData } from "context/globalDataContext";

export default function MainTransportOrder(props) {
  const { getI18nText } = useTranslations();
  const { systemSelected } = useGlobalData();
  const navigate = useNavigate();

  /*************************************
   * Efectos
   ************************************/

  useEffect(() => {
    console.log("componente");
  }, []);
  return (
    <Grid
      container
      spacing={0}
      direction="column"
      alignItems="center"
      justifyContent="center"
      style={{ minHeight: "40vh" }}
    >
      <Grid item xs={6} style={{ marginTop: "2rem" }}>
        <Text>Página de transporte de ordenes</Text>
        <br></br>
        <br></br>
      </Grid>
    </Grid>
  );
}
