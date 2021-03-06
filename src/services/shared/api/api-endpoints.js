const laserApiUrl = "http://localhost:5000/";
const authApiUrl = "http://localhost:5001/";
const voteApiUrl = "http://localhost:5002/";

const apiEndpoints = {
  pattern: `${laserApiUrl}pattern`,
  lasershow: `${laserApiUrl}lasershow`,
  animation: `${laserApiUrl}animation`,
  user: `${authApiUrl}user`,
  login: `${authApiUrl}user/login`,
  refreshToken: `${authApiUrl}user/refresh-token`,
  getSpotifyAccessToken: `${authApiUrl}spotify/get-access-token`,
  grandSpotifyAccess: `${authApiUrl}spotify/grand-access`,
  refreshSpotifyAccessToken: `${authApiUrl}spotify/refresh`,
  vote: `${voteApiUrl}vote`,
  zone: `${laserApiUrl}zone`,
  dashboard: `${laserApiUrl}dashboard`,
  settings: `${laserApiUrl}settings`,
  serial: `${laserApiUrl}settings/serial`,
  requestPasswordReset: `${authApiUrl}user/request-password-reset`,
  resetPassword: `${authApiUrl}user/reset-password`,
  activateAccount: `${authApiUrl}user/activate`,
  lasershowGenerator: `${laserApiUrl}lasershow-generator`,
  spotifyConnector: `${laserApiUrl}spotify-connector`,
};

export default apiEndpoints;
