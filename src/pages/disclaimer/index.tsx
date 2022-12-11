import { Button, FormControlLabel, FormGroup } from "@mui/material";
import Checkbox from "@mui/material/Checkbox";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import paths from "services/shared/router-paths";

export default function Disclaimer() {
  const [countDown, setCountdown] = useState<number>(10);
  const [termsAndConditionsAccepted, setTermsAndConditionsAccepted] = useState<boolean>(false);

  useEffect(() => {
    if (countDown <= 0) {
      return;
    }

    setTimeout(() => {
      setCountdown(countDown - 1);
    }, 1000);
  }, [countDown]);

  return (
    <div style={{ textAlign: "center" }}>
      <h2>Warning!</h2>
      <div style={{ textAlign: "left", display: "inline-block" }}>
        <p>
          You are responsible for your own safety by using this software and products that are controlled by it. <br />I
          am not responsible for any harm and or damages that can occur by using this software or products that are
          controlled by it.
          <br />
          By continuing to use this software you agree to these terms and conditions.
        </p>
        <FormGroup>
          <FormControlLabel
            control={<Checkbox onClick={() => setTermsAndConditionsAccepted(!termsAndConditionsAccepted)} />}
            label="I accept the terms and conditions"
          />
        </FormGroup>
      </div>
      <br />
      <Button
        variant="contained"
        disabled={countDown > 0 || !termsAndConditionsAccepted}
        onClick={() => {
          localStorage.setItem("terms-accepted", "true");
          window.location.href = paths.Dashboard;
        }}
      >
        {countDown > 0 ? `Continue: (${countDown})` : "Continue"}
      </Button>
    </div>
  );
}
