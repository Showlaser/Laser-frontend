import { Button, FormControl, TextField } from "@mui/material";
import { useState } from "react";
import { resetPassword } from "services/logic/password-reset-logic";
import paths from "services/shared/router-paths";
import { showError, toastSubject } from "services/shared/toast-messages";

export default function ResetPassword({ code }) {
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordRepeat, setNewPasswordRepeat] = useState("");
  const [buttonDisabled, setButtonDisabled] = useState(false);

  const passwordsMatch = () => {
    return newPassword === newPasswordRepeat;
  };

  const onReset = () => {
    setButtonDisabled(true);
    if (passwordsMatch()) {
      resetPassword(code, newPassword).then((result) => {
        if (result.status === 404) {
          showError(toastSubject.invalidCode);
        } else if (result.status === 200) {
          setTimeout(() => (window.location.href = paths.Login), 3000);
        }
      });
      setButtonDisabled(false);
      return;
    }

    showError(toastSubject.passwordsDoNotMatch);
    setButtonDisabled(false);
  };

  return (
    <FormControl>
      <TextField fullWidth type="password" label="New password" onChange={(e) => setNewPassword(e.target.value)} />
      <TextField
        fullWidth
        type="password"
        label="Repeat password"
        onChange={(e) => setNewPasswordRepeat(e.target.value)}
      />
      <br />
      <Button variant="contained" disabled={buttonDisabled} fullWidth onClick={onReset}>
        Reset password
      </Button>
    </FormControl>
  );
}
