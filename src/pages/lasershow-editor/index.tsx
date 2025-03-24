import AddIcon from "@mui/icons-material/Add";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import SettingsIcon from "@mui/icons-material/Settings";
import { SpeedDial, SpeedDialAction } from "@mui/material";
import SpeedDialIcon from "@mui/material/SpeedDialIcon";
import LasershowEditorContent from "components/lasershow/lasershow-editor";
import CardOverview from "components/shared/card-overview";
import DeleteModal, { ModalOptions } from "components/shared/delete-modal";
import { OnTrue } from "components/shared/on-true";
import SideNav from "components/shared/sidenav";
import { Animation } from "models/components/shared/animation";
import { Lasershow, getLasershowPlaceholder } from "models/components/shared/lasershow";
import React, { useEffect, useState } from "react";
import { getAnimations } from "services/logic/animation-logic";
import { getLasershows, removeLasershow, saveLasershow } from "services/logic/lasershow-logic";
import { createGuid } from "services/shared/math";

export type AvailableAnimationsContextType = {
  availableAnimations: Animation[] | null;
  setAvailableAnimations: React.Dispatch<React.SetStateAction<Animation[] | null>>;
};

export type SelectedLasershowContextType = {
  selectedLasershow: Lasershow | null;
  setSelectedLasershow: React.Dispatch<React.SetStateAction<Lasershow | null>>;
};

export const AvailableAnimationsContext =
  React.createContext<AvailableAnimationsContextType | null>(null);
export const SelectedLasershowContext = React.createContext<SelectedLasershowContextType | null>(
  null
);

export default function LasershowEditor() {
  const [selectedLasershow, setSelectedLasershow] = useState<Lasershow | null>(null);
  const [availableAnimations, setAvailableAnimations] = useState<Animation[] | null>(null);
  const [availableLasershows, setAvailableLasershows] = useState<Lasershow[] | null>(null);
  const [lasershowModalOpen, setLaserShowModalOpen] = useState<boolean>(false);
  const [modalOptions, setModalOptions] = useState<ModalOptions>({
    show: false,
    onDelete: () => null,
  });

  const selectedLasershowMemo = React.useMemo(
    () => ({ selectedLasershow, setSelectedLasershow }),
    [selectedLasershow]
  );

  const availableAnimationsMemo = React.useMemo(
    () => ({ availableAnimations, setAvailableAnimations }),
    [availableAnimations]
  );

  useEffect(() => {
    if (availableLasershows === null) {
      getLasershows().then((lasershows) => {
        if (lasershows !== undefined) {
          setAvailableLasershows(lasershows);
        }
      });
    }
    if (availableAnimations === null) {
      getAnimations().then((animations) => {
        if (animations !== undefined) {
          setAvailableAnimations(animations);
        }
      });
    }
  }, []);

  const getWrapperContext = (reactObject: React.ReactNode) => (
    <AvailableAnimationsContext.Provider value={availableAnimationsMemo}>
      <SelectedLasershowContext.Provider value={selectedLasershowMemo}>
        {reactObject}
      </SelectedLasershowContext.Provider>
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

  const onLasershowDelete = async (uuid: string) => {
    const result = await removeLasershow(uuid);
    if (result?.status === 200 && availableLasershows !== null) {
      let lasershows = [...availableLasershows];
      const lasershowIndex = lasershows.findIndex((a) => a.uuid === uuid);
      if (lasershowIndex === -1) {
        return;
      }

      lasershows.splice(lasershowIndex, 1);
      setAvailableLasershows(lasershows);
    }

    setModalOptions({ show: false, onDelete: () => null });
  };

  const onDuplicateLasershow = (uuid: string | null) => {
    let lasershowToDuplicate = {
      ...availableLasershows?.find((a) => a.uuid === uuid),
    } as Lasershow;
    if (lasershowToDuplicate === undefined) {
      return;
    }

    lasershowToDuplicate.uuid = createGuid();
    lasershowToDuplicate.name += `-duplicated-${new Date().toLocaleDateString()}`;
    for (let index = 0; index < lasershowToDuplicate.lasershowAnimations.length; index++) {
      lasershowToDuplicate.lasershowAnimations[index].lasershowUuid = lasershowToDuplicate.uuid;
      lasershowToDuplicate.lasershowAnimations[index].uuid = createGuid();
    }

    let lasershowsToUpdate = [...(availableLasershows ?? [])];
    lasershowsToUpdate.push(lasershowToDuplicate);
    setAvailableLasershows(lasershowsToUpdate);
    saveLasershow(lasershowToDuplicate);
  };

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
              onDelete: () => onLasershowDelete(uuid ?? ""),
            })
          }
          onDuplicateClick={onDuplicateLasershow}
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
