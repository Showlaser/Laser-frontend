import { Post, Get } from "services/shared/api/api-actions";
import { sendRequest } from "services/shared/api/api-middleware";
import apiEndpoints from "services/shared/api/api-endpoints";
import { showSuccess, toastSubject } from "services/shared/toast-messages";

export async function getAvailableComDevices() {
  return sendRequest(() => Get(apiEndpoints.serial), []).then((value) =>
    value.json()
  );
}

export async function setSettings(ip, comPort) {
  return sendRequest(
    () => Post(`${apiEndpoints.serial}?comport=${comPort}&ip=${ip}`),
    [],
    showSuccess(toastSubject.changesSaved)
  );
}
