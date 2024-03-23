import React, { useEffect, useState } from "react";
import SideNav from "components/shared/sidenav";
import SpeedDialIcon from "@mui/material/SpeedDialIcon";
import { SpeedDial, SpeedDialAction } from "@mui/material";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import SettingsIcon from "@mui/icons-material/Settings";
import CardOverview from "components/shared/card-overview";
import { Animation } from "models/components/shared/animation";
import { getAnimations, removeAnimation } from "services/logic/animation-logic";
import DeleteModal, { ModalOptions } from "components/shared/delete-modal";
import { OnTrue } from "components/shared/on-true";
import { Lasershow, getLasershowPlaceholder } from "models/components/shared/lasershow";
import AddIcon from "@mui/icons-material/Add";
import LasershowEditorContent from "components/lasershow/lasershow-editor";

export type AvailableAnimationsContextType = {
  availableAnimations: Animation[] | null;
  setAvailableAnimations: React.Dispatch<React.SetStateAction<Animation[] | null>>;
};

export type SelectedLasershowContextType = {
  selectedLasershow: Lasershow | null;
  setSelectedLasershow: React.Dispatch<React.SetStateAction<Lasershow | null>>;
};

export const AvailableAnimationsContext = React.createContext<AvailableAnimationsContextType | null>(null);
export const SelectedLasershowContext = React.createContext<SelectedLasershowContextType | null>(null);

export default function LasershowEditor() {
  const [selectedLasershow, setSelectedLasershow] = useState<Lasershow | null>(null);
  const [availableAnimations, setAvailableAnimations] = useState<Animation[] | null>(null);
  const [availableLasershows, setAvailableLasershows] = useState<Lasershow[] | null>(null);
  const [lasershowModalOpen, setLaserShowModalOpen] = useState<boolean>(false);
  const [modalOptions, setModalOptions] = useState<ModalOptions>({
    show: false,
    onDelete: () => null,
  });

  const selectedLasershowMemo = React.useMemo(() => ({ selectedLasershow, setSelectedLasershow }), [selectedLasershow]);

  const availableAnimationsMemo = React.useMemo(
    () => ({ availableAnimations, setAvailableAnimations }),
    [availableAnimations]
  );

  useEffect(() => {
    if (availableAnimations === null) {
      getAnimations().then((response) => {
        setAvailableAnimations(response);
      });
    }
  }, []);

  const getWrapperContext = (reactObject: React.ReactNode) => (
    <AvailableAnimationsContext.Provider value={availableAnimationsMemo}>
      <SelectedLasershowContext.Provider value={selectedLasershowMemo}>{reactObject}</SelectedLasershowContext.Provider>
    </AvailableAnimationsContext.Provider>
  );

  const getSpeedDial = () => (
    <SpeedDial
      ariaLabel="SpeedDial basic example"
      sx={{ position: "absolute", bottom: 30, right: 30 }}
      icon={selectedLasershow === null ? <SpeedDialIcon /> : <SettingsIcon />}
    >
      <SpeedDialAction
        key="sd-new-file"
        tooltipTitle="Create a new lasershow"
        onClick={() => setSelectedLasershow(getLasershowPlaceholder())}
        icon={
          <label style={{ cursor: "pointer", padding: "25px" }}>
            <AddIcon style={{ marginTop: "8px" }} />
          </label>
        }
      ></SpeedDialAction>
      <SpeedDialAction
        onClick={() => setLaserShowModalOpen(true)}
        key="sd-animation-from-pc"
        icon={
          <label htmlFor="raised-button-file" style={{ cursor: "pointer", padding: "25px" }}>
            <CloudDownloadIcon style={{ marginTop: "8px" }} />
          </label>
        }
        tooltipTitle="Edit saved lasershow"
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

  const onLasershowDelete = () => {};

  return (
    <SideNav pageName="Lasershow editor">
      <DeleteModal modalOptions={modalOptions} setModalOptions={setModalOptions} />
      {selectedLasershow === null ? getSpeedDial() : getWrapperContext(<LasershowEditorContent />)}
      <OnTrue onTrue={lasershowModalOpen}>
        <CardOverview
          closeOverview={() => setLaserShowModalOpen(false)}
          show={lasershowModalOpen}
          onNoItemsMessageTitle="No lasershows saved"
          onNoItemsDescription="Create a new lasershow first!"
          onDeleteClick={(uuid) =>
            setModalOptions({
              show: true,
              onDelete: () => onAnimationDelete(uuid ?? ""),
            })
          }
          items={
            availableLasershows?.map((lasershow) => ({
              uuid: lasershow.uuid,
              name: lasershow.name,
              image: lasershow.image,
              onCardClick: () => {
                setLaserShowModalOpen(false);
                setSelectedLasershow(lasershow);
              },
            })) ?? []
          }
        />
      </OnTrue>
    </SideNav>
  );
}
