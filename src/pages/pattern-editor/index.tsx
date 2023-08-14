import "./index.css";
import React, { useEffect, useState } from "react";
import SideNav from "components/shared/sidenav";
import SpeedDialIcon from "@mui/material/SpeedDialIcon";
import { Box, SpeedDial, SpeedDialAction } from "@mui/material";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import PatternEditor from "components/pattern/svg-to-coordinates-converter";
import SettingsIcon from "@mui/icons-material/Settings";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import {
  getPatternPlaceHolder,
  Pattern,
} from "models/components/shared/pattern";
import { getPatterns, removePattern } from "services/logic/pattern-logic";
import CardOverview from "components/shared/card-overview";
import AddIcon from "@mui/icons-material/Add";
import { OnTrue } from "components/shared/on-true";
import DeleteModal from "components/shared/delete-modal";

export default function PatternPage() {
  const [uploadedFile, setUploadedFile] = useState<any>();
  const [availablePatterns, setAvailablePatterns] = useState<Pattern[] | null>(
    null
  );
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [selectedPattern, setSelectedPattern] = useState<Pattern | null>(null);
  const [modalOptions, setModalOptions] = useState<any>({
    show: false,
    onDelete: null,
  });

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
      icon={
        uploadedFile === undefined && selectedPattern === null ? (
          <SpeedDialIcon />
        ) : (
          <SettingsIcon />
        )
      }
    >
      <SpeedDialAction
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
        onClick={() => onOpenModalClick()}
        icon={
          <label style={{ cursor: "pointer", padding: "25px" }}>
            <CloudDownloadIcon style={{ marginTop: "8px" }} />
          </label>
        }
      ></SpeedDialAction>
    </SpeedDial>
  );

  const onDelete = async (uuid: string) => {
    const result = await removePattern(uuid);
    if (result?.status === 200 && availablePatterns !== null) {
      let patterns = [...availablePatterns];
      const patternIndex = patterns.findIndex((p) => p.uuid === uuid);
      patterns.splice(patternIndex, 1);
      setAvailablePatterns(patterns);
    }
  };

  return (
    <SideNav pageName="Pattern editor">
      <DeleteModal
        modalOptions={modalOptions}
        setModalOptions={setModalOptions}
      />
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
        closeOverview={() => setModalOpen(false)}
        show={modalOpen}
        onDeleteClick={(uuid) =>
          setModalOptions({ show: true, onDelete: () => onDelete(uuid ?? "") })
        }
        items={
          availablePatterns?.map((pattern) => ({
            uuid: pattern.uuid,
            name: pattern.name,
            image: pattern.image,
            onCardClick: () => {
              setModalOpen(false);
              setSelectedPattern(pattern);
            },
          })) ?? []
        }
        onNoItemsMessageTitle="No saved patterns"
        onNoItemsDescription="Create a new pattern first"
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
