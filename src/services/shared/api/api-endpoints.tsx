const laserApiUrl = "http://localhost:5004/";
const authApiUrl = "http://localhost:5001/";
export const voteApiUrl = "http://localhost:5002/";
export const voteApiWebsocketUrl = "wss://localhost:5002/ws";
export const voteFrontendUrl = "http://localhost:3001/";

const apiEndpoints = {
  pattern: `${laserApiUrl}pattern`,
  lasershow: `${laserApiUrl}lasershow`,
  animation: `${laserApiUrl}animation`,
  user: `${authApiUrl}user`,
  login: `${authApiUrl}user/login`,
  logout: `${authApiUrl}user/logout`,
  refreshToken: `${authApiUrl}user/refresh-token`,
  getSpotifyAccessToken: `${authApiUrl}spotify/get-access-token`,
  grandSpotifyAccess: `${authApiUrl}spotify/grand-access`,
  refreshSpotifyAccessToken: `${authApiUrl}spotify/refresh`,
  vote: `${voteApiUrl}vote`,
  safetyZone: `${laserApiUrl}zone`,
  dashboard: `${laserApiUrl}dashboard`,
  settings: `${laserApiUrl}settings`,
  serial: `${laserApiUrl}settings/serial`,
  connectionMethod: `${laserApiUrl}settings/connection-method`,
  requestPasswordReset: `${authApiUrl}user/request-password-reset`,
  resetPassword: `${authApiUrl}user/reset-password`,
  activateAccount: `${authApiUrl}user/activate`,
  lasershowGenerator: `${laserApiUrl}lasershow-generator`,
  spotifyConnector: `${laserApiUrl}spotify-connector`,
  currentComDevice: `${laserApiUrl}settings/current-com-device`,
};

export default apiEndpoints;
