import { useCallback, useEffect, useRef } from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import { useTheme } from "@mui/material/styles";
import "@ui5/webcomponents-icons/dist/sys-help";
import "@ui5/webcomponents-icons/dist/menu2";
import "@ui5/webcomponents-icons/dist/account";
import { Grid } from "@mui/material";
import GeneralHelp from "components/generalHelp/generalHelp";
import { MessageManagerButton } from "components/messageManager/messageManagerComponent";
import useMessageManager from "components/messageManager/useMessageManager";
import SelectApp from "./selectApp/selectApp";
import { useGlobalData } from "context/globalDataContext";
import UserAvatar from "./userAvatar";
import SystemSelect2 from "components/systemSelect/systemSelect2";
import { useSession } from "auth/authProvider";
import { useTranslations } from "translations/i18nContext";

export default function AppTopToolbar() {
  const { session } = useSession();
  const { getI18nText } = useTranslations();
  const { setShowListApps, showListApps } = useGlobalData();
  const { messagesNumber } = useMessageManager();
  const theme = useTheme();

  /*************************************
   * Efectos
   ************************************/

  return (
    <>
      {session && (
        <AppBar
          position="fixed"
          sx={{ backgroundColor: "var(--sapShellColor)" }}
        >
          <Toolbar variant="dense">
            <Grid
              container
              direction="row"
              alignItems="center"
              justifyContent="flex-start"
            >
              <Grid item xs={6} sm={6} md={6} lg={6} xl={6}>
                <Grid container spacing={2}>
                  <Grid item>
                    <SelectApp />
                  </Grid>
                  <Grid item>
                    <SystemSelect2 />
                  </Grid>
                </Grid>
              </Grid>

              <Grid item xs={6} sm={6} md={6} lg={6} xl={6}>
                <Grid
                  container
                  direction="row"
                  alignItems="center"
                  justifyContent="flex-end"
                  spacing={4}
                >
                  {messagesNumber > 0 && (
                    <Grid item>
                      <MessageManagerButton />
                    </Grid>
                  )}
                  <Grid item>
                    <GeneralHelp />
                  </Grid>
                  <Grid item>
                    <UserAvatar />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Toolbar>
        </AppBar>
      )}
    </>
  );
}
