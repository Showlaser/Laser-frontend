import { Button, Divider, FormControl, Grid, LinearProgress, TextField } from "@mui/material";
import { login } from "services/logic/login-logic";
import { getCodeFromResponse, getFormDataObject, stringIsEmpty } from "services/shared/general";
import paths from "services/shared/router-paths";
import { showError, toastSubject } from "services/shared/toast-messages";
import Cookies from "universal-cookie";
import React, { useState } from "react";

export default function Login() {
  const [submitInProgress, setSubmitInProgress] = useState(false);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitInProgress(true);
    const json = getFormDataObject(e);
    login(json).then((result) => {
      setSubmitInProgress(false);
      if (result?.status === 200) {
        const cookie = new Cookies();
        cookie.set("LoggedIn", true, {
          path: "/",
          sameSite: true,
        });

        let redirectUrl = getCodeFromResponse();
        if (stringIsEmpty(redirectUrl)) {
          redirectUrl = paths.Root;
        }

        const termsAndConditionsAccepted = localStorage.getItem("terms-accepted");
        window.location.href = termsAndConditionsAccepted ? redirectUrl : paths.Disclaimer;
        return;
      } else if (result?.status === 451) {
        showError(toastSubject.accountDisabled);
        return;
      }

      showError(toastSubject.invalidLoginCredentials);
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
        <FormControl>
          <h1>Login</h1>
          <TextField required autoComplete="off" defaultValue="vincent" label="Username" name="username" />
          <br />
          <TextField required label="Password" defaultValue="Thermoneter" type="password" name="password" />
          <br />
          <Button disabled={submitInProgress} variant="contained" type="submit" fullWidth>
            Login
          </Button>
          {submitInProgress ? <LinearProgress /> : null}
          <Divider />
          <a className="link-btn" href={paths.Register}>
            Register
          </a>
          <a className="link-btn" href={paths.ResetPassword}>
            Forgot password?
          </a>
        </FormControl>
      </form>
    </Grid>
  );
}