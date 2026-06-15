import { RegisteredLaser } from "models/components/shared/registered-laser";
import { UDPBroadcast } from "models/components/shared/UPDBroadcast";
import { Get, Post } from "services/shared/api/api-actions";
import apiEndpoints from "services/shared/api/api-endpoints";
import { sendRequest } from "services/shared/api/api-middleware";
import { toastSubject } from "services/shared/toast-messages";

export const getPendingAdoptions = async (): Promise<UDPBroadcast[] | undefined> => {
  const result = await sendRequest(() => Get(apiEndpoints.adoption), []);
  if (result?.status === 200) {
    return (await result?.json()) as UDPBroadcast[];
  }

  return undefined;
};

export const adoptShowlasers = async (toAdopt: RegisteredLaser) =>
  await sendRequest(() => Post(apiEndpoints.adoption, toAdopt), [], toastSubject.changesSaved);

export const getRegisteredLasers = async (): Promise<RegisteredLaser[] | undefined> => {
  const result = await sendRequest(() => Get(apiEndpoints.showlaser), []);
  if (result?.status === 200) {
    return (await result?.json()) as RegisteredLaser[];
  }

  return undefined;
};
