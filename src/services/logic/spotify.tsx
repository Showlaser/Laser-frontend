import { Get } from "services/shared/api/api-actions";
import { sendRequest } from "services/shared/api/api-middleware";
import apiEndpoints from "services/shared/api/api-endpoints";
import SpotifyWebApi from "spotify-web-api-js";
import { stringIsEmpty } from "services/shared/general";
import { SpotifyTokens } from "models/components/shared/spotify-tokens";

const Spotify = new SpotifyWebApi();

const onError = async (errorCode: any) => {
  const code = Number(errorCode);
  if (code === 401) {
    const refreshToken = localStorage.getItem("SpotifyRefreshToken");
    if (refreshToken === undefined || stringIsEmpty(refreshToken) || refreshToken === null) {
      return;
    }

    const tokens: SpotifyTokens = await (await refreshSpotifyAccessToken(refreshToken))?.json();
    const tokensInvalid =
      !tokens.access_token ||
      tokens.access_token.length < 20 ||
      !tokens.refresh_token ||
      tokens.refresh_token.length < 20;
    if (tokensInvalid) {
      return;
    }

    localStorage.setItem("SpotifyAccessToken", tokens.access_token);
    localStorage.setItem("SpotifyRefreshToken", tokens.refresh_token);
    Spotify.setAccessToken(tokens.access_token);
  }
};

export const grandSpotifyAccess = () => {
  return sendRequest(() => Get(apiEndpoints.grandSpotifyAccess), []);
};

export const getSpotifyAccessTokens = (code: string) =>
  sendRequest(() => Get(`${apiEndpoints.getSpotifyAccessToken}?code=${code}`), []).then((value) => value?.json());

export const refreshSpotifyAccessToken = async (refreshToken: string) => {
  const response = await sendRequest(
    () => Get(`${apiEndpoints.refreshSpotifyAccessToken}?refreshToken=${refreshToken}`),
    [],
    undefined,
    false
  );

  if (response === undefined) {
    return null;
  }

  return response.json();
};

const executeRequest = async (request: () => any) => {
  const accessToken = localStorage.getItem("SpotifyAccessToken");
  if (accessToken === null || accessToken === "undefined") {
    return;
  }

  Spotify.setAccessToken(accessToken);
  return request()
    .then((data: any) => data)
    .catch(async (error: any) => {
      await onError(error.status);
      return request().then((data: any) => data);
    });
};

export const getUserPlaylists = () => {
  return executeRequest(() => Spotify.getUserPlaylists());
};

export const getPlaylistSongs = (selectedPlaylistId: string) => {
  return executeRequest(() =>
    Spotify.getPlaylistTracks(selectedPlaylistId).then((data) => {
      const items = data.items;
      return items.map((track) => track.track);
    })
  );
};

export const playPlaylist = (id: string, deviceToPlayId: string) => {
  return executeRequest(() =>
    Spotify.play({
      context_uri: `spotify:playlist:${id}`,
      device_id: deviceToPlayId,
    })
  );
};

export const getPlayerState = async () =>
  executeRequest(() => Spotify.getMyCurrentPlaybackState().then((data) => data));

export const startPlayer = async (deviceId = null) =>
  executeRequest(() => Spotify.play(deviceId !== null ? { device_id: deviceId } : undefined));

export const pausePlayer = async () => executeRequest(() => Spotify.pause());

export const skipSong = () => executeRequest(() => Spotify.skipToNext());

export const previousSong = () => executeRequest(() => Spotify.skipToPrevious());

export const getSpotifyDevices = async () => executeRequest(() => Spotify.getMyDevices());

export const getDataForCurrentArtist = async (artistId: string) => executeRequest(() => Spotify.getArtist(artistId));

export const getTrackAudioFeatures = async (trackId: string) =>
  executeRequest(() => Spotify.getAudioFeaturesForTrack(trackId));

export const searchSpotify = async (searchValue: string, limit = 50) =>
  executeRequest(() =>
    Spotify.search(searchValue, ["track"], {
      limit,
    })
  );

export const getCurrentTracksData = async (trackIds: string[]) => executeRequest(() => Spotify.getTracks(trackIds));
