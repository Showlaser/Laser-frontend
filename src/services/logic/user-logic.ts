import { Delete, Get, Put, Post } from "services/shared/api/api-actions";
import { sendRequest } from "services/shared/api/api-middleware";
import apiEndpoints from "services/shared/api/api-endpoints";
import paths from "services/shared/router-paths";
import { toastSubject } from "services/shared/toast-messages";

export const addUser = async (data: any) => sendRequest(() => Post(apiEndpoints.user, data), [409]);

export const getCurrentUser = async () =>
  sendRequest(() => Get(apiEndpoints.user), [], null, true).then((value: any) => value.json());

export const updateUser = async (user: any) =>
  sendRequest(() => Put(apiEndpoints.user, user), [401], toastSubject.changesSaved);

export const removeUser = async () =>
  sendRequest(() => Delete(apiEndpoints.user), [401], toastSubject.changesSaved).then(
    () => (window.location.href = paths.Login)
  );
