import { Post, Get, Delete } from "services/shared/api/api-actions";
import { sendRequest } from "services/shared/api/api-middleware";
import apiEndpoints from "services/shared/api/api-endpoints";
import { showSuccess, toastSubject } from "services/shared/toast-messages";
import { SafetyZone } from "models/components/shared/safety-zone";

export const getSafetyZones = async (): Promise<SafetyZone[]> =>
  sendRequest(() => Get(apiEndpoints.safetyZone), []).then((value) => value?.json());

export const saveSafetyZone = async (zones: SafetyZone[]) =>
  sendRequest(() => Post(apiEndpoints.safetyZone, zones), [], toastSubject.changesSaved);

export const deleteSafetyZone = async (uuid: string) =>
  sendRequest(() => Delete(`${apiEndpoints.safetyZone}/${uuid}`), [], toastSubject.changesSaved);

export const displaySafetyZone = (zone: SafetyZone) => {
  return sendRequest(() => Post(`${apiEndpoints.safetyZone}/display`, zone), []);
};
