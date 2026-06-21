import { SpotifyTokens } from "models/components/shared/Spotify";
import { Get, Post } from "services/shared/api/api-actions";
import apiEndpoints from "services/shared/api/api-endpoints";
import { sendRequest } from "services/shared/api/api-middleware";
import { stringIsEmpty } from "services/shared/general";
import SpotifyWebApi from "spotify-web-api-js";

const Spotify = new SpotifyWebApi();

const discardSpotifyTokens = () => {
  localStorage.removeItem("SpotifyAccessToken");
  localStorage.removeItem("SpotifyRefreshToken");
  Spotify.setAccessToken("");
};

const onError = async (errorCode: unknown) => {
  const code = Number(errorCode);
  if (code === 401) {
    const refreshToken = localStorage.getItem("SpotifyRefreshToken");
    if (refreshToken === undefined || stringIsEmpty(refreshToken) || refreshToken === null) {
      return;
    }

    const tokens: SpotifyTokens | null = await refreshSpotifyAccessToken(refreshToken);
    if (tokens === null) {
      // Refresh token verlopen of ongeldig (invalid_grant): tokens zijn al
      // weggegooid in refreshSpotifyAccessToken. Niet opnieuw proberen; de
      // gebruiker moet via de Spotify-login opnieuw inloggen.
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
  sendRequest(() => Post(`${apiEndpoints.getSpotifyAccessToken}`, { code }), []).then((value) =>
    value?.json(),
  );

export const refreshSpotifyAccessToken = async (
  refreshToken: string,
): Promise<SpotifyTokens | null> => {
  const response = await sendRequest(
    () => Post(`${apiEndpoints.refreshSpotifyAccessToken}`, { refreshToken: refreshToken }),
    [401, 503],
    undefined,
    false,
  );

  if (response === undefined) {
    return null;
  }

  // Een 401 betekent dat de refresh token verlopen/ongeldig is (invalid_grant).
  // Gooi de opgeslagen tokens weg zodat we de mislukte refresh niet opnieuw
  // proberen en de UI weer als uitgelogd toont.
  if (response.status === 401) {
    discardSpotifyTokens();
    return null;
  }

  // Andere fouten (bv. 503: Spotify tijdelijk niet bereikbaar) zijn mogelijk
  // van voorbijgaande aard. Laat de token staan zodat een latere poging kan
  // slagen.
  if (response.status !== 200) {
    return null;
  }

  return await response.json();
};

const executeRequest = async <T,>(request: () => Promise<T>): Promise<T> => {
  const accessToken = localStorage.getItem("SpotifyAccessToken");
  if (accessToken === null || accessToken === "undefined") {
    return undefined as T;
  }

  Spotify.setAccessToken(accessToken);
  return request().catch(async (error: { status?: number }) => {
    await onError(error.status);
    // Resolve to undefined on a persistent failure instead of rejecting, so a
    // transient Spotify error (e.g. no active device, which returns a non-JSON
    // body) cannot surface as an uncaught promise rejection in callers.
    return request().catch(() => undefined as T);
  });
};

export const getUserPlaylists = (): Promise<
  SpotifyApi.PagingObject<SpotifyApi.PlaylistObjectSimplified>
> => executeRequest(() => Spotify.getUserPlaylists());

export const getPlaylistSongs = (
  selectedPlaylistId: string,
): Promise<SpotifyApi.TrackObjectFull[]> =>
  executeRequest(() =>
    Spotify.getPlaylistTracks(selectedPlaylistId).then((data) => {
      const items = data.items;
      return items.map((track) => track.track) as SpotifyApi.TrackObjectFull[];
    }),
  );

export const playPlaylist = (id: string, deviceToPlayId: string): Promise<void> =>
  executeRequest(() =>
    Spotify.play({
      context_uri: `spotify:playlist:${id}`,
      device_id: deviceToPlayId,
    }),
  );

export const getPlayerState = (): Promise<SpotifyApi.CurrentPlaybackResponse> =>
  executeRequest(() => Spotify.getMyCurrentPlaybackState().then((data) => data));

export const seekToPosition = (positionMs: number): Promise<void> =>
  executeRequest(() => Spotify.seek(positionMs));

export const setPlayerVolume = (volumePercent: number): Promise<void> =>
  executeRequest(() => Spotify.setVolume(volumePercent));

export const setShuffle = (state: boolean): Promise<void> =>
  executeRequest(() => Spotify.setShuffle(state));

export const setRepeat = (state: "track" | "context" | "off"): Promise<void> =>
  executeRequest(() => Spotify.setRepeat(state));

export const saveSong = (trackId: string): Promise<SpotifyApi.SaveTracksForUserResponse> =>
  executeRequest(() => Spotify.addToMySavedTracks([trackId]));

export const removeSavedSong = (
  trackId: string,
): Promise<SpotifyApi.RemoveUsersSavedTracksResponse> =>
  executeRequest(() => Spotify.removeFromMySavedTracks([trackId]));

export const songsAreSaved = (trackIds: string[]): Promise<boolean[]> =>
  executeRequest(() => Spotify.containsMySavedTracks(trackIds));

export const startPlayer = (deviceId = null): Promise<void> =>
  executeRequest(() => Spotify.play(deviceId !== null ? { device_id: deviceId } : undefined));

export const pausePlayer = (): Promise<void> => executeRequest(() => Spotify.pause());

export const skipSong = (): Promise<void> => executeRequest(() => Spotify.skipToNext());

export const previousSong = (): Promise<void> => executeRequest(() => Spotify.skipToPrevious());

export const getSpotifyDevices = async (): Promise<SpotifyApi.UserDevicesResponse> =>
  executeRequest(() => Spotify.getMyDevices());

export const getDataForCurrentArtist = (artistId: string): Promise<SpotifyApi.ArtistObjectFull> =>
  executeRequest(() => Spotify.getArtist(artistId));

export const searchSpotify = async (
  searchValue: string,
  limit: number = 50,
): Promise<SpotifyApi.SearchResponse> =>
  executeRequest(() =>
    Spotify.search(searchValue, ["track"], {
      limit,
    }),
  );

export const getCurrentTracksData = async (
  trackIds: string[],
): Promise<SpotifyApi.MultipleTracksResponse> => executeRequest(() => Spotify.getTracks(trackIds));
