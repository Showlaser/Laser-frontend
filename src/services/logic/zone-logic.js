import { Post, Get } from "services/shared/api/api-actions";
import { sendRequest } from "services/shared/api/api-middleware";
import apiEndpoints from "services/shared/api/api-urls";

export const getZones = async () =>
  sendRequest(() => Get(apiEndpoints.zone), []).then((value) => value.json());

export const saveZone = async (zone) =>
  sendRequest(() => Post(apiEndpoints.zone, zone), []);
