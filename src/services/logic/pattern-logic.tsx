import { Get, Post, Delete } from "services/shared/api/api-actions";
import { sendRequest } from "services/shared/api/api-middleware";
import apiEndpoints from "services/shared/api/api-endpoints";
import { toastSubject } from "services/shared/toast-messages";
import { Pattern } from "models/components/shared/pattern";

export const getPatterns = async (): Promise<Pattern[]> => {
  const value = await sendRequest(() => Get(apiEndpoints.pattern), [200]);
  return value?.json();
};

export const savePattern = (pattern: Pattern) => {
  return sendRequest(() => Post(apiEndpoints.pattern, pattern), [], toastSubject.changesSaved);
};

export const removePattern = (uuid: string) => {
  return sendRequest(() => Delete(`${apiEndpoints.pattern}/${uuid}`), [], toastSubject.changesSaved);
};

export const playPattern = (pattern: Pattern) => {
  return sendRequest(() => Post(apiEndpoints.pattern + "/play", pattern), []);
};
