import { Slider } from "@material-ui/core";

export default function TemperatureSettings(props) {
  const changeMaxTemperature = (maxTemp, propName) => {
    let updatedTemperatures = props?.temperatures;
    updatedTemperatures[propName].maxTemp = maxTemp;
    props.callback(updatedTemperatures, "temperatures");
  };
  return (
    <div>
      <h2>Max temperatures</h2>
      <p>
        The max temperature a component can reach. Laser will be shut off if
        temperature gets above the set values
      </p>
      <b>Galvo</b>
      <br />
      <small>Temp in celsius {props?.temperatures?.galvo?.maxTemp} °</small>
      <Slider
        onChange={(e, value) => changeMaxTemperature(value, "galvo")}
        value={props?.temperatures?.galvo?.maxTemp}
        min={40}
        max={70}
        aria-labelledby="continuous-slider"
        valueLabelDisplay="auto"
      />
      <b>Base plate: </b>
      <br />
      <small>Temp in celsius {props?.temperatures?.basePlate?.maxTemp} °</small>
      <Slider
        onChange={(e, value) => changeMaxTemperature(value, "basePlate")}
        value={props?.temperatures?.basePlate?.maxTemp}
        min={40}
        max={70}
        aria-labelledby="continuous-slider"
        valueLabelDisplay="auto"
      />
    </div>
  );
}
