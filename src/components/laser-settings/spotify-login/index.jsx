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

  const removeSpotifyTokens = () => {
    localStorage.removeItem("SpotifyAccessToken");
    localStorage.removeItem("SpotifyRefreshToken");
    window.location = paths.LaserSettings;
  };

  return (
    <div>
      <h2>Spotify</h2>
      {localStorage.getItem("SpotifyAccessToken")?.length > 10 ? (
        <span>
          <p>You are logged in to Spotify</p>
          <Button onClick={removeSpotifyTokens}>Logout of Spotify</Button>
        </span>
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
