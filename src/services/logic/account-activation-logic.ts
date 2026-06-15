import { Post } from "services/shared/api/api-actions";
import apiEndpoints from "services/shared/api/api-endpoints";
import { sendRequest } from "services/shared/api/api-middleware";
import { toastSubject } from "services/shared/toast-messages";

export const activateAccount = (code: string) => {
  return sendRequest(
    () => Post(`${apiEndpoints.activateAccount}`, code),
    [404],
    toastSubject.activationSuccessful,
  );
};
