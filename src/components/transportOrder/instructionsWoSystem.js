import { Text } from "@ui5/webcomponents-react";
import Grid from "@mui/material/Unstable_Grid2";
import { useTranslations } from "../../translations/i18nContext";

export default function InstructionsWoSystem(props) {
  const { getI18nText } = useTranslations();

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
        <Text>{getI18nText("transportOrder.instructions_wo_system")}</Text>
        <br></br>
        <br></br>
      </Grid>
    </Grid>
  );
}
