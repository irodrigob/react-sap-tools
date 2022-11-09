import { useCallback, useEffect, useRef } from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import { useTheme } from "@mui/material/styles";
import { Button } from "@ui5/webcomponents-react";
import "@ui5/webcomponents-icons/dist/sys-help";
import "@ui5/webcomponents-icons/dist/menu2";
import "@ui5/webcomponents-icons/dist/account";
import Grid from "@mui/material/Unstable_Grid2";
import { MessageManagerButton } from "components/messageManager/messageManagerComponent";
import useMessageManager from "components/messageManager/useMessageManager";
import SelectApp from "./selectApp/selectApp";
import { useGlobalData } from "context/globalDataContext";
import UserAvatar from "./userAvatar";
import SystemSelect2 from "components/systemSelect/systemSelect2";
import { useSession } from "auth/authProvider";
import { useTranslations } from "translations/i18nContext";
import IconInteractive from "components/general/iconInteractive/iconInteractive";

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
            <Grid container flexGrow={1} spacing={2}>
              <Grid xs="auto">
                <SelectApp />
              </Grid>
              <Grid xs={8} display="flex" justifyContent="flex-start">
                <SystemSelect2 />
              </Grid>
              {messagesNumber > 0 && (
                <Grid
                  xs={1}
                  display="flex"
                  justifyContent="flex-end"
                  flexGrow={1}
                >
                  <MessageManagerButton />
                </Grid>
              )}
              <Grid
                xs={1}
                display="flex"
                justifyContent="flex-end"
                flexGrow={1}
              >
                <IconInteractive
                  name="sys-help"
                  style={{
                    width: "2rem",
                    height: "2rem",
                    color: "var(--sapContent_Illustrative_Color2)",
                    paddingRight: "1rem",
                  }}
                  onClick={() => {
                    window.open(
                      "https://github.com/irodrigob/react-sap-tools",
                      "_blank",
                      "noopener,noreferrer"
                    );
                  }}
                />
              </Grid>
              <Grid
                xs={1}
                display="flex"
                justifyContent="flex-end"
                flexGrow={1}
              >
                <UserAvatar />
              </Grid>
            </Grid>
          </Toolbar>
        </AppBar>
      )}
    </>
  );
}
