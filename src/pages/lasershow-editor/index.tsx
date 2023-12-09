import React, { useEffect, useState } from "react";
import SideNav from "components/shared/sidenav";
import SpeedDialIcon from "@mui/material/SpeedDialIcon";
import { SpeedDial, SpeedDialAction } from "@mui/material";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import SettingsIcon from "@mui/icons-material/Settings";
import AllInclusiveIcon from "@mui/icons-material/AllInclusive";
import CardOverview from "components/shared/card-overview";
import { Animation, AnimationPattern } from "models/components/shared/animation";
import { getAnimations, removeAnimation } from "services/logic/animation-logic";
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
export const SelectedAnimationPatternIndexContext = React.createContext<number>(0);

export default function LasershowEditor() {
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

  const selectedAnimationMemo = React.useMemo(() => ({ selectedAnimation, setSelectedAnimation }), [selectedAnimation]);

  const availableAnimationsMemo = React.useMemo(
    () => ({ availableAnimations, setAvailableAnimations }),
    [availableAnimations]
  );

  const availablePatternsMemo = React.useMemo(() => ({ availablePatterns, setAvailablePatterns }), [availablePatterns]);

  const selectedAnimationPatternMemo = React.useMemo(
    () => ({ selectedAnimationPattern, setSelectedAnimationPattern }),
    [selectedAnimationPattern]
  );

  useEffect(() => {
    if (availableAnimations === null && availablePatterns === null) {
      getAnimations().then((response) => {
        if (response?.status === 200) {
          response.json().then((animations: Animation[]) => setAvailableAnimations(animations));
        }
      });
    }
  }, [selectedAnimation]);

  const getWrapperContext = (reactObject: React.ReactNode) => (
    <SelectedAnimationContext.Provider value={selectedAnimationMemo}>
      <AvailableAnimationsContext.Provider value={availableAnimationsMemo}>
        <AvailablePatternsContext.Provider value={availablePatternsMemo}>
          <SelectedAnimationPatternContext.Provider value={selectedAnimationPatternMemo}>
            <SelectedAnimationPatternIndexContext.Provider
              value={
                selectedAnimation?.animationPatterns.findIndex((ap) => ap.uuid === selectedAnimationPattern?.uuid) ?? 0
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
        tooltipTitle="Convert saved animation to lasershow"
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
        tooltipTitle="Get saved lasershow"
      />
    </SpeedDial>
  );

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
    <SideNav pageName="Lasershow editor">
      <DeleteModal modalOptions={modalOptions} setModalOptions={setModalOptions} />
      {selectedAnimation === null ? getSpeedDial() : getWrapperContext(<AnimationKeyFrameEditor />)}
      <OnTrue onTrue={animationsModalOpen}>
        <CardOverview
          closeOverview={() => setAnimationsModalOpen(false)}
          show={animationsModalOpen}
          onNoItemsMessageTitle="No animations saved"
          onNoItemsDescription="Create a new animation first"
          onDeleteClick={(uuid) =>
            setModalOptions({
              show: true,
              onDelete: () => onAnimationDelete(uuid ?? ""),
            })
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
