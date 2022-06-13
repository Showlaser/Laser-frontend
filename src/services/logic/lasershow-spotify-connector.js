import { Get, Post } from "services/shared/api/api-actions";
import { sendRequest } from "services/shared/api/api-middleware";
import apiEndpoints from "services/shared/api/api-endpoints";
import { toastSubject } from "services/shared/toast-messages";

export async function addLasershowToSpotifyConnector(connector) {
  return sendRequest(
    () => Post(apiEndpoints.spotifyConnector, connector),
    [],
    toastSubject.changesSaved
  );
}

export async function getAllConnectors() {
  return sendRequest(() => Get(apiEndpoints.spotifyConnector), []).then(
    (value) => value.json()
  );
}
