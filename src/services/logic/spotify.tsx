import { Get } from "services/shared/api/api-actions";
import { sendRequest } from "services/shared/api/api-middleware";
import apiEndpoints from "services/shared/api/api-endpoints";
import SpotifyWebApi from "spotify-web-api-js";
import { stringIsEmpty } from "services/shared/general";
import { SpotifyTokens } from "models/components/shared/Spotify";

const Spotify = new SpotifyWebApi();

const onError = async (errorCode: any) => {
  const code = Number(errorCode);
  if (code === 401) {
    const refreshToken = localStorage.getItem("SpotifyRefreshToken");
    if (refreshToken === undefined || stringIsEmpty(refreshToken) || refreshToken === null) {
      return;
    }

    const tokens: SpotifyTokens | null = await refreshSpotifyAccessToken(refreshToken);
    if (tokens === null) {
      return;
    }

    localStorage.setItem("SpotifyAccessToken", tokens.access_token);
    localStorage.setItem("SpotifyRefreshToken", tokens.refresh_token);
    Spotify.setAccessToken(tokens.access_token);
  }
};

export const updateSpotifyToken = (accessToken: string) => Spotify.setAccessToken(accessToken);

export const grandSpotifyAccess = () => {
  return sendRequest(() => Get(apiEndpoints.grandSpotifyAccess), []);
};

export const getSpotifyAccessTokens = (code: string) =>
  sendRequest(() => Get(`${apiEndpoints.getSpotifyAccessToken}?code=${code}`), []).then((value) => value?.json());

export const refreshSpotifyAccessToken = async (refreshToken: string): Promise<SpotifyTokens | null> => {
  const response = await sendRequest(
    () => Get(`${apiEndpoints.refreshSpotifyAccessToken}?refreshToken=${refreshToken}`),
    [],
    undefined,
    false
  );

  if (response === undefined) {
    return null;
  }

  return await response.json();
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

export const getUserPlaylists = (): Promise<SpotifyApi.PagingObject<SpotifyApi.PlaylistObjectSimplified>> =>
  executeRequest(() => Spotify.getUserPlaylists());

export const getPlaylistSongs = (selectedPlaylistId: string): Promise<SpotifyApi.TrackObjectFull[]> =>
  executeRequest(() =>
    Spotify.getPlaylistTracks(selectedPlaylistId).then((data) => {
      const items = data.items;
      return items.map((track) => track.track);
    })
  );

export const playPlaylist = (id: string, deviceToPlayId: string): Promise<void> =>
  executeRequest(() =>
    Spotify.play({
      context_uri: `spotify:playlist:${id}`,
      device_id: deviceToPlayId,
    })
  );

export const getPlayerState = (): Promise<SpotifyApi.CurrentlyPlayingObject> =>
  executeRequest(() => Spotify.getMyCurrentPlaybackState().then((data) => data));

export const startPlayer = (deviceId = null): Promise<void> =>
  executeRequest(() => Spotify.play(deviceId !== null ? { device_id: deviceId } : undefined));

export const pausePlayer = (): Promise<void> => executeRequest(() => Spotify.pause());

export const skipSong = (): Promise<void> => executeRequest(() => Spotify.skipToNext());

export const previousSong = (): Promise<void> => executeRequest(() => Spotify.skipToPrevious());

export const getSpotifyDevices = async (): Promise<SpotifyApi.UserDevicesResponse> =>
  executeRequest(() => Spotify.getMyDevices());

export const getDataForCurrentArtist = (artistId: string): Promise<SpotifyApi.ArtistObjectFull> =>
  executeRequest(() => Spotify.getArtist(artistId));

export const getTrackAudioFeatures = async (trackId: string): Promise<SpotifyApi.AudioFeaturesObject> =>
  executeRequest(() => Spotify.getAudioFeaturesForTrack(trackId));

export const searchSpotify = async (searchValue: string, limit: number = 50): Promise<SpotifyApi.SearchResponse> =>
  executeRequest(() =>
    Spotify.search(searchValue, ["track"], {
      limit,
    })
  );

export const getCurrentTracksData = async (trackIds: string[]): Promise<SpotifyApi.MultipleTracksResponse> =>
  executeRequest(() => Spotify.getTracks(trackIds));
