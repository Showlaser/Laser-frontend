import { Post } from "services/shared/api/api-actions";
import { sendRequest } from "services/shared/api/api-middleware";
import apiEndpoints from "services/shared/api/api-urls";

export const login = (data) => {
  return sendRequest(() => Post(apiEndpoints.login, data, true), []);
};

export const refreshToken = () => {
  return sendRequest(() => Post(apiEndpoints.refreshToken, null, true), []);
};
