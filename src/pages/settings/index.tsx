import { Box } from "@mui/material";
import SpotifyLogin from "components/settings/spotify-login";
import React from "react";

export default function Settings() {
  return (
    <Box sx={{ margin: "10px" }}>
      <SpotifyLogin />
    </Box>
  );
}
