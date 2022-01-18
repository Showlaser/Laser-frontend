import { InputLabel } from "@material-ui/core";
import { useEffect, useState } from "react";
import { getAnimations } from "services/logic/animation-logic";

export default function AnimationOptions(props) {
  const [animations, setAnimations] = useState([]);

  useEffect(() => {
    getAnimations().then((value) => setAnimations(value));
  }, [animations]);

  return (
    <div>
      <InputLabel>Select Animation</InputLabel>
    </div>
  );
}
