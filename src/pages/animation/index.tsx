import "./index.css";
import React, { useEffect, useState } from "react";
import SideNav from "components/shared/sidenav";
import SpeedDialIcon from "@mui/material/SpeedDialIcon";
import { Button, Divider, Grid, Modal, Paper, SpeedDial, SpeedDialAction } from "@mui/material";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import SettingsIcon from "@mui/icons-material/Settings";
import AllInclusiveIcon from "@mui/icons-material/AllInclusive";
import CardOverview from "components/shared/card-overview";
import { Animation } from "models/components/shared/animation";
import { getPatterns, removePattern } from "services/logic/pattern-logic";
import { getAnimations, removeAnimation } from "services/logic/animation-logic";
import { convertPatternToAnimation } from "services/shared/converters";
import AnimationKeyFrameEditor from "components/animation/animation-keyframe-editor";
import { Pattern } from "models/components/shared/pattern";
import DeleteModal from "components/shared/delete-modal";

export default function AnimationPage() {
  const [selectedAnimation, setSelectedAnimation] = useState<Animation | null>(null);
  const [availableAnimations, setAvailableAnimations] = useState<Animation[] | null>(null);
  const [availablePatterns, setAvailablePatterns] = useState<Pattern[] | null>(null);
  const [convertPatternModalOpen, setConvertPatternModalOpen] = useState<boolean>(false);
  const [animationsModalOpen, setAnimationsModalOpen] = useState<boolean>(false);
  const [modalOptions, setModalOptions] = useState<any>({
    show: false,
    onDelete: null,
  });

  useEffect(() => {
    if (availableAnimations === null && availablePatterns === null) {
      getPatterns().then((patterns) => setAvailablePatterns(patterns ?? []));
      getAnimations().then((response) => {
        if (response?.status === 200) {
          response.json().then((animations: Animation[]) => setAvailableAnimations(animations));
        }
      });
    }
  }, []);

  const getSpeedDial = () => (
    <SpeedDial
      ariaLabel="SpeedDial basic example"
      sx={{ position: "absolute", bottom: 30, right: 30 }}
      icon={selectedAnimation === null ? <SpeedDialIcon /> : <SettingsIcon />}
    >
      <SpeedDialAction
        onClick={() => setConvertPatternModalOpen(true)}
        key="sd-pattern-to-animation"
        icon={
          <label htmlFor="raised-button-file" style={{ cursor: "pointer", padding: "25px" }}>
            <AllInclusiveIcon style={{ marginTop: "8px" }} />
          </label>
        }
        tooltipTitle="Convert saved pattern to animation"
      />
      <SpeedDialAction
        onClick={() => setAnimationsModalOpen(true)}
        key="sd-animation-from-pc"
        icon={
          <label htmlFor="raised-button-file" style={{ cursor: "pointer", padding: "25px" }}>
            <CloudDownloadIcon style={{ marginTop: "8px" }} />
          </label>
        }
        tooltipTitle="Get saved animation"
      />
    </SpeedDial>
  );

  const onPatternDelete = async (uuid: string) => {
    const result = await removePattern(uuid);
    if (result?.status === 200 && availablePatterns !== null) {
      let patterns = [...availablePatterns];
      const patternIndex = patterns.findIndex((p) => p.uuid === uuid);
      patterns.splice(patternIndex, 1);
      setAvailablePatterns(patterns);
    }

    setModalOptions({ show: false, onDelete: null });
  };

  const onAnimationDelete = async (uuid: string) => {
    const result = await removeAnimation(uuid);
    if (result?.status === 200 && availableAnimations !== null) {
      let animations = [...availableAnimations];
      const animationIndex = animations.findIndex((a) => a.uuid === uuid);
      animations.splice(animationIndex, 1);
      setAvailableAnimations(animations);
    }

    setModalOptions({ show: false, onDelete: null });
  };

  return (
    <SideNav pageName="Animation editor">
      <DeleteModal modalOptions={modalOptions} setModalOptions={setModalOptions} />
      {selectedAnimation === null ? (
        getSpeedDial()
      ) : (
        <AnimationKeyFrameEditor animation={selectedAnimation} setSelectedAnimation={setSelectedAnimation} />
      )}
      {convertPatternModalOpen && (
        <CardOverview
          closeOverview={() => setConvertPatternModalOpen(false)}
          show={convertPatternModalOpen}
          onNoItemsMessageTitle="No patterns saved"
          onNoItemsDescription="Create a new pattern in the pattern editor"
          onDeleteClick={(uuid) => setModalOptions({ show: true, onDelete: () => onPatternDelete(uuid) })}
          items={
            availablePatterns?.map((pattern) => ({
              uuid: pattern.uuid,
              name: pattern.name,
              image: pattern.image,
              onCardClick: () => {
                setConvertPatternModalOpen(false);
                let availableAnimationsToUpdate = availableAnimations ?? [];
                const convertedAnimation = convertPatternToAnimation(pattern);

                availableAnimations?.push(convertedAnimation);
                setAvailableAnimations(availableAnimationsToUpdate);
                setSelectedAnimation(convertedAnimation);
              },
            })) ?? []
          }
        />
      )}
      {animationsModalOpen && (
        <CardOverview
          closeOverview={() => setAnimationsModalOpen(false)}
          show={animationsModalOpen}
          onNoItemsMessageTitle="No animations saved"
          onNoItemsDescription="Create a new animation"
          onDeleteClick={(uuid) => setModalOptions({ show: true, onDelete: () => onAnimationDelete(uuid) })}
          items={
            availableAnimations?.map((animation) => ({
              uuid: animation.uuid,
              name: animation.name,
              image: animation.image,
              onCardClick: () => {
                setAnimationsModalOpen(false);
                setSelectedAnimation(animation);
              },
            })) ?? []
          }
        />
      )}
    </SideNav>
  );
}
