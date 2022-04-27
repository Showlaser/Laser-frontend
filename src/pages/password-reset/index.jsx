import { Grid } from "@mui/material";
import ResetPassword from "components/password-reset";
import RequestPasswordReset from "components/password-reset/request-password-reset";
import { useEffect, useState } from "react";
import { getResetCode } from "services/logic/password-reset-logic";
import { stringIsEmpty } from "services/shared/general";

export default function PasswordReset() {
  const [resetCode, setResetCode] = useState("");

  useEffect(() => {
    const code = getResetCode();
    if (!stringIsEmpty(code)) {
      setResetCode(code);
    }
  }, []);

  return (
    <Grid
      container
      spacing={0}
      direction="column"
      alignItems="center"
      justifyContent="center"
      style={{ minHeight: "70vh" }}
    >
      {stringIsEmpty(resetCode) ? (
        <RequestPasswordReset />
      ) : (
        <ResetPassword code={resetCode} />
      )}
    </Grid>
  );
}
