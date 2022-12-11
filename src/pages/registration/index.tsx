import { Button, FormControl, TextField, Grid } from "@mui/material";
import { useState } from "react";
import { getFormDataFromEvent } from "services/shared/form-data-helper";
import { showError, showSuccess, toastSubject } from "services/shared/toast-messages";
import paths from "services/shared/router-paths";
import { addUser } from "services/logic/user-logic";
import React from "react";

export default function Registration() {
  const [buttonDisabled, setButtonDisabled] = useState(false);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = getFormDataFromEvent(e);
    const passwordsDoNotMatch = formData.password !== formData.passwordRepeat;
    if (passwordsDoNotMatch) {
      showError(toastSubject.passwordsDoNotMatch);
      return;
    }

    addUser(formData).then((result) => {
      if (result?.status === 200) {
        showSuccess(toastSubject.accountCreated);
        setTimeout(() => (window.location.href = paths.Login), 10000);
        return;
      }
      if (result?.status === 409) {
        showError(toastSubject.duplicatedName);
        return;
      }
    });
  };

  return (
    <Grid
      container
      spacing={0}
      direction="column"
      alignItems="center"
      justifyContent="center"
      style={{ minHeight: "70vh" }}
    >
      <form onSubmit={onSubmit}>
        <FormControl key="user-account" style={{ minWidth: "40vh" }}>
          <TextField fullWidth label="Username" required name="username" />
          <TextField fullWidth label="Email" type="email" required name="email" />
          <TextField fullWidth type="password" label="Password" required name="password" />
          <TextField fullWidth name="passwordRepeat" type="password" label="Repeat password" required />
          <br />
          <Button type="submit" variant="contained" disabled={buttonDisabled} fullWidth>
            Register
          </Button>
        </FormControl>
      </form>
    </Grid>
  );
}
