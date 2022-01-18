import { Post } from "services/shared/api/api-actions";
import { sendRequest } from "services/shared/api/api-middleware";
import apiEndpoints from "services/shared/api/api-urls";

export function getAnimations() {
  return sendRequest(() => Post(apiEndpoints.animation), []);
}
