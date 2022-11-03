import paths from "../router-paths";
import { showError, toastSubject, showSuccess } from "../toast-messages";
import { Post } from "./api-actions";
import apiEndpoints from "./api-endpoints";

const handleErrorMessage = (statusCode: number, ignoredStatusCodes: number[]) => {
  if (ignoredStatusCodes.includes(statusCode)) {
    return;
  }

  const statusCodes: any = {
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
  requestFunction: () => Promise<Response>,
  ignoredStatusCodes: number[],
  onSuccessToastSubject: any = null,
  redirectToLoginOnError: boolean = true
) {
  let response;
  try {
    response = await requestFunction();
    if (onSuccessToastSubject !== undefined && onSuccessToastSubject !== null) {
      showSuccess(onSuccessToastSubject);
    }
    if (response.status === 401) {
      // tokens are set by cookies
      const refreshResponse: any = await Post(apiEndpoints.refreshToken, null);
      if (refreshResponse.status !== 200 && !window.location.href.includes("login")) {
        if (redirectToLoginOnError) {
          const redirectTo = window.location.href;
          window.location.href = `${paths.Login}?redirect=${redirectTo}`;
        }
        return;
      }

      response = await requestFunction();
    }

    if (response.status !== 200) {
      handleErrorMessage(response.status, ignoredStatusCodes);
      return response;
    }
    return response;
  } catch (error) {
    showError(toastSubject.apiUnavailable);
  }
}
