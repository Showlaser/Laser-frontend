import { Post, Get, Delete } from "services/shared/api/api-actions";
import { sendRequest } from "services/shared/api/api-middleware";
import apiEndpoints from "services/shared/api/api-endpoints";
import { showSuccess, toastSubject } from "services/shared/toast-messages";

export const getZones = async () =>
  sendRequest(() => Get(apiEndpoints.zone), []).then((value) => value.json());

export const saveZone = async (zone) =>
  sendRequest(
    () => Post(apiEndpoints.zone, zone),
    [],
    showSuccess(toastSubject.changesSaved)
  );

export const deleteZone = async (uuid) =>
  sendRequest(
    () => Delete(`${apiEndpoints.zone}/${uuid}`),
    [],
    showSuccess(toastSubject.changesSaved)
  );

export const playZone = (zone) => {
  return sendRequest(() => Post(`${apiEndpoints.zone}/play`, zone), []);
};
