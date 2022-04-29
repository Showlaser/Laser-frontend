import { Post } from "services/shared/api/api-actions";
import { sendRequest } from "services/shared/api/api-middleware";
import apiEndpoints from "services/shared/api/api-urls";
import { toastSubject } from "services/shared/toast-messages";

export const activateAccount = (code) => {
  return sendRequest(
    () => Post(`${apiEndpoints.activateAccount}?code=${code}`),
    [404],
    toastSubject.activationSuccessful
  );
};
