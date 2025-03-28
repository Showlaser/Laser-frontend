import { toast } from "react-toastify";

interface ToastSubject {
  [key: string]: ToastSubjectObject;
}

export type ToastSubjectObject = {
  message: string;
  id: number;
};

export const toastSubject: ToastSubject = {
  pointsBoundaryError: {
    message: "Select a value between or equal to -4000 and 4000",
    id: 0,
  },
  logsNotEmpty: {
    message: "An error or warning has occurred, check logs",
    id: 1,
  },
  developmentModeActive: {
    message: "Development mode active. Laser power limited to safe level without eye protection",
    id: 2,
  },
  apiBadRequest: {
    message: "The server could not process the send data",
    id: 3,
  },
  apiNotFound: {
    message: "The resource was not found",
    id: 4,
  },
  apiDuplication: {
    message: "An item with the same key already exists",
    id: 5,
  },
  apiException: {
    message: "An exception has occured on the API",
    id: 6,
  },
  apiNotModified: {
    message: "Data was not modified",
    id: 7,
  },
  apiUnavailable: {
    message: "Local API unavailable, start it",
    id: 8,
  },
  notImplemented: {
    message: "This is not implemented yet",
    id: 9,
  },
  changesSaved: {
    message: "Changes saved",
    id: 10,
  },
  startTimeBoundaryError: {
    message: "Value cannot be lower or higher than an other setting start time",
    id: 11,
  },
  laserPwmPowerBoundaryError: {
    message: "Select a value between or equal to 0 and 255",
    id: 12,
  },
  passwordResetSuccess: {
    message: "Password reset successful",
    id: 13,
  },
  passwordsDoNotMatch: {
    message: "Passwords do not match",
    id: 14,
  },
  invalidCode: {
    message: "The code was invalid",
    id: 15,
  },
  invalidLoginCredentials: {
    message: "Username or password is invalid",
    id: 16,
  },
  invalidPassword: {
    message: "Password is invalid",
    id: 17,
  },
  accountDisabled: {
    message: "Your account is disabled, contact the helpdesk to unblock your account",
    id: 18,
  },
  activationSuccessful: {
    message: "Activation successful",
    id: 19,
  },
  invalidFile: {
    message: "Invalid file uploaded",
    id: 21,
  },
  duplicatedName: {
    message: "An item with the same name already exists",
    id: 22,
  },
  accountCreated: {
    message: "Your account is created! Activate your account by clicking the link in the email you received.",
    id: 23,
  },
  noLongerAvailable: {
    message: "The requested item is no longer available.",
    id: 24,
  },
  unsafePattern: {
    message: "The pattern is unsafe to project and will not be projected.",
    id: 25,
  },
  unauthorized: {
    message: "Your not authorized",
    id: 26,
  },
};

const calculateAutoCloseTime = (text: string) => {
  const autoCloseTime = text.length * 100;
  return autoCloseTime > 3000 ? autoCloseTime : 3000;
};

export const showError = (subject: ToastSubjectObject, additionalMessage: string = "") => {
  const { message, id } = subject;
  const time = calculateAutoCloseTime(message);
  toast.error(`${message} ${additionalMessage}`, { toastId: id, autoClose: time });
};

export const showSuccess = (subject: ToastSubjectObject) => {
  const { message, id } = subject;
  const time = calculateAutoCloseTime(message);
  toast.success(message, { toastId: id, autoClose: time });
};

export const showWarning = (subject: ToastSubjectObject) => {
  const { message, id } = subject;
  const time = calculateAutoCloseTime(message);
  toast.warning(message, { toastId: id, autoClose: time });
};

export const showInfo = (subject: ToastSubjectObject) => {
  const { message, id } = subject;
  const time = calculateAutoCloseTime(message);
  toast.info(message, { toastId: id, autoClose: time });
};
