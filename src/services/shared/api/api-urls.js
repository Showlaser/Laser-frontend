const laserApiUrl = "http://localhost:5000/";
const authApiUrl = "http://localhost:5001/";

const apiEndpoints = {
  pattern: `${laserApiUrl}pattern`,
  animation: `${laserApiUrl}animation`,
  user: `${authApiUrl}user`,
  login: `${authApiUrl}user/login`,
  refreshToken: `${authApiUrl}user/refresh-token`,
  getSpotifyAccessToken: `${authApiUrl}spotify/get-access-token`,
  grandSpotifyAccess: `${authApiUrl}spotify/grand-access`,
  refreshSpotifyAccessToken: `${authApiUrl}spotify/refresh`,
};

export default apiEndpoints;
