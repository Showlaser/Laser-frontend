import { Button } from "@mui/material";
import React, { useEffect } from "react";
import { getSpotifyAccessTokens, grandSpotifyAccess } from "services/logic/spotify";
import { getCodeFromResponse } from "services/shared/general";
import paths from "services/shared/router-paths";

export default function SpotifyLogin() {
  useEffect(() => {
    const code = getCodeFromResponse();
    if (code?.length < 10) {
      return;
    }

    getSpotifyAccessTokens(code).then((tokens) => {
      localStorage.setItem("SpotifyAccessToken", tokens.access_token);
      localStorage.setItem("SpotifyRefreshToken", tokens.refresh_token);
      window.location.href = paths.Settings;
    });
  }, []);

  const login = () => {
    grandSpotifyAccess().then((response) =>
      response?.text().then((responseText) => (window.location.href = responseText))
    );
  };

  const removeSpotifyTokens = () => {
    localStorage.removeItem("SpotifyAccessToken");
    localStorage.removeItem("SpotifyRefreshToken");
    window.location.href = paths.Settings;
  };

  const accessTokenAvailable: boolean = localStorage.getItem("SpotifyAccessToken") !== null;

  return (
    <>
      <h2>Spotify</h2>
      {accessTokenAvailable ? (
        <span>
          <p>You are logged in to Spotify</p>
          <Button onClick={removeSpotifyTokens}>Logout of Spotify</Button>
        </span>
      ) : (
        <Button variant="contained" style={{ backgroundColor: "#1DB954" }} onClick={login}>
          Login to Spotify
        </Button>
      )}
    </>
  );
}
