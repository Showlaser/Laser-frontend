import "./index.css";
import React, { useEffect, useState } from "react";
import SideNav from "components/shared/sidenav";
import SpeedDialIcon from "@mui/material/SpeedDialIcon";
import { SpeedDial, SpeedDialAction } from "@mui/material";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import SettingsIcon from "@mui/icons-material/Settings";
import AllInclusiveIcon from "@mui/icons-material/AllInclusive";
import CardOverview from "components/shared/card-overview";
import { Animation } from "models/components/shared/animation";
import { Pattern } from "models/components/shared/pattern";
import { getPatterns } from "services/logic/pattern-logic";
import { getAnimations } from "services/logic/animation-logic";
import { convertPatternToAnimation } from "services/shared/converters";
import { AnimationEffect } from "components/animation/animation-effect";

export default function AnimationPage() {
  const [selectedAnimation, setSelectedAnimation] = useState<Animation | null>(null);
  const [availableAnimations, setAvailableAnimations] = useState<Animation[] | null>(null);
  const [availablePatterns, setAvailablePatterns] = useState<Pattern[] | null>(null);
  const [convertPatternModalOpen, setConvertPatternModalOpen] = useState<boolean>(false);
  const [animationsModalOpen, setAnimationsModalOpen] = useState<boolean>(false);

  useEffect(() => {
    if (availableAnimations === null && availablePatterns === null) {
      getPatterns().then((patterns) => setAvailablePatterns(patterns ?? []));
      getAnimations().then((a) => setAvailableAnimations(a ?? []));
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

  return (
    <SideNav pageName="Animation editor">
      <div>
        {selectedAnimation === null ? getSpeedDial() : <AnimationEffect animation={selectedAnimation} />}
        {convertPatternModalOpen ? (
          <CardOverview
            closeOverview={() => setConvertPatternModalOpen(false)}
            show={convertPatternModalOpen}
            onEmptyMessageTitle="No patterns saved"
            onEmptyMessageDescription="Create a new pattern in the pattern editor"
            items={
              availablePatterns?.map((pattern) => ({
                name: pattern.name,
                image: pattern.image,
                onCardClick: () => {
                  setConvertPatternModalOpen(false);
                  let availableAnimationsToUpdate = availableAnimations;
                  const convertedAnimation = convertPatternToAnimation(pattern);
                  availableAnimations?.push(convertedAnimation);
                  setAvailableAnimations(availableAnimationsToUpdate);
                  setSelectedAnimation(convertedAnimation);
                },
              })) ?? []
            }
          />
        ) : null}
        {animationsModalOpen ? (
          <CardOverview
            closeOverview={() => setAnimationsModalOpen(false)}
            show={animationsModalOpen}
            onEmptyMessageTitle="No animations saved"
            onEmptyMessageDescription="Create a new animation"
            items={
              availableAnimations?.map((animation) => ({
                name: animation.name,
                image: animation.image,
                onCardClick: () => {
                  setAnimationsModalOpen(false);
                  setSelectedAnimation(animation);
                },
              })) ?? []
            }
          />
        ) : null}
      </div>
    </SideNav>
  );
}
