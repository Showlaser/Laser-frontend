import { toast } from "react-toastify";

export const toastSubject = {
  BoundaryError: {
    message: "Select a value between or equal to -4000 and 4000",
    id: 0,
  },
  LogsNotEmpty: {
    message: "An error or warning has occurred, check logs",
    id: 1,
  },
  developmentModeActive: {
    message:
      "Development mode active. Laser power limited to safe level without eye protection",
    id: 2,
  },
};

export const showError = (subject) => {
  const { message, id } = subject;
  const time = message.length * 100;
  toast.error(message, { toastId: id, autoClose: time });
};

export const showSuccess = (subject) => {
  const { message, id } = subject;
  const time = message.length * 100;
  toast.success(message, { toastId: id, autoClose: time });
};

export const showWarning = (subject) => {
  const { message, id } = subject;
  const time = message.length * 100;
  toast.warning(message, { toastId: id, autoClose: time });
};

export const showInfo = (subject) => {
  const { message, id } = subject;
  const time = message.length * 100;
  toast.info(message, { toastId: id, autoClose: time });
};
