import { Delete, Get, Put, Post } from "services/shared/api/api-actions";
import { sendRequest } from "services/shared/api/api-middleware";
import apiEndpoints from "services/shared/api/api-endpoints";
import paths from "services/shared/router-paths";
import { toastSubject } from "services/shared/toast-messages";

export const addUser = async (data) => {
  return sendRequest(() => Post(apiEndpoints.user, data), [409]);
};

export const getCurrentUser = async () => {
  return sendRequest(() => Get(apiEndpoints.user), []).then((value) => value.json());
};

export const updateUser = async (user) => {
  return sendRequest(() => Put(apiEndpoints.user, user), [401], toastSubject.changesSaved);
};

export const removeUser = async () => {
  return sendRequest(() => Delete(apiEndpoints.user), [401], toastSubject.changesSaved).then(
    () => (window.location.href = paths.Login)
  );
};
