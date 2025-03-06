import AddIcon from "@mui/icons-material/Add";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import SettingsIcon from "@mui/icons-material/Settings";
import { Box, SpeedDial, SpeedDialAction } from "@mui/material";
import SpeedDialIcon from "@mui/material/SpeedDialIcon";
import PatternEditor from "components/pattern/svg-to-coordinates-converter";
import CardOverview from "components/shared/card-overview";
import { OnTrue } from "components/shared/on-true";
import PatternDeleteModal from "components/shared/pattern-delete-modal";
import SideNav from "components/shared/sidenav";
import { Animation } from "models/components/shared/animation";
import { Lasershow } from "models/components/shared/lasershow";
import {
  getPatternPlaceHolder,
  Pattern,
} from "models/components/shared/pattern";
import React, { useEffect, useState } from "react";
import { getAnimations } from "services/logic/animation-logic";
import { getLasershows } from "services/logic/lasershow-logic";
import { getPatterns } from "services/logic/pattern-logic";
import "./index.css";

export default function PatternPage() {
  const [uploadedFile, setUploadedFile] = useState<any>();
  const [availableLasershows, setAvailableLasershows] = useState<
    Lasershow[] | null
  >(null);
  const [availableAnimations, setAvailableAnimations] = useState<
    Animation[] | null
  >(null);
  const [availablePatterns, setAvailablePatterns] = useState<Pattern[] | null>(
    null
  );
  const [convertPatternModalOpen, setConvertPatternModalOpen] =
    useState<boolean>(false);
  const [selectedPattern, setSelectedPattern] = useState<Pattern | null>(null);
  const [patternToRemove, setPatternToRemove] = useState<Pattern>();

  useEffect(() => {
    if (
      availableAnimations === null &&
      availablePatterns === null &&
      availableLasershows === null
    ) {
      getPatterns().then((patterns) => {
        if (patterns !== undefined) {
          setAvailablePatterns(patterns);
        }
      });
      getAnimations().then((animations) => {
        if (animations !== undefined) {
          setAvailableAnimations(animations);
        }
      });

      getLasershows().then((lasershows) => {
        if (lasershows !== undefined) {
          setAvailableLasershows(lasershows);
        }
      });
    }
  }, []);

  const getSpeedDial = () => (
    <SpeedDial
      id="pattern-speeddial"
      ariaLabel="SpeedDial basic example"
      sx={{ position: "absolute", bottom: 30, right: 30 }}
      icon={
        uploadedFile === undefined && selectedPattern === null ? (
          <SpeedDialIcon />
        ) : (
          <SettingsIcon />
        )
      }
    >
      <SpeedDialAction
        id="pattern-new-file"
        key="sd-new-file"
        tooltipTitle="Create a new pattern"
        onClick={() => setSelectedPattern(getPatternPlaceHolder())}
        icon={
          <label style={{ cursor: "pointer", padding: "25px" }}>
            <AddIcon style={{ marginTop: "8px" }} />
          </label>
        }
      ></SpeedDialAction>
      <SpeedDialAction
        key="sd-upload"
        tooltipTitle="Upload local file"
        icon={
          <label
            htmlFor="raised-button-file"
            style={{ cursor: "pointer", padding: "25px" }}
          >
            <AttachFileIcon style={{ marginTop: "8px" }} />
          </label>
        }
      />
      <SpeedDialAction
        key="sd-saved-file"
        tooltipTitle="Get saved pattern"
        onClick={() => setConvertPatternModalOpen(true)}
        icon={
          <label style={{ cursor: "pointer", padding: "25px" }}>
            <CloudDownloadIcon style={{ marginTop: "8px" }} />
          </label>
        }
      ></SpeedDialAction>
    </SpeedDial>
  );

  const onPatternDelete = (uuid: string) => {
    const patternToRemoveIndex =
      availablePatterns?.findIndex((p) => p.uuid === uuid) ?? -1;
    if (patternToRemoveIndex !== -1) {
      let updatedPatterns = [...(availablePatterns ?? [])];
      updatedPatterns.splice(patternToRemoveIndex, 1);
      setAvailablePatterns(updatedPatterns);
    }
  };

  return (
    <SideNav pageName="Pattern editor">
      {patternToRemove !== undefined &&
      availablePatterns !== null &&
      availableAnimations !== null &&
      availableLasershows !== null ? (
        <PatternDeleteModal
          availablePatterns={availablePatterns}
          availableAnimations={availableAnimations}
          availableLasershows={availableLasershows}
          pattern={patternToRemove}
          onCancelClick={setPatternToRemove}
          onDelete={(uuid: string) => onPatternDelete(uuid)}
        />
      ) : null}
      <OnTrue onTrue={uploadedFile !== undefined || selectedPattern !== null}>
        <PatternEditor
          patternNamesInUse={
            availablePatterns?.map((pattern) =>
              pattern.uuid !== selectedPattern?.uuid ? pattern.name : ""
            ) ?? []
          }
          uploadedFile={uploadedFile}
          setUploadedFile={setUploadedFile}
          patternFromServer={selectedPattern}
          clearServerPattern={() => setSelectedPattern(null)}
        />
      </OnTrue>
      <CardOverview
        closeOverview={() => setConvertPatternModalOpen(false)}
        show={convertPatternModalOpen}
        onNoItemsMessageTitle="No patterns saved"
        onNoItemsDescription="Create a new pattern in the pattern editor"
        onDeleteClick={(uuid) =>
          setPatternToRemove(availablePatterns?.find((p) => p.uuid === uuid))
        }
        items={
          availablePatterns?.map((pattern) => ({
            uuid: pattern.uuid,
            name: pattern.name,
            image: pattern.image,
            onCardClick: () => {
              setSelectedPattern(pattern);
              setConvertPatternModalOpen(false);
            },
          })) ?? []
        }
      />
      <Box>
        <input
          hidden
          id="raised-button-file"
          type="file"
          key={uploadedFile?.name}
          accept="image/svg+xml"
          onChange={(e) => {
            if (e?.target?.files === null) {
              return;
            }

            setUploadedFile(e.target.files[0]);
          }}
        />
        {uploadedFile === undefined && selectedPattern === null
          ? getSpeedDial()
          : null}
      </Box>
    </SideNav>
  );
}
