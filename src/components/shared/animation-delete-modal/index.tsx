import { Animation } from "models/components/shared/animation";
import { Lasershow } from "models/components/shared/lasershow";
import React from "react";
import { useState } from "react";
import { removeAnimation } from "services/logic/animation-logic";
import { List, ListItem, ListItemText } from "@mui/material";
import DeleteModal, { ModalOptions } from "components/shared/delete-modal";
import { OnTrue } from "components/shared/on-true";

export type AnimationDeleteModalProps = {
  availableLasershows: Lasershow[];
  animation: Animation;
  onDelete: (uuid: string) => void;
  onCancelClick: (animation: undefined) => void;
};

export default function AnimationDeleteModal({
  availableLasershows,
  animation,
  onDelete,
  onCancelClick,
}: AnimationDeleteModalProps) {
  const getAnimationTreeView = () => {
    const lasershowsAnimationIsUsedIn = availableLasershows.filter((ls) =>
      ls.lasershowAnimations.some((la) => la.animation.uuid === animation.uuid)
    );

    const lasershowAnimationList = (
      <List key={`ls-list-${animation.uuid}`} dense disablePadding style={{ maxWidth: "40vh" }}>
        {lasershowsAnimationIsUsedIn?.map((ls) => (
          <ListItem>
            <ListItemText primary={ls.name} />
          </ListItem>
        ))}
      </List>
    );

    return (
      <>
        <img style={{ maxWidth: "25vh" }} src={animation.image ?? ""} />
        <br />
        <div>
          <p>Warning the animation will be removed from the following lasershows:</p>
          <OnTrue onTrue={(lasershowsAnimationIsUsedIn?.length ?? 0) > 0}>
            <>
              <b>Lasershows</b>
              {lasershowAnimationList}
            </>
          </OnTrue>
        </div>
      </>
    );
  };

  const [modalOptions, setModalOptions] = useState<ModalOptions>({
    title: `Delete animation: ${animation.name}`,
    show: true,
    onDelete: () => onAnimationDelete(animation.uuid),
    children: getAnimationTreeView(),
  });

  const onAnimationDelete = async (animationUuid: string) => {
    const result = await removeAnimation(animationUuid);
    if (result?.status === 200) {
      onDelete(animationUuid);
    }
  };

  return (
    <DeleteModal
      modalOptions={modalOptions}
      setModalOptions={setModalOptions}
      onCancelClick={() => onCancelClick(undefined)}
    />
  );
}
