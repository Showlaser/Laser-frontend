import { toast } from "react-toastify";

export const toastSubject = {
  BoundaryError: {
    message: "Select a value between or equal to -4000 and 4000",
    id: 0,
  },
};

export const showError = (subject) => {
  const { message, id } = subject;
  toast.error(message, { toastId: id });
};

export const showSuccess = (subject) => {
  const { message, id } = subject;
  toast.success(message, { toastId: id });
};

export const showWarning = (subject) => {
  const { message, id } = subject;
  toast.warning(message, { toastId: id });
};
