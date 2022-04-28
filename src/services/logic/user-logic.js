import { Get, Put } from "services/shared/api/api-actions";
import { sendRequest } from "services/shared/api/api-middleware";
import apiEndpoints from "services/shared/api/api-urls";

export const getCurrentUser = async () => {
  return sendRequest(() => Get(apiEndpoints.user), []).then((value) =>
    value.json()
  );
};

export const updateUser = async (user) => {
  return sendRequest(() => Put(apiEndpoints.user, user), []).then((value) =>
    value.json()
  );
};
