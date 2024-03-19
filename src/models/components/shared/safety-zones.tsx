import { SafetyZone } from "./safety-zone";

export interface SafetyZonesSectionProps {
  zones: SafetyZone[];
  setZones: (state: SafetyZone[]) => void;
  selectedSafetyZoneUuid: string | null;
  setSelectedSafetyZoneUuid: (state: string | null) => void;
}
