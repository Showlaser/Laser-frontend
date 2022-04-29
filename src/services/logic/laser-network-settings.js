import { Post, Get } from "services/shared/api/api-actions";
import { sendRequest } from "services/shared/api/api-middleware";
import apiEndpoints from "services/shared/api/api-urls";

export async function getAvailableComDevices() {
  return sendRequest(() => Get(apiEndpoints.serial), []).then((value) =>
    value.json()
  );
}
