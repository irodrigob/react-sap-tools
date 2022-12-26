import { useEffect } from "react";
import { Text } from "@ui5/webcomponents-react";
import Grid from "@mui/material/Unstable_Grid2";
import { useTranslations } from "translations/i18nContext";

export default function Main() {
  const { getI18nText } = useTranslations();

  useEffect(() => {
    document.title = getI18nText("app.title");
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
      <Grid xs={6} sx={{ marginTop: "2rem" }}>
        <Text>{getI18nText("app.instructions1")}</Text>
        <br></br>
        <br></br>
        <Text>{getI18nText("app.instructions2")}</Text>;
      </Grid>
    </Grid>
  );
}
