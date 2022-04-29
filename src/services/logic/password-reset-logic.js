import { Post } from "services/shared/api/api-actions";
import { sendRequest } from "services/shared/api/api-middleware";
import apiEndpoints from "services/shared/api/api-urls";
import { toastSubject } from "services/shared/toast-messages";

export const requestPasswordReset = (email) => {
  return sendRequest(
    () => Post(`${apiEndpoints.requestPasswordReset}?email=${email}`),
    []
  );
};

export const resetPassword = (code, newPassword) => {
  return sendRequest(
    () =>
      Post(
        `${apiEndpoints.resetPassword}?code=${code}&newPassword=${newPassword}`,
        null
      ),
    [404],
    toastSubject.passwordResetSuccess
  );
};
