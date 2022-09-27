import { useCallback, useEffect, useRef } from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import { Button, Popover } from "@ui5/webcomponents-react";
import "@ui5/webcomponents-icons/dist/menu2";
import "@ui5/webcomponents-icons/dist/account";
import Grid from "@mui/material/Unstable_Grid2";
import ListApps from "./listApps";
import { useGlobalData } from "context/globalDataContext";
import UserAvatar from "./userAvatar";
import SystemSelect2 from "components/systemSelect/systemSelect2";
import { useSession } from "auth/authProvider";
import { useTranslations } from "translations/i18nContext";

export default function AppTopToolbar() {
  const { session } = useSession();
  const { getI18nText } = useTranslations();
  const { setShowListApps, showListApps } = useGlobalData();

  /*************************************
   * Efectos
   ************************************/

  return (
    <>
      {session && (
        <>
          <AppBar
            position="fixed"
            sx={{ backgroundColor: "var(--sapShellColor)" }}
          >
            <Toolbar variant="dense">
              <Grid container flexGrow={1} spacing={2}>
                <Grid xs="auto">
                  <Button
                    icon="menu2"
                    id="listApps"
                    onClick={() => {
                      setShowListApps(true);
                    }}
                  />
                </Grid>
                <Grid xs={6} display="flex" justifyContent="flex-start">
                  <SystemSelect2 />
                </Grid>
                <Grid
                  xs={4}
                  display="flex"
                  justifyContent="flex-end"
                  flexGrow={1}
                >
                  <UserAvatar />
                </Grid>
              </Grid>
            </Toolbar>
          </AppBar>
          <Popover
            opener="listApps"
            open={showListApps}
            onAfterClose={() => {
              setShowListApps(false);
            }}
          >
            <ListApps />
          </Popover>
        </>
      )}
    </>
  );
}
