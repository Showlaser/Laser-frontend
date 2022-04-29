import { TextField, Button, FormControl, Alert } from "@mui/material";
import { useState } from "react";
import { requestPasswordReset } from "services/logic/password-reset-logic";

export default function RequestPasswordReset() {
  const [passwordResetRequested, setPasswordResetRequested] = useState(false);
  const [email, setEmail] = useState("");

  const resetPassword = () => {
    requestPasswordReset(email).then((response) => {
      if (response.status === 200) {
        setPasswordResetRequested(true);
      }
    });
  };

  return passwordResetRequested ? (
    <div>
      <Alert severity="success">
        Check your email to reset your password. Check the spam folder if you
        did not receive an email.
      </Alert>
    </div>
  ) : (
    <FormControl>
      <TextField
        type="email"
        autoFocus
        autoComplete="true"
        placeholder="Email"
        label="Email"
        onChange={(e) => setEmail(e.target.value)}
      />
      <br />
      <Button variant="contained" onClick={resetPassword} fullWidth>
        Reset password
      </Button>
    </FormControl>
  );
}
