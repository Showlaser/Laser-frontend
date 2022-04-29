import { Delete, Get, Put } from "services/shared/api/api-actions";
import { sendRequest } from "services/shared/api/api-middleware";
import apiEndpoints from "services/shared/api/api-urls";
import paths from "services/shared/router-paths";
import { toastSubject } from "services/shared/toast-messages";

export const getCurrentUser = async () => {
  return sendRequest(() => Get(apiEndpoints.user), []).then((value) =>
    value.json()
  );
};

export const updateUser = async (user) => {
  return sendRequest(
    () => Put(apiEndpoints.user, user),
    [401],
    toastSubject.changesSaved
  ).then((value) => value.json());
};

export const removeUser = async () => {
  return sendRequest(
    () => Delete(apiEndpoints.user),
    [401],
    toastSubject.changesSaved
  ).then(() => (window.location = paths.Login));
};
