import AllInclusiveIcon from "@mui/icons-material/AllInclusive";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import SettingsIcon from "@mui/icons-material/Settings";
import { SpeedDial, SpeedDialAction } from "@mui/material";
import SpeedDialIcon from "@mui/material/SpeedDialIcon";
import AnimationKeyFrameEditor from "components/animation/animation-keyframe-editor";
import AnimationDeleteModal from "components/shared/animation-delete-modal";
import CardOverview from "components/shared/card-overview";
import { OnTrue } from "components/shared/on-true";
import PatternDeleteModal from "components/shared/pattern-delete-modal";
import SideNav from "components/shared/sidenav";
import { Animation, AnimationPattern } from "models/components/shared/animation";
import { Lasershow } from "models/components/shared/lasershow";
import { Pattern } from "models/components/shared/pattern";
import React, { useEffect, useState } from "react";
import { getAnimations } from "services/logic/animation-logic";
import { getLasershows } from "services/logic/lasershow-logic";
import { getPatterns } from "services/logic/pattern-logic";
import { convertPatternToAnimation } from "services/shared/converters";
import "./index.css";

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

export const SelectedAnimationContext = React.createContext<SelectedAnimationContextType | null>(
  null
);
export const AvailableAnimationsContext =
  React.createContext<AvailableAnimationsContextType | null>(null);
export const AvailablePatternsContext = React.createContext<AvailablePatternsContextType | null>(
  null
);
export const SelectedAnimationPatternContext =
  React.createContext<SelectedAnimationPatternContextType | null>(null);
export const SelectedAnimationPatternIndexContext = React.createContext<number>(0);

export default function AnimationPage() {
  const [selectedAnimation, setSelectedAnimation] = useState<Animation | null>(null);
  const [availableLasershows, setAvailableLasershows] = useState<Lasershow[] | null>(null);
  const [availableAnimations, setAvailableAnimations] = useState<Animation[] | null>(null);
  const [availablePatterns, setAvailablePatterns] = useState<Pattern[] | null>(null);
  const [convertPatternModalOpen, setConvertPatternModalOpen] = useState<boolean>(false);
  const [animationsModalOpen, setAnimationsModalOpen] = useState<boolean>(false);
  const [selectedAnimationPattern, setSelectedAnimationPattern] = useState<AnimationPattern | null>(
    null
  );
  const [patternToRemove, setPatternToRemove] = useState<Pattern>();
  const [animationToRemove, setAnimationToRemove] = useState<Animation>();

  const selectedAnimationMemo = React.useMemo(
    () => ({ selectedAnimation, setSelectedAnimation }),
    [selectedAnimation]
  );

  const availableAnimationsMemo = React.useMemo(
    () => ({ availableAnimations, setAvailableAnimations }),
    [availableAnimations]
  );

  const availablePatternsMemo = React.useMemo(
    () => ({ availablePatterns, setAvailablePatterns }),
    [availablePatterns]
  );

  const selectedAnimationPatternMemo = React.useMemo(
    () => ({ selectedAnimationPattern, setSelectedAnimationPattern }),
    [selectedAnimationPattern]
  );

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
  }, [availableAnimations, availableLasershows, availablePatterns]);

  const getWrapperContext = (reactObject: React.ReactNode) => (
    <SelectedAnimationContext.Provider value={selectedAnimationMemo}>
      <AvailableAnimationsContext.Provider value={availableAnimationsMemo}>
        <AvailablePatternsContext.Provider value={availablePatternsMemo}>
          <SelectedAnimationPatternContext.Provider value={selectedAnimationPatternMemo}>
            <SelectedAnimationPatternIndexContext.Provider
              value={
                selectedAnimation?.animationPatterns.findIndex(
                  (ap) => ap.uuid === selectedAnimationPattern?.uuid
                ) ?? 0
              }
            >
              {reactObject}
            </SelectedAnimationPatternIndexContext.Provider>
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

  const onAnimationDelete = (uuid: string) => {
    const animationToRemoveIndex = availableAnimations?.findIndex((aa) => aa.uuid === uuid) ?? -1;
    if (animationToRemoveIndex !== -1) {
      let updatedAnimations = [...(availableAnimations ?? [])];
      updatedAnimations.splice(animationToRemoveIndex, 1);
      setAvailableAnimations(updatedAnimations);
    }
  };

  const onPatternDelete = (uuid: string) => {
    const patternToRemoveIndex = availablePatterns?.findIndex((p) => p.uuid === uuid) ?? -1;
    if (patternToRemoveIndex !== -1) {
      let updatedPatterns = [...(availablePatterns ?? [])];
      updatedPatterns.splice(patternToRemoveIndex, 1);
      setAvailablePatterns(updatedPatterns);
    }
  };

  return (
    <SideNav pageName="Animation">
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
      {animationToRemove !== undefined && availableLasershows !== null ? (
        <AnimationDeleteModal
          availableLasershows={availableLasershows}
          animation={animationToRemove}
          onCancelClick={setAnimationToRemove}
          onDelete={(uuid: string) => onAnimationDelete(uuid)}
        />
      ) : null}
      {selectedAnimation === null ? getSpeedDial() : getWrapperContext(<AnimationKeyFrameEditor />)}
      <OnTrue onTrue={convertPatternModalOpen}>
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
                setConvertPatternModalOpen(false);
                let availableAnimationsToUpdate = availableAnimations ?? [];
                const convertedAnimation = convertPatternToAnimation(pattern);
                setSelectedAnimationPattern(convertedAnimation.animationPatterns[0]);
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
          onDeleteClick={(uuid) =>
            setAnimationToRemove(availableAnimations?.find((a) => a.uuid === uuid))
          }
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
