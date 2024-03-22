import { Delete, Get, Post } from "services/shared/api/api-actions";
import { sendRequest } from "services/shared/api/api-middleware";
import apiEndpoints from "services/shared/api/api-endpoints";
import { toastSubject } from "services/shared/toast-messages";
import { Animation } from "models/components/shared/animation";

export const getAnimations = async (): Promise<Response | undefined> =>
  sendRequest(() => Get(apiEndpoints.animation), []);

export const saveAnimation = async (animation: Animation) =>
  await sendRequest(() => Post(apiEndpoints.animation, animation), [], toastSubject.changesSaved);

export const removeAnimation = async (uuid: string) =>
  sendRequest(() => Delete(`${apiEndpoints.animation}/${uuid}`), [], toastSubject.changesSaved);

export const playAnimation = async (animation: Animation) =>
  sendRequest(() => Post(apiEndpoints.animation + "/play", animation), []);

export const propertiesSettings = [
  {
    property: "scale",
    type: "float",
    defaultValue: 1,
    min: 0.1,
    max: 10,
  },
  {
    property: "xOffset",
    type: "int",
    defaultValue: 0,
    min: -200,
    max: 200,
  },
  {
    property: "yOffset",
    type: "int",
    defaultValue: 0,
    min: -200,
    max: 200,
  },
  {
    property: "rotation",
    type: "int",
    defaultValue: 0,
    min: -360,
    max: 360,
  },
];

export const getAnimationDuration = (animation: Animation | null) => {
  if (animation === null) {
    return 0;
  }

  const times = animation?.animationPatterns.map((ap) => ap.startTimeMs + ap.getDuration);
  if (times === undefined) {
    return 0;
  }

  return Math.max(...times);
};
