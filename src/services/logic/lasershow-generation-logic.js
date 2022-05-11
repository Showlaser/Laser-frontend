import { Post, Get } from "services/shared/api/api-actions";
import { sendRequest } from "services/shared/api/api-middleware";
import apiEndpoints from "services/shared/api/api-urls";

export async function getAudioDevices() {
  return sendRequest(
    () => Get(`${apiEndpoints.lasershowGenerator}/devices`),
    []
  ).then((value) => value.json());
}

export async function getLasershowGeneratorStatus() {
  return sendRequest(
    () => Get(`${apiEndpoints.lasershowGenerator}/status`),
    []
  ).then((value) => value.json());
}

export async function startLasershowGeneration(data, deviceName) {
  return sendRequest(
    () =>
      Post(
        `${apiEndpoints.lasershowGenerator}/start?deviceName=${deviceName}`,
        data
      ),
    []
  );
}

export async function stopLasershowGeneration() {
  return sendRequest(() => Post(`${apiEndpoints.lasershowGenerator}/stop`), []);
}

export async function updateLasershowGeneratorSettings(data) {
  return sendRequest(() =>
    Post(`${apiEndpoints.lasershowGenerator}/data`, data)
  );
}
