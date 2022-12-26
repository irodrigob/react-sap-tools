import { Outlet } from "react-router-dom";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import AppBarContainer from "./appBar/appBarContainer";

export default function MainLayout() {
  
  return (
    <>
      <AppBarContainer />
      <Box component="main">
        <Toolbar />
        <Outlet />
      </Box>
    </>
  );
}
