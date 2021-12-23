import { showError, toastSubject } from "../toast-messages";

const handleErrorMessages = (statusCode, ignoredStatusCodes) => {
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
  showError(subject !== undefined ? subject : toastSubject.notImplemented);
};

export async function sendRequest(requestFunction, ignoredStatusCodes) {
  const response = await requestFunction();
  handleErrorMessages(response.status, ignoredStatusCodes);
  return response;
}
