import { Box } from "@mui/material";
import SpotifyLogin from "components/settings/spotify-login";
import SideNav from "components/shared/sidenav";
import React from "react";

export default function Settings() {
  return (
    <SideNav pageName="Settings">
      <Box sx={{ margin: "10px" }}>
        <SpotifyLogin />
      </Box>
    </SideNav>
  );
}
