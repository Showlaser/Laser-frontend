import paths from "../router-paths";
import { showError, toastSubject, showSuccess } from "../toast-messages";
import { Post } from "./api-actions";
import apiEndpoints from "./api-endpoints";

const handleErrorMessage = (statusCode, ignoredStatusCodes) => {
  if (ignoredStatusCodes.includes(statusCode)) {
    return;
  }

  const statusCodes = {
    400: toastSubject.apiBadRequest,
    404: toastSubject.apiNotFound,
    406: toastSubject.unsafePattern,
    409: toastSubject.apiDuplication,
    410: toastSubject.noLongerAvailable,
    304: toastSubject.apiNotModified,
    500: toastSubject.apiException,
  };

  const subject = statusCodes[statusCode];
  showError(subject !== undefined ? subject : toastSubject.apiUnavailable);
};

export async function sendRequest(
  requestFunction,
  ignoredStatusCodes,
  onSuccessToastSubject,
  redirectToLoginOnError = true
) {
  let response = await requestFunction();
  if (response.status === 401) {
    const refreshResponse = await Post(apiEndpoints.refreshToken, null, true);
    if (
      refreshResponse.status !== 200 &&
      !window.location.href.includes("login")
    ) {
      if (redirectToLoginOnError) {
        window.location = paths.Login;
      }
      return;
    }

    response = await requestFunction();
  }

  if (response.status !== 200) {
    handleErrorMessage(response.status, ignoredStatusCodes);
    return response;
  }
  if (onSuccessToastSubject !== undefined) {
    showSuccess(onSuccessToastSubject);
  }
  return response;
}
