import { Button, FormControl, Grid, Paper, TextField } from "@mui/material";
import React, { useState } from "react";
import { addUser } from "services/logic/user-logic";
import { getFormDataFromEvent } from "services/shared/form-data-helper";
import paths from "services/shared/router-paths";
import { showError, showSuccess, toastSubject } from "services/shared/toast-messages";

export default function Registration() {
  const [buttonDisabled, setButtonDisabled] = useState(false);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setButtonDisabled(true);
    const formData = getFormDataFromEvent(e);
    const passwordsDoNotMatch = formData.password !== formData.passwordRepeat;
    if (passwordsDoNotMatch) {
      showError(toastSubject.passwordsDoNotMatch);
      setButtonDisabled(false);
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
        setButtonDisabled(false);
        return;
      }

      setButtonDisabled(false);
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
      <Paper sx={{ p: 2, textAlign: "center" }}>
        <h1>Register</h1>
        <form onSubmit={onSubmit}>
          <FormControl key="user-account" style={{ minWidth: "40vh" }}>
            <TextField fullWidth label="Username" required name="username" />
            <TextField fullWidth label="Email" type="email" required name="email" />
            <TextField fullWidth type="password" label="Password" required name="password" />
            <TextField
              fullWidth
              name="passwordRepeat"
              type="password"
              label="Repeat password"
              required
            />
            <br />
            <Button type="submit" variant="contained" loading={buttonDisabled} fullWidth>
              Register
            </Button>
          </FormControl>
        </form>
      </Paper>
    </Grid>
  );
}
