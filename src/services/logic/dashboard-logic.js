import { Get } from "services/shared/api/api-actions";
import { sendRequest } from "services/shared/api/api-middleware";
import apiEndpoints from "services/shared/api/api-urls";

export async function getDashboardData() {
  return sendRequest(() => Get(apiEndpoints.dashboard), []).then((value) =>
    value.json()
  );
}
