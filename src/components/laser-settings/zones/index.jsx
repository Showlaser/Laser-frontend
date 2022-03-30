import React, { useEffect, useState } from "react";
import {
  convertToMilliWatts,
  mapNumber,
  valueIsWithinBoundaries,
} from "services/shared/math";
import "./index.css";
import CrudComponent from "components/shared/crud-component";
import { showError, toastSubject } from "services/shared/toast-messages";
import {
  Button,
  Divider,
  InputLabel,
  MenuItem,
  Select,
  Slider,
  TextField,
} from "@mui/material";
import { Box } from "@mui/system";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { getZones, saveZone } from "services/logic/zone-logic";

export default function Zones(props) {
  const [selectedZone, setSelectedZone] = useState(0);
  const [zones, setZones] = useState([]);
  const [selectedZoneUuid, setSelectedZoneUuid] = useState();
  const [changesSaved, setChangesSaved] = useState(false);

  const zonePlaceholder = {
    points: [
      {
        x: -4000,
        y: 4000,
      },
      {
        x: 4000,
        y: 4000,
      },
      {
        x: 4000,
        y: -4000,
      },
      {
        x: -4000,
        y: -4000,
      },
    ],
    maxPowerPwm: 3,
  };

  useEffect(() => {
    getZones().then((data) => setZones(data));
  }, []);

  return (
    <div>
      <h2>Zones</h2>
      <CrudComponent
        selectOptions={{
          selectText: "Select zone",
          onChange: setSelectedZoneUuid,
          selectedValue: selectedZoneUuid,
        }}
        itemsArray={zones}
        actions={{
          onSave: () => {
            setChangesSaved(true);
            saveZone(zones.find((zone) => zone.uuid === selectedZoneUuid));
          },
          onAdd: () => {
            setChangesSaved(false);
          },
        }}
      />
    </div>
  );
}
