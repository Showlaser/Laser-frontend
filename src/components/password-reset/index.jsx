import { Button, FormControl, TextField } from "@mui/material";
import { useState } from "react";
import { resetPassword } from "services/logic/password-reset-logic";
import { showError, toastSubject } from "services/shared/toast-messages";

export default function ResetPassword({ code }) {
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordRepeat, setNewPasswordRepeat] = useState("");
  const [buttonDisabled, setButtonDisabled] = useState(false);

  const passwordsMatch = () => {
    return newPassword == newPasswordRepeat;
  };

  return (
    <FormControl>
      <TextField
        fullWidth
        type="password"
        label="New password"
        onChange={(e) => setNewPassword(e.target.value)}
      />
      <TextField
        fullWidth
        type="password"
        label="Repeat password"
        onChange={(e) => setNewPasswordRepeat(e.target.value)}
      />
      <br />
      <Button
        disabled={buttonDisabled}
        fullWidth
        onClick={() => {
          setButtonDisabled(true);
          if (passwordsMatch()) {
            resetPassword(code, newPassword).then((result) => {
              if (result.status === 404) {
                showError(toastSubject.invalidCode);
              }
            });
            setButtonDisabled(false);
            return;
          }

          showError(toastSubject.passwordsDoNotMatch);
          setButtonDisabled(false);
        }}
      >
        Reset password
      </Button>
    </FormControl>
  );
}
