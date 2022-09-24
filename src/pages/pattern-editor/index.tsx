import "./index.css";
import React, { useEffect, useState } from "react";
import SideNav from "components/shared/sidenav";
import SpeedDialIcon from "@mui/material/SpeedDialIcon";
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Divider,
  Grid,
  IconButton,
  InputBase,
  Modal,
  Paper,
  SpeedDial,
  SpeedDialAction,
  Typography,
} from "@mui/material";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import SvgToCoordinatesConverter from "components/svg-to-coordinates-converter";
import SettingsIcon from "@mui/icons-material/Settings";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import CloseIcon from "@mui/icons-material/Close";
import { Pattern } from "models/components/shared/pattern";
import { getPatterns } from "services/logic/pattern-logic";

export default function PatternPage() {
  const [uploadedFile, setUploadedFile] = useState<any>();
  const [availablePatterns, setAvailablePatterns] = useState<Pattern[]>([]);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [patternSearchValue, setPatternSearchValue] = useState<string>("");
  const [selectedPattern, setSelectedPattern] = useState<Pattern | undefined>(undefined);

  const onOpenModalClick = async () => {
    const patterns = await getPatterns();
    setAvailablePatterns(patterns);
    setModalOpen(true);
  };

  const getSpeedDial = () => (
    <SpeedDial
      ariaLabel="SpeedDial basic example"
      sx={{ position: "absolute", bottom: 30, right: 30 }}
      icon={uploadedFile === undefined && selectedPattern === undefined ? <SpeedDialIcon /> : <SettingsIcon />}
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
        tooltipTitle="Get saved file"
        onClick={() => onOpenModalClick()}
        icon={
          <label style={{ cursor: "pointer", padding: "25px" }}>
            <CloudDownloadIcon style={{ marginTop: "8px" }} />
          </label>
        }
      ></SpeedDialAction>
    </SpeedDial>
  );

  const getPatternCards = () =>
    availablePatterns.length === 0 ? null : (
      <Box style={{ margin: "30px" }} sx={{ flexDirection: "row", flexWrap: "wrap" }}>
        {availablePatterns
          .filter((pattern) => (patternSearchValue.length > 0 ? pattern.name.includes(patternSearchValue) : true))
          .map((pattern) => (
            <Card sx={{ width: "20%", minWidth: "30vh" }}>
              <CardActionArea
                onClick={() => {
                  setModalOpen(false);
                  setSelectedPattern(pattern);
                }}
              >
                <CardMedia
                  component="img"
                  height="140"
                  alt="pattern image"
                  src="https://cms-assets.tutsplus.com/cdn-cgi/image/width=850/uploads/users/1251/posts/37005/image-upload/tutsplus_animejs_canvas_fireworks.png"
                />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    {pattern.name}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          ))}
      </Box>
    );

  return (
    <SideNav pageName="Pattern editor">
      {uploadedFile === undefined && selectedPattern === undefined ? null : (
        <SvgToCoordinatesConverter
          patternNamesInUse={availablePatterns.map((pattern) =>
            pattern.uuid !== selectedPattern?.uuid ? pattern.name : ""
          )}
          uploadedFile={uploadedFile}
          setUploadedFile={setUploadedFile}
          patternFromServer={selectedPattern}
          clearServerPattern={() => setSelectedPattern(undefined)}
        />
      )}
      <Modal
        open={modalOpen}
        onKeyDown={(e) => {
          if (e.key === "Escape") {
            setModalOpen(false);
          }
        }}
      >
        <Box style={{ textAlign: "center", marginTop: "40px" }}>
          <IconButton style={{ marginLeft: "95%", marginBottom: "0px" }} onClick={() => setModalOpen(false)}>
            <CloseIcon />
          </IconButton>
          <Typography variant="h5" style={{ marginBottom: "20px", marginTop: "10px" }}>
            Saved patterns
          </Typography>
          <Divider />
          <Grid container spacing={0} direction="column" alignItems="center" justifyContent="center">
            <Paper
              sx={{
                backgroundColor: "#2E2E2E",
                width: "30%",
                m: "8px 0 0 0",
                p: "4px 6px",
                display: "flex",
              }}
            >
              <InputBase
                sx={{ ml: 1, flex: 1 }}
                placeholder="Search pattern"
                onChange={(e) => setPatternSearchValue(e.target.value)}
              />
            </Paper>
          </Grid>
          {getPatternCards()}
        </Box>
      </Modal>
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
        {uploadedFile === undefined && selectedPattern === undefined ? getSpeedDial() : null}
      </Box>
    </SideNav>
  );
}
