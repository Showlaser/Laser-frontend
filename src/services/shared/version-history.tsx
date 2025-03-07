import { State } from "models/components/shared/version-history";

const getVersionHistory = () => {
  const versionHistoryJson = localStorage.getItem("version-history");
  if (versionHistoryJson === null) {
    return undefined;
  }

  const versionHistory: State[] = JSON.parse(versionHistoryJson);
  return versionHistory;
};

export const getStateById: any = (stateId: number) => {
  const versionHistory = getVersionHistory();
  if (versionHistory === undefined) {
    return;
  }

  return versionHistory.find((state) => state.id === stateId)?.state;
};

export const addItemToVersionHistory = (pageName: string, state: any) => {
  let versionHistory = getVersionHistory() ?? [];
  let versionHistoryLength = versionHistory.length;
  if (versionHistoryLength === 10) {
    versionHistory.splice(0, 1);
    versionHistoryLength--;
  }

  versionHistory.forEach((version, index) => (version.id = index));
  versionHistory.push({
    id: versionHistoryLength,
    state,
    fromPageName: pageName,
  });

  localStorage.setItem("version-history", JSON.stringify(versionHistory));
};
