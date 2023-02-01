import { Button } from "@mui/material";
import { SpotifyTokens } from "models/components/shared/Spotify";
import React, { useEffect, useState } from "react";
import {
  getSpotifyAccessTokens,
  grandSpotifyAccess,
  refreshSpotifyAccessToken,
  updateSpotifyToken,
} from "services/logic/spotify";
import { getCodeFromResponse, stringIsEmpty } from "services/shared/general";
import paths from "services/shared/router-paths";
import { showSuccess, toastSubject } from "services/shared/toast-messages";

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

    window.history.replaceState(null, "Laser controller", paths.Account);
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

  const testForceRefreshREMOVEINPRODUCTION = async () => {
    const refreshToken = localStorage.getItem("SpotifyRefreshToken");
    if (refreshToken === undefined || stringIsEmpty(refreshToken) || refreshToken === null) {
      return;
    }

    const tokens: SpotifyTokens | null = await refreshSpotifyAccessToken(refreshToken);
    if (tokens === null) {
      alert("Tokens null");
      return;
    }

    console.log(tokens);
    localStorage.setItem("SpotifyAccessToken", tokens.access_token);
    localStorage.setItem("SpotifyRefreshToken", tokens.refresh_token);
    updateSpotifyToken(tokens.access_token);
    showSuccess(toastSubject.changesSaved);
  };

  return (
    <div style={{ textAlign: "left" }}>
      <h2>
        <img src="icons/spotify-icon.svg" style={{ maxWidth: "20px", marginRight: "5px" }} />
        Spotify
      </h2>
      {loggedIn ? (
        <span>
          <p>You are logged in to Spotify</p>
          <Button onClick={removeSpotifyTokens}>Logout of Spotify</Button>
          <Button onClick={() => testForceRefreshREMOVEINPRODUCTION()}>
            Force token refresh NOTE: DEVELOPMENT ONLY REMOVE IN PRODUCTION
          </Button>
        </span>
      ) : (
        <Button variant="contained" style={{ backgroundColor: "#1DB954" }} onClick={login}>
          Login to Spotify
        </Button>
      )}
    </div>
  );
}
