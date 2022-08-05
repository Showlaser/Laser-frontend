export type Point = {
  uuid: string;
  colorRgb: string;
  connectedToPointUuid: string | null;
  orderNr: number;
  x: number;
  y: number;
};
