import { Delete, Get, Post } from "services/shared/api/api-actions";
import { sendRequest } from "services/shared/api/api-middleware";
import apiEndpoints from "services/shared/api/api-endpoints";
import { toastSubject } from "services/shared/toast-messages";
import { Animation } from "models/components/shared/animation";

export const getAnimations = async (): Promise<Response | undefined> =>
  sendRequest(() => Get(apiEndpoints.animation), []);

export const saveAnimation = async (animation: Animation) =>
  (await sendRequest(() => Post(apiEndpoints.animation, animation), [], toastSubject.changesSaved))?.json();

export const removeAnimation = async (uuid: string) =>
  sendRequest(() => Delete(`${apiEndpoints.animation}/${uuid}`), [], toastSubject.changesSaved);

export const playAnimation = async (animation: Animation) =>
  sendRequest(() => Post(apiEndpoints.animation + "/play", animation), []);

export const propertiesSettings = [
  {
    property: "scale",
    type: "float",
    default: 1,
    min: 0.1,
    max: 10,
  },
  {
    property: "xOffset",
    type: "int",
    default: 0,
    min: -200,
    max: 200,
  },
  {
    property: "yOffset",
    type: "int",
    default: 0,
    min: -200,
    max: 200,
  },
  {
    property: "rotation",
    type: "int",
    default: 0,
    min: -360,
    max: 360,
  },
];
