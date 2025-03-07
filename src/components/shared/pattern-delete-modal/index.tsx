import { Animation } from "models/components/shared/animation";
import { Pattern } from "models/components/shared/pattern";
import React from "react";
import { useState } from "react";
import { List, ListItem, ListItemText } from "@mui/material";
import { removePattern } from "services/logic/pattern-logic";
import DeleteModal, { ModalOptions } from "components/shared/delete-modal";
import { OnTrue } from "components/shared/on-true";
import { Lasershow } from "models/components/shared/lasershow";

export type PatternDeleteModalProps = {
  availablePatterns: Pattern[];
  availableAnimations: Animation[];
  availableLasershows: Lasershow[];
  pattern: Pattern;
  onDelete: (uuid: string) => void;
  onCancelClick: (pattern: undefined) => void;
};

export default function PatternDeleteModal({
  availablePatterns,
  availableAnimations,
  availableLasershows,
  pattern,
  onDelete,
  onCancelClick,
}: PatternDeleteModalProps) {
  const getPatternTreeView = () => {
    if (availablePatterns === null) {
      return;
    }

    const animationsPatternIsUsedIn = availableAnimations?.filter((a) =>
      a.animationPatterns.some((ap) => ap.pattern.uuid === pattern.uuid)
    );

    const animationsPatternList = (
      <List key={`ap-list-${pattern.uuid}`} dense disablePadding style={{ maxWidth: "40vh" }}>
        {animationsPatternIsUsedIn?.map((a) => (
          <ListItem>
            <ListItemText primary={a.name} />
          </ListItem>
        ))}
      </List>
    );

    const lasershowsPatternIsUsedIn = availableLasershows?.filter((ls) =>
      ls.lasershowAnimations.some((lsa) => animationsPatternIsUsedIn?.some((ap) => ap.uuid === lsa.animation.uuid))
    );

    const lasershowPatternsList = (
      <List key={`ls-list-${pattern.uuid}`} dense disablePadding style={{ maxWidth: "40vh" }}>
        {lasershowsPatternIsUsedIn?.map((ls) => (
          <ListItem>
            <ListItemText primary={ls.name} />
          </ListItem>
        ))}
      </List>
    );

    return (
      <div>
        <img style={{ maxWidth: "25vh" }} src={pattern.image ?? ""} />
        <br />
        <OnTrue onTrue={(animationsPatternIsUsedIn?.length ?? 0) > 0}>
          <b>
            The pattern {pattern.name} will be removed from the following animation
            {animationsPatternIsUsedIn.length > 1 ? "(s)" : null}
          </b>
          {animationsPatternList}
        </OnTrue>
        <OnTrue onTrue={(lasershowsPatternIsUsedIn?.length ?? 0) > 0}>
          <>
            <b>
              Which will effect the following lasershow
              {lasershowsPatternIsUsedIn.length > 1 ? "(s)" : null}
            </b>
            {lasershowPatternsList}
          </>
        </OnTrue>
      </div>
    );
  };

  const [modalOptions, setModalOptions] = useState<ModalOptions>({
    title: `Delete pattern: ${pattern.name}`,
    show: true,
    onDelete: () => onPatternDelete(pattern.uuid),
    children: getPatternTreeView(),
  });

  const onPatternDelete = async (patternUuid: string) => {
    const result = await removePattern(patternUuid);
    if (result?.status === 200) {
      onDelete(patternUuid);
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
