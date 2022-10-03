import "./index.css";
import React, { useEffect, useState } from "react";
import SideNav from "components/shared/sidenav";
import SpeedDialIcon from "@mui/material/SpeedDialIcon";
import { Box, SpeedDial, SpeedDialAction } from "@mui/material";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import SvgToCoordinatesConverter from "components/pattern/svg-to-coordinates-converter";
import SettingsIcon from "@mui/icons-material/Settings";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import { Pattern } from "models/components/shared/pattern";
import { getPatterns } from "services/logic/pattern-logic";
import CardOverview from "components/shared/card-overview";

export default function PatternPage() {
  const [uploadedFile, setUploadedFile] = useState<any>();
  const [availablePatterns, setAvailablePatterns] = useState<Pattern[] | null>(null);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [selectedPattern, setSelectedPattern] = useState<Pattern | null>(null);

  useEffect(() => {
    if (availablePatterns === undefined) {
      getPatterns().then((patterns) => setAvailablePatterns(patterns));
    }
  }, [availablePatterns]);

  const onOpenModalClick = async () => {
    const patterns = await getPatterns();
    if (patterns === undefined) {
      return;
    }

    setAvailablePatterns(patterns);
    setModalOpen(true);
  };

  const getSpeedDial = () => (
    <SpeedDial
      ariaLabel="SpeedDial basic example"
      sx={{ position: "absolute", bottom: 30, right: 30 }}
      icon={uploadedFile === undefined && selectedPattern === null ? <SpeedDialIcon /> : <SettingsIcon />}
    >
      <SpeedDialAction
        key="sd-upload"
        tooltipTitle="Upload local file"
        icon={
          <label htmlFor="raised-button-file" style={{ cursor: "pointer", padding: "25px" }}>
            <AttachFileIcon style={{ marginTop: "8px" }} />
          </label>
        }
      />
      <SpeedDialAction
        key="sd-saved-file"
        tooltipTitle="Get saved pattern"
        onClick={() => onOpenModalClick()}
        icon={
          <label style={{ cursor: "pointer", padding: "25px" }}>
            <CloudDownloadIcon style={{ marginTop: "8px" }} />
          </label>
        }
      ></SpeedDialAction>
    </SpeedDial>
  );

  return (
    <>
      {uploadedFile === undefined && selectedPattern === null ? null : (
        <SvgToCoordinatesConverter
          patternNamesInUse={
            availablePatterns?.map((pattern) => (pattern.uuid !== selectedPattern?.uuid ? pattern.name : "")) ?? []
          }
          uploadedFile={uploadedFile}
          setUploadedFile={setUploadedFile}
          patternFromServer={selectedPattern}
          clearServerPattern={() => setSelectedPattern(null)}
        />
      )}
      <CardOverview
        closeOverview={() => setModalOpen(false)}
        show={modalOpen}
        items={
          availablePatterns?.map((pattern) => ({
            name: pattern.name,
            image: pattern.image,
            onCardClick: () => {
              setModalOpen(false);
              setSelectedPattern(pattern);
            },
          })) ?? []
        }
        onEmptyMessageTitle="No saved patterns"
        onEmptyMessageDescription="Create a new pattern"
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
        {uploadedFile === undefined && selectedPattern === null ? getSpeedDial() : null}
      </Box>
    </>
  );
}
