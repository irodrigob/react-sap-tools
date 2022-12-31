import { useEffect } from "react";
import {
  Text,
  Title,
  TitleLevel,
  Avatar,
  Button,
} from "@ui5/webcomponents-react";
import Grid from "@mui/material/Grid";
import "@ui5/webcomponents-icons/dist/locked";
import { GoogleButtonLogin } from "../../auth/components/googleButtonLogin";
import { useTranslations } from "translations/i18nContext";

export default function Login() {
  const { getI18nText } = useTranslations();

  useEffect(() => {
    document.title = getI18nText("login.page.title");
  }, []);

  return (
    <Grid
      container
      spacing={0}
      direction="column"
      alignItems="center"
      justifyContent="center"
      style={{ minHeight: "30vh" }}
    >
      <Grid item xs={6} style={{ marginBottom: "0.5rem" }}>
        <Avatar colorScheme="Accent6" icon="locked" shape="Circle" size="S" />
      </Grid>
      <Grid item xs={6}>
        <Title level={TitleLevel.H2}>{getI18nText("login.page.title")}</Title>
      </Grid>
      <Grid item xs={6} style={{ marginTop: "2rem" }}>
        <Grid item xs={6} style={{ marginTop: "2rem" }}>
          <GoogleButtonLogin />
        </Grid>
      </Grid>
    </Grid>
  );
}
