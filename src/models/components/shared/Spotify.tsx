export type SpotifyTokens = {
  access_token: string;
  refresh_token: string;
};

export type SpotifyPlaylistSong = {
  uuid: string;
  playlistUuid: string;
  songName?: string;
  artistName?: string;
  songImageUrl?: string;
};
