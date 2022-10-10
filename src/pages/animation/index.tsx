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
import { getPatternPlaceHolder, Pattern } from "models/components/shared/pattern";
import { getPatterns } from "services/logic/pattern-logic";
import { getAnimations } from "services/logic/animation-logic";
import { convertPatternToAnimation } from "services/shared/converters";
import { AnimationEffectEditor } from "components/animation/animation-effect";
import AnimationKeyFrameEditor from "components/animation/animation-keyframe-editor";
import EditorSelector from "components/animation/editor-selector";

export default function AnimationPage() {
  const animation: Animation = {
    uuid: "14c87f62-39d9-4bac-a51a-477aaf37f73c",
    animationKeyFrames: [
      { uuid: "7e636af4-c32d-4da5-8f08-712c88d543b6", timeMs: 4970, propertyEdited: "scale", propertyValue: 0.2 },
      { uuid: "f38dbe41-8e97-4150-ae7c-3a57f17e36ef", timeMs: 4980, propertyEdited: "scale", propertyValue: 0.8 },
      { uuid: "4c299c26-1398-4b82-a709-74a56a9dffa3", timeMs: 4990, propertyEdited: "scale", propertyValue: 0.6 },
      { uuid: "1a672ae3-68eb-492b-8481-4649d37c885b", timeMs: 4990, propertyEdited: "xOffset", propertyValue: 0 },
      { uuid: "a0f9a978-a4ed-401a-9f10-fd5568c8e128", timeMs: 5000, propertyEdited: "xOffset", propertyValue: 20 },
      { uuid: "81ab7872-b421-470e-a95f-49c72400824f", timeMs: 4990, propertyEdited: "yOffset", propertyValue: 20 },
      { uuid: "cd356410-79df-4910-bf3f-d1d4afab8843", timeMs: 5000, propertyEdited: "yOffset", propertyValue: 50 },
      { uuid: "63121cac-ccaa-4757-a07d-7f6222048173", timeMs: 4990, propertyEdited: "rotation", propertyValue: 20 },
      { uuid: "e4ba69b6-bdd8-4a2d-8c33-601de0ca50a2", timeMs: 5000, propertyEdited: "rotation", propertyValue: 50 },
    ],
    name: "Test animation",
    image: " ",
    animationEffects: [],
    pattern: getPatternPlaceHolder(),
  };
  const [selectedAnimation, setSelectedAnimation] = useState<Animation | null>(animation);
  const [availableAnimations, setAvailableAnimations] = useState<Animation[] | null>(null);
  const [availablePatterns, setAvailablePatterns] = useState<Pattern[] | null>(null);
  const [convertPatternModalOpen, setConvertPatternModalOpen] = useState<boolean>(false);
  const [animationsModalOpen, setAnimationsModalOpen] = useState<boolean>(false);
  const [selectedEditor, setSelectedEditor] = useState<string | null>(null);

  // TODO remove default values in state

  useEffect(() => {
    if (availableAnimations === null && availablePatterns === null) {
      getPatterns().then((patterns) => setAvailablePatterns(patterns ?? []));
      getAnimations().then((response) => {
        if (response?.status === 200) {
          response.json().then((animations) => setAvailableAnimations(animations));
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

  const getSelectedEditor = () => {
    if (
      selectedEditor === null &&
      selectedAnimation?.animationKeyFrames.length === 0 &&
      selectedAnimation.animationEffects.length === 0
    ) {
      return (
        <EditorSelector setSelectedEditor={(editor) => setSelectedEditor(editor)} selectedEditor={selectedEditor} />
      );
    }
    if (selectedAnimation?.animationKeyFrames.length ?? 0 > 1) {
      return <AnimationKeyFrameEditor animation={selectedAnimation} setSelectedAnimation={setSelectedAnimation} />;
    } else if (selectedAnimation?.animationEffects.length ?? 0 > 1) {
      return <AnimationEffectEditor animation={selectedAnimation} />;
    }
    if (selectedEditor === "keyframe-editor") {
      return <AnimationKeyFrameEditor animation={selectedAnimation} setSelectedAnimation={setSelectedAnimation} />;
    } else if (selectedEditor === "effects-editor") {
      return <AnimationEffectEditor animation={selectedAnimation} />;
    }
  };

  return (
    <SideNav pageName="Animation editor">
      <>
        {selectedAnimation === null ? getSpeedDial() : getSelectedEditor()}
        {convertPatternModalOpen && (
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
        )}
      </>
    </SideNav>
  );
}
