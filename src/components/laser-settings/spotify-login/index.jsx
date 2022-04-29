import { Button } from "@mui/material";
import { useEffect } from "react";
import {
  getCodeFromResponse,
  getSpotifyAccessTokens,
  grandSpotifyAccess,
} from "services/logic/spotify";
import paths from "services/shared/router-paths";

export default function SpotifyLogin() {
  useEffect(() => {
    const code = getCodeFromResponse();
    if (code?.length < 10) {
      return;
    }

    getSpotifyAccessTokens(code).then((data) =>
      data.json().then((tokens) => {
        localStorage.setItem("SpotifyAccessToken", tokens.access_token);
        localStorage.setItem("SpotifyRefreshToken", tokens.refresh_token);
        window.location = paths.LaserSettings;
      })
    );
  }, []);

  const login = () => {
    grandSpotifyAccess().then((response) => {
      response.text().then((responseText) => {
        window.location = responseText;
      });
    });
  };

  return (
    <div>
      <h2>Spotify</h2>
      {localStorage.getItem("SpotifyAccessToken")?.length > 10 ? (
        <p>You are logged in to Spotify</p>
      ) : (
        <Button
          variant="contained"
          style={{ backgroundColor: "#1DB954" }}
          onClick={login}
        >
          Login to Spotify
        </Button>
      )}
    </div>
  );
}
