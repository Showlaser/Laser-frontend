export type SpotifyTokens = {
  access_token: string;
  refresh_token: string;
};

export type PlaylistVote = {
  uuid: string;
  voteDataUuid: string;
  spotifyPlaylistUuid: string;
};

export type SpotifyPlaylistSong = {
  uuid: string;
  playlistUuid: string;
  songName?: string;
  artistName?: string;
  songImageUrl?: string;
};

export type VoteablePlaylist = {
  uuid: string;
  voteDataUuid: string;
  spotifyPlaylistId: string;
  playlistName: string;
  playlistImageUrl: string;
  songsInPlaylist: SpotifyPlaylistSong[];
  votes: PlaylistVote[];
};

export type VoteData = {
  uuid: string;
  validUntil: Date;
  votablePlaylistCollection: VoteablePlaylist[];
};
