import { Post, Get } from "services/shared/api/api-actions";
import { sendRequest } from "services/shared/api/api-middleware";
import apiEndpoints from "services/shared/api/api-urls";

export async function startLasershowGeneration() {
  return sendRequest(
    () => Post(`${apiEndpoints.lasershowGenerator}/start`),
    []
  ).then((value) => value.json());
}

export async function stopLasershowGeneration() {
  return sendRequest(
    () => Post(`${apiEndpoints.lasershowGenerator}/stop`),
    []
  ).then((value) => value.json());
}
