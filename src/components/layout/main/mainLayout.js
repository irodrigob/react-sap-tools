import { useTheme } from "@mui/material/styles";
import { Outlet } from "react-router-dom";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import { styled } from "@mui/material/styles";
import AppTopToolbar from "../appBar/appBar";

export default function MainLayout() {
  const theme = useTheme();
  return (
    <>
      <AppTopToolbar />
      <Box component="main">
        <Toolbar />
        <Outlet />
      </Box>
    </>
  );
}
