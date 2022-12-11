import { Post, Get } from "services/shared/api/api-actions";
import { sendRequest } from "services/shared/api/api-middleware";
import apiEndpoints from "services/shared/api/api-endpoints";

type LasershowGeneratorData = { genres: string[]; bpm: number };

export async function getAudioDevices() {
  return sendRequest(() => Get(`${apiEndpoints.lasershowGenerator}/devices`), []).then((value) => value?.json());
}

export async function getLasershowGeneratorStatus() {
  return sendRequest(() => Get(`${apiEndpoints.lasershowGenerator}/status`), []).then((value) => value?.json());
}

export async function startLasershowGeneration(data: LasershowGeneratorData, deviceName: string) {
  return sendRequest(() => Post(`${apiEndpoints.lasershowGenerator}/start?deviceName=${deviceName}`, data), []);
}

export async function stopLasershowGeneration() {
  return sendRequest(() => Post(`${apiEndpoints.lasershowGenerator}/stop`), []);
}

export const updateLasershowGeneratorSettings = (data: LasershowGeneratorData) =>
  sendRequest(() => Post(`${apiEndpoints.lasershowGenerator}/data`, data), []);
