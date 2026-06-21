import { RegisteredLaser } from "models/components/shared/registered-laser";
import { UDPBroadcast } from "models/components/shared/UPDBroadcast";
import { Delete, Get, Post, Put } from "services/shared/api/api-actions";
import apiEndpoints from "services/shared/api/api-endpoints";
import { sendRequest } from "services/shared/api/api-middleware";
import { showError, showSuccess, toastSubject } from "services/shared/toast-messages";

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

export const updateRegisteredLaser = async (registeredLaserToUpdate: RegisteredLaser) =>
  await sendRequest(
    () => Put(apiEndpoints.showlaser, registeredLaserToUpdate),
    [],
    toastSubject.changesSaved,
  );

export const removeShowlasers = async (toRemoveUuids: string[]) => {
  let successfulRemovals = 0;

  for (const uuid of toRemoveUuids) {
    const result = await sendRequest(() => Delete(`${apiEndpoints.showlaser}/${uuid}`), []);

    if (result?.status !== 200) {
      showError(toastSubject.apiUnavailable, `Failed to remove showlaser with uuid ${uuid}`);
    } else if (result.status === 200) {
      successfulRemovals++;
    }
  }

  if (successfulRemovals === toRemoveUuids.length) {
    showSuccess(toastSubject.changesSaved);
    return 200;
  }

  return 500;
};
