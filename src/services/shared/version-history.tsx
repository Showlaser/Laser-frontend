import { State } from "models/components/shared/version-history";

const versionHistoryKey = "version-history";
const maxVersionsPerPage = 10;

const readVersionHistory = (): State[] => {
  const versionHistoryJson = localStorage.getItem(versionHistoryKey);
  if (versionHistoryJson === null) {
    return [];
  }

  return JSON.parse(versionHistoryJson) as State[];
};

export const getVersionHistory = (pageName?: string): State[] => {
  const versionHistory = readVersionHistory();
  return pageName === undefined
    ? versionHistory
    : versionHistory.filter((version) => version.fromPageName === pageName);
};

export const getStateById = (stateId: number) =>
  readVersionHistory().find((state) => state.id === stateId)?.state;

export type VersionHistoryItemOptions = {
  name?: string;
  image?: string | null;
};

export const addItemToVersionHistory = (
  pageName: string,
  state: unknown,
  options?: VersionHistoryItemOptions,
) => {
  const versionHistory = readVersionHistory();
  const otherPages = versionHistory.filter((version) => version.fromPageName !== pageName);
  const samePage = versionHistory.filter((version) => version.fromPageName === pageName);

  // Keep at most maxVersionsPerPage versions per editor by dropping the oldest.
  while (samePage.length >= maxVersionsPerPage) {
    samePage.shift();
  }

  samePage.push({
    id: 0,
    state,
    fromPageName: pageName,
    name: options?.name,
    image: options?.image,
    savedAt: Date.now(),
  });

  const merged = [...otherPages, ...samePage];
  merged.forEach((version, index) => (version.id = index));
  localStorage.setItem(versionHistoryKey, JSON.stringify(merged));
};
