import { Post } from "services/shared/api/api-actions";
import apiEndpoints from "services/shared/api/api-endpoints";
import { sendRequest } from "services/shared/api/api-middleware";
import { toastSubject } from "services/shared/toast-messages";

export const requestPasswordReset = (email: string) => {
  return sendRequest(() => Post(`${apiEndpoints.requestPasswordReset}`, { email }), []);
};

export const resetPassword = (code: string, newPassword: string) => {
  return sendRequest(
    () => Post(`${apiEndpoints.resetPassword}`, { code, newPassword }),
    [404],
    toastSubject.passwordResetSuccess,
  );
};
