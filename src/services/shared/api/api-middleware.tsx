import paths from "../router-paths";
import { showError, toastSubject, showSuccess, ToastSubjectObject } from "../toast-messages";
import { Post } from "./api-actions";
import apiEndpoints from "./api-endpoints";
import Cookies from "universal-cookie";

const handleErrorMessage = (statusCode: number, ignoredStatusCodes: number[]) => {
  if (ignoredStatusCodes.includes(statusCode)) {
    return;
  }

  const statusCodes: any = {
    400: toastSubject.apiBadRequest,
    401: toastSubject.unauthorized,
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

const refreshUserTokensIfExpired = async () => {
  const cookie = new Cookies();
  const loginCookie = cookie.get("logged-in");
  const loginTime = Number(loginCookie?.loginTime);
  const currentTime = Date.now();
  const jwtExpirationTimeMs = 300000;

  const loginTimeIsNotValid = isNaN(loginTime);
  const jwtExpired = currentTime - loginTime > jwtExpirationTimeMs || loginTimeIsNotValid;
  if (jwtExpired) {
    const refreshResponse: any = await Post(apiEndpoints.refreshToken, null);
    if (refreshResponse.status !== 200) {
      return false;
    }

    cookie.set("logged-in", { loginTime: currentTime });
  }

  return true;
};

export async function sendRequest(
  requestFunction: () => Promise<Response>,
  ignoredStatusCodes: number[] = [],
  onSuccessToastSubject: ToastSubjectObject | null = null,
  redirectToLoginOnError: boolean = false
) {
  const userTokensExpired = !(await refreshUserTokensIfExpired());
  if (redirectToLoginOnError && userTokensExpired && !window.location.href.includes("login")) {
    const redirectTo = window.location.href;
    window.location.href = `${paths.Login}?redirect=${redirectTo}`;
  }

  let response;
  try {
    response = await requestFunction();
    if (onSuccessToastSubject !== null && response.status === 200) {
      showSuccess(onSuccessToastSubject);
    }
    if (response.status === 401 && redirectToLoginOnError) {
      const redirectTo = window.location.href;
      window.location.href = `${paths.Login}?redirect=${redirectTo}`;
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
