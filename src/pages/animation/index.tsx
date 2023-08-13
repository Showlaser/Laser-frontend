import "./index.css";
import React, { useEffect, useState } from "react";
import SideNav from "components/shared/sidenav";
import SpeedDialIcon from "@mui/material/SpeedDialIcon";
import { SpeedDial, SpeedDialAction } from "@mui/material";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import SettingsIcon from "@mui/icons-material/Settings";
import AllInclusiveIcon from "@mui/icons-material/AllInclusive";
import CardOverview from "components/shared/card-overview";
import { Animation, AnimationPattern } from "models/components/shared/animation";
import { getPatterns, removePattern } from "services/logic/pattern-logic";
import { getAnimations, removeAnimation } from "services/logic/animation-logic";
import { convertPatternToAnimation } from "services/shared/converters";
import AnimationKeyFrameEditor from "components/animation/animation-keyframe-editor";
import { Pattern } from "models/components/shared/pattern";
import DeleteModal, { ModalOptions } from "components/shared/delete-modal";
import { OnTrue } from "components/shared/on-true";

export type SelectedAnimationContextType = {
  selectedAnimation: Animation | null;
  setSelectedAnimation: React.Dispatch<React.SetStateAction<Animation | null>>;
};

export type AvailableAnimationsContextType = {
  availableAnimations: Animation[] | null;
  setAvailableAnimations: React.Dispatch<React.SetStateAction<Animation[] | null>>;
};

export type AvailablePatternsContextType = {
  availablePatterns: Pattern[] | null;
  setAvailablePatterns: React.Dispatch<React.SetStateAction<Pattern[] | null>>;
};

export type SelectedAnimationPatternContextType = {
  selectedAnimationPattern: AnimationPattern | null;
  setSelectedAnimationPattern: React.Dispatch<React.SetStateAction<AnimationPattern | null>>;
};

export const SelectedAnimationContext = React.createContext<SelectedAnimationContextType | null>(null);
export const AvailableAnimationsContext = React.createContext<AvailableAnimationsContextType | null>(null);
export const AvailablePatternsContext = React.createContext<AvailablePatternsContextType | null>(null);
export const SelectedAnimationPatternContext = React.createContext<SelectedAnimationPatternContextType | null>(null);

export default function AnimationPage() {
  const [selectedAnimation, setSelectedAnimation] = useState<Animation | null>(null);
  const [availableAnimations, setAvailableAnimations] = useState<Animation[] | null>(null);
  const [availablePatterns, setAvailablePatterns] = useState<Pattern[] | null>(null);
  const [convertPatternModalOpen, setConvertPatternModalOpen] = useState<boolean>(false);
  const [animationsModalOpen, setAnimationsModalOpen] = useState<boolean>(false);
  const [selectedAnimationPattern, setSelectedAnimationPattern] = useState<AnimationPattern | null>(null);
  const [modalOptions, setModalOptions] = useState<ModalOptions>({
    show: false,
    onDelete: () => null,
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

  const getWrapperContext = (reactObject: React.ReactNode) => (
    <SelectedAnimationContext.Provider value={{ selectedAnimation, setSelectedAnimation }}>
      <AvailableAnimationsContext.Provider value={{ availableAnimations, setAvailableAnimations }}>
        <AvailablePatternsContext.Provider value={{ availablePatterns, setAvailablePatterns }}>
          <SelectedAnimationPatternContext.Provider value={{ selectedAnimationPattern, setSelectedAnimationPattern }}>
            {reactObject}
          </SelectedAnimationPatternContext.Provider>
        </AvailablePatternsContext.Provider>
      </AvailableAnimationsContext.Provider>
    </SelectedAnimationContext.Provider>
  );

  const getSpeedDial = () => (
    <SpeedDial
      ariaLabel="SpeedDial basic example"
      sx={{ position: "absolute", bottom: 30, right: 30 }}
      icon={selectedAnimation === null ? <SpeedDialIcon /> : <SettingsIcon />}
    >
      <SpeedDialAction
        onClick={() => setConvertPatternModalOpen(true)}
        key="sd-pattern-to-animation"
        tooltipTitle="Convert saved pattern to animation"
        icon={
          <label htmlFor="raised-button-file" style={{ cursor: "pointer", padding: "25px" }}>
            <AllInclusiveIcon style={{ marginTop: "8px" }} />
          </label>
        }
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
      if (patternIndex === -1) {
        return;
      }

      patterns.splice(patternIndex, 1);
      setAvailablePatterns(patterns);
    }

    setModalOptions({ show: false, onDelete: () => null });
  };

  const onAnimationDelete = async (uuid: string) => {
    const result = await removeAnimation(uuid);
    if (result?.status === 200 && availableAnimations !== null) {
      let animations = [...availableAnimations];
      const animationIndex = animations.findIndex((a) => a.uuid === uuid);
      if (animationIndex === -1) {
        return;
      }

      animations.splice(animationIndex, 1);
      setAvailableAnimations(animations);
    }

    setModalOptions({ show: false, onDelete: () => null });
  };

  return (
    <SideNav pageName="Animation">
      <DeleteModal modalOptions={modalOptions} setModalOptions={setModalOptions} />
      {selectedAnimation === null ? getSpeedDial() : getWrapperContext(<AnimationKeyFrameEditor />)}
      <OnTrue onTrue={convertPatternModalOpen}>
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
      </OnTrue>
      <OnTrue onTrue={animationsModalOpen}>
        <CardOverview
          closeOverview={() => setAnimationsModalOpen(false)}
          show={animationsModalOpen}
          onNoItemsMessageTitle="No animations saved"
          onNoItemsDescription="Create a new animation first"
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
      </OnTrue>
    </SideNav>
  );
}
