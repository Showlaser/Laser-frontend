import { Get } from "services/shared/api/api-actions";
import { sendRequest } from "services/shared/api/api-middleware";
import apiEndpoints from "services/shared/api/api-urls";

export const getCodeFromResponse = () => {
  const urlData = window.location.search;
  const indexOfData = urlData.indexOf("=");
  return urlData.substring(indexOfData + 1, urlData.length);
};

export const grandSpotifyAccess = () => {
  return sendRequest(() => Get(apiEndpoints.grandSpotifyAccess), []);
};

export const getSpotifyAccessTokens = (code) => {
  return sendRequest(
    () => Get(`${apiEndpoints.getSpotifyAccessToken}?code=${code}`),
    []
  );
};

export const refreshSpotifyAccessToken = (refreshToken) => {
  return sendRequest(
    () =>
      Get(
        `${apiEndpoints.refreshSpotifyAccessToken}?refreshToken=${refreshToken}`
      ),
    []
  );
};
