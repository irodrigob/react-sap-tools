import { FC, ReactNode } from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import "@ui5/webcomponents-icons/dist/sys-help";
import "@ui5/webcomponents-icons/dist/menu2";
import "@ui5/webcomponents-icons/dist/account";
import "@ui5/webcomponents-icons/dist/settings";
import { Grid } from "@mui/material";
import { FlexBox, Button } from "@ui5/webcomponents-react";
import GeneralHelp from "main/frontend/layout/appBar/generalHelp/generalHelp";
import { MessageManagerButton } from "components/messageManager/messageManagerComponent";
import useMessageManager from "components/messageManager/useMessageManager";
import SelectApp from "components/layout/appBar/selectApp/selectApp";
import { useGlobalData } from "context/globalDataContext";
import UserAvatarContainer from "main/frontend/layout/appBar/userAvatar/userAvatarContainer";
import SystemSelectContainer from "systems/infraestructure/frontend/components/systemSelect/systemSelectContainer";
import { useSession } from "auth/authProvider";
import IconInteractive from "shared/frontend/components/iconInteractive";

interface Props {
  children: ReactNode;
}
const AppBarContainer: FC<Props> = (props) => {
  const { session } = useSession();
  const { messagesNumber } = useMessageManager();

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
                    <FlexBox>
                      <SystemSelectContainer />
                      <IconInteractive
                        name="settings"
                        sx={{
                          marginLeft: "0.6rem",
                          width: "1rem",
                          height: "1rem%",
                          marginTop: "0.66rem",
                          color: "var(--sapButton_Lite_TextColor)",
                        }}
                      />
                    </FlexBox>
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
                    <UserAvatarContainer />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Toolbar>
        </AppBar>
      )}
    </>
  );
};

export default AppBarContainer;
