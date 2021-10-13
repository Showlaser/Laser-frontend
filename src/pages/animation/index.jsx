import {
  Button,
  List,
  ListItem,
  ListItemText,
  TextField,
  Slider,
} from "@material-ui/core";
import SideNav from "components/sidenav";
import React, { useState, useEffect } from "react";
import "./index.css";
import AddIcon from "@material-ui/icons/Add";
import { createGuid } from "services/shared/math";

export default function AnimationEditor() {
  const [patterns, setPatterns] = useState([
    { uuid: "109b410c-9ec4-4a50-8899-6241909bbee8", name: "Circle" },
    { uuid: "21dda7d6-4ec6-4a8b-ae32-d8d9d7906ac9", name: "Triangle" },
    {
      uuid: "bb68f706-b82e-477e-9b3f-074b5948c9fb",
      name: "Rectangle",
      startTime: 0,
      stopTime: 100,
      points: [
        {
          uuid: createGuid(),
          x: -4000,
          y: 4000,
          connectedToUuid: null,
        },
        {
          uuid: createGuid(),
          x: 4000,
          y: 4000,
          connectedToUuid: null,
        },
        {
          uuid: createGuid(),
          x: 4000,
          y: -4000,
          connectedToUuid: null,
        },
        {
          uuid: createGuid(),
          x: -4000,
          y: -4000,
          connectedToUuid: null,
        },
      ],
    },
  ]);

  const [patternsInAnimation, setPatternsInAnimation] = useState([]);
  const [selectedPattern, setSelectedPattern] = useState();
  const [currentTimeMs, setCurrentTimeMs] = useState(0);
  const [, updateState] = React.useState();
  const forceUpdate = React.useCallback(() => updateState({}), []);

  const sideNavSettings = {
    pageName: "Animation",
  };

  const addPatternToAnimation = (pattern) => {
    let newPatternsCollection = patternsInAnimation;
    newPatternsCollection.push(pattern);
    setPatternsInAnimation(newPatternsCollection);
    forceUpdate();
  };

  const patternsForm = () =>
    selectedPattern?.points?.map((point, index) => (
      <div key={`${index}-pattern-point`}>
        <small>Point {index}</small>
        <br />
        <TextField
          key={createGuid()}
          name={`x${index}`}
          size="small"
          style={{ margin: "2px" }}
          InputProps={{ inputProps: { min: -4000, max: 4000 } }}
          type="number"
          label="X"
          defaultValue={point.x}
        />
        <TextField
          key={createGuid()}
          name={`y${index}`}
          size="small"
          style={{ margin: "2px" }}
          InputProps={{ inputProps: { min: -4000, max: 4000 } }}
          type="number"
          label="Y"
          defaultValue={point.y}
        />
      </div>
    ));

  const patternSelector = (
    <div>
      <label>Select Pattern</label>
      <br />
      <TextField placeholder="Pattern name" />
      <List id="pattern-selector">
        {patterns?.map((pattern) => (
          <ListItem key={pattern?.uuid}>
            <ListItemText primary={pattern?.name} />
            <Button
              startIcon={<AddIcon />}
              onClick={() => addPatternToAnimation(pattern)}
            >
              Add
            </Button>
          </ListItem>
        ))}
      </List>
    </div>
  );

  const content = (
    <div id="animation-wrapper">
      <div id="pattern-effects">
        <div className="left">
          <form>
            <List>
              <small className="pattern-effects-li">Position: </small>
              <br />
              <TextField
                type="number"
                placeholder="x"
                defaultValue={selectedPattern?.position?.x}
              />
              <TextField
                type="number"
                placeholder="y"
                defaultValue={selectedPattern?.position?.y}
              />
              <br />
              <small className="pattern-effects-li">Scale: </small>
              <br />
              <TextField
                type="number"
                InputProps={{ inputProps: { min: 0, max: 10 } }}
                defaultValue={selectedPattern?.scale}
              />
              <br />
              <small className="pattern-effects-li">Rotation: </small>
              <br />
              <TextField
                type="number"
                defaultValue={selectedPattern?.rotation}
              />
              <br />
              <small className="pattern-effects-li">Start time ms: </small>
              <br />
              <TextField
                type="number"
                value={selectedPattern?.startTime}
                onChange={(e) => {
                  let pattern = selectedPattern;
                  pattern.startTime = e.target.value;
                  setSelectedPattern(pattern);
                  forceUpdate();
                }}
              />
              <br />
              <small className="pattern-effects-li">Stop time ms: </small>
              <br />
              <TextField
                type="number"
                value={selectedPattern?.stopTime}
                onChange={(e) => {
                  let pattern = selectedPattern;
                  pattern.stopTime = e.target.value;
                  setSelectedPattern(pattern);
                  forceUpdate();
                }}
              />
              <br />
              {patternsForm()}
              <Button type="submit">Save</Button>
            </List>
          </form>
        </div>
        <div id="pattern-effects-timeline">
          <Slider
            onChange={(e, value) => {
              setCurrentTimeMs(value);
              forceUpdate();
            }}
            min={0}
            max={selectedPattern?.stopTime}
            aria-labelledby="continuous-slider"
            valueLabelDisplay="auto"
            value={selectedPattern?.stopTime}
          />
        </div>
      </div>
      <div id="animation-bottom">
        <div id="animation-navigation">{patternSelector}</div>
        <div id="animation-timeline">
          <label>Timeline</label>
          <div className="animation-timeline-box">
            {patternsInAnimation.map((pattern) => (
              <div
                style={{
                  backgroundColor:
                    selectedPattern?.uuid === pattern?.uuid ? "white" : "",
                  color:
                    selectedPattern?.uuid === pattern?.uuid ? "black" : "white",
                }}
                onClick={() => setSelectedPattern(pattern)}
              >
                {pattern?.name}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div>
      <SideNav content={content} settings={sideNavSettings} />
    </div>
  );
}
