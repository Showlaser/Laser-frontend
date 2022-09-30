import { Button, Divider, Fade, FormControl, Grid, MenuItem, Select, SelectChangeEvent } from "@mui/material";
import React, { useState } from "react";

type Props = {
  setSelectedEditor: (editor: string) => void;
  selectedEditor: string | null;
};

export default function EditorSelector({ setSelectedEditor, selectedEditor }: Props) {
  const [selectValue, setSelectValue] = useState<string>("");

  const getEffectEditorInfo = () => (
    <div>
      <h3>Effect editor info</h3>
      <p>
        This editor uses effects to generate an animation. Effects for example adjust the scale of the animation from
        small to large, back and forward. This editor gives less flexability than the key frame editor, because you
        cannot specify per millisecond what the animation should do.
      </p>
    </div>
  );

  const getKeyFrameEditorInfo = () => (
    <div>
      <h3>Keyframe editor info</h3>
      <p>
        This editor uses keyframes to generate an animation. Use this editor if you want to dynamically change an
        animation with keyframes. Keyframes are changes to the animation at a specified time (like changing the scale).
        The keyframes dynamically grow towards the next keyframe. This editor gives more flexability than the effect
        editor, because you can choose at the specified time what an animation should do.
      </p>
    </div>
  );

  const getEditorInfo = () => {
    if (selectValue === "") {
      return null;
    }

    return selectValue === "keyframe-editor" ? getKeyFrameEditorInfo() : getEffectEditorInfo();
  };

  return (
    <div style={{ width: "100%" }}>
      <div style={{ width: "50%", margin: "auto" }}>
        <h3>Editor selection</h3>
        <p>Select what editor you want to use</p>
        <Divider />
        <FormControl style={{ width: "100%", marginBottom: "10px", marginTop: "30px" }}>
          <small>Editor</small>
          <Select defaultValue="" label="Age" onChange={(e: SelectChangeEvent) => setSelectValue(e.target.value)}>
            <MenuItem value="effects-editor">Effects editor</MenuItem>
            <MenuItem value="keyframe-editor">Keyframe editor</MenuItem>
          </Select>
          <br />
          <Fade in={selectValue !== ""}>
            <span>{getEditorInfo()}</span>
          </Fade>
          <Button disabled={selectValue === ""} variant="contained" onClick={() => setSelectedEditor(selectValue)}>
            Use this editor
          </Button>
        </FormControl>
      </div>
    </div>
  );
}
