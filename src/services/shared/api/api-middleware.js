import { showError, toastSubject, showSuccess } from "../toast-messages";

const handleErrorMessage = (statusCode, ignoredStatusCodes) => {
  if (ignoredStatusCodes.includes(statusCode)) {
    return;
  }

  const statusCodes = {
    400: toastSubject.apiBadRequest,
    404: toastSubject.apiNotFound,
    304: toastSubject.apiNotModified,
    500: toastSubject.apiException,
  };

  const subject = statusCodes[statusCode];
  showError(subject !== undefined ? subject : toastSubject.apiUnavailable);
};

export async function sendRequest(
  requestFunction,
  ignoredStatusCodes,
  onSuccessToastSubject
) {
  const response = await requestFunction();
  if (response.status !== 200) {
    handleErrorMessage(response.status, ignoredStatusCodes);
    return response;
  }
  if (onSuccessToastSubject !== undefined) {
    showSuccess(onSuccessToastSubject);
  }
  return response;
}
