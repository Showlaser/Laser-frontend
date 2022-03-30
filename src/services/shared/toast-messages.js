import { toast } from "react-toastify";

export const toastSubject = {
  pointsBoundaryError: {
    message: "Select a value between or equal to -4000 and 4000",
    id: 0,
  },
  logsNotEmpty: {
    message: "An error or warning has occurred, check logs",
    id: 1,
  },
  developmentModeActive: {
    message:
      "Development mode active. Laser power limited to safe level without eye protection",
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
};

const calculateAutoCloseTime = (text) => {
  const autoCloseTime = text.length * 100;
  return autoCloseTime > 3000 ? autoCloseTime : 3000;
};

export const showError = (subject) => {
  const { message, id } = subject;
  const time = calculateAutoCloseTime(message);
  toast.error(message, { toastId: id, autoClose: time });
};

export const showSuccess = (subject) => {
  const { message, id } = subject;
  const time = calculateAutoCloseTime(message);
  toast.success(message, { toastId: id, autoClose: time });
};

export const showWarning = (subject) => {
  const { message, id } = subject;
  const time = calculateAutoCloseTime(message);
  toast.warning(message, { toastId: id, autoClose: time });
};

export const showInfo = (subject) => {
  const { message, id } = subject;
  const time = calculateAutoCloseTime(message);
  toast.info(message, { toastId: id, autoClose: time });
};
