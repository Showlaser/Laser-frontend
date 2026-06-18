import { Box } from "@mui/material";
import ResetPassword from "components/password-reset";
import RequestPasswordReset from "components/password-reset/request-password-reset";
import React from "react";
import { useEffect, useState } from "react";
import { getUrlCode, stringIsEmpty } from "services/shared/general";

export default function PasswordReset() {
  const [resetCode, setResetCode] = useState("");

  useEffect(() => {
    const code = getUrlCode();
    if (!stringIsEmpty(code)) {
      setResetCode(code);
    }
  }, []);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "70vh",
      }}
    >
      {stringIsEmpty(resetCode) ? <RequestPasswordReset /> : <ResetPassword code={resetCode} />}
    </Box>
  );
}
