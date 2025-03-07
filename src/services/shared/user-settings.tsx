export const dataSavingIsEnabled = (): boolean => localStorage.getItem("dataSavingEnabled") !== null;

export const setDataSaving = (enableDataSaving: boolean) =>
  enableDataSaving ? localStorage.setItem("dataSavingEnabled", "true") : localStorage.removeItem("dataSavingEnabled");
