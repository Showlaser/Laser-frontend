import { Button, Icon } from "@mui/material";
import React, { useEffect, useState } from "react";
import { getSpotifyAccessTokens, grandSpotifyAccess } from "services/logic/spotify";
import { getCodeFromResponse } from "services/shared/general";
import paths from "services/shared/router-paths";

export default function SpotifyLogin() {
  const accessTokenAvailable: boolean = localStorage.getItem("SpotifyAccessToken") !== null;
  const [loggedIn, setLoggedIn] = useState<boolean>(accessTokenAvailable);

  useEffect(() => {
    const code = getCodeFromResponse();
    if (code?.length < 10) {
      return;
    }

    getSpotifyAccessTokens(code).then((tokens) => {
      localStorage.setItem("SpotifyAccessToken", tokens.access_token);
      localStorage.setItem("SpotifyRefreshToken", tokens.refresh_token);
      setLoggedIn(true);
    });

    window.history.replaceState(null, "Laser controller", paths.Settings);
  }, []);

  const login = () => {
    grandSpotifyAccess().then((response) =>
      response?.text().then((responseText) => (window.location.href = responseText))
    );
  };

  const removeSpotifyTokens = () => {
    localStorage.removeItem("SpotifyAccessToken");
    localStorage.removeItem("SpotifyRefreshToken");
    setLoggedIn(false);
  };

  return (
    <>
      <h2>
        <img src="icons/spotify-icon.svg" style={{ maxWidth: "20px", marginRight: "5px" }} />
        Spotify
      </h2>
      {loggedIn ? (
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
