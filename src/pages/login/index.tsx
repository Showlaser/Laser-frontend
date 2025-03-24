import { Button, FormControl, Grid, LinearProgress, TextField } from "@mui/material";
import React, { useState } from "react";
import { login } from "services/logic/login-logic";
import { getFormDataObject, getUrlCode, stringIsEmpty } from "services/shared/general";
import paths from "services/shared/router-paths";
import { showError, toastSubject } from "services/shared/toast-messages";
import Cookies from "universal-cookie";
import "./index.css";

export default function Login() {
  const [submitInProgress, setSubmitInProgress] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitInProgress(true);
    const json = getFormDataObject(e);
    const result = await login(json);
    setSubmitInProgress(false);
    if (result?.status === 200) {
      const cookie = new Cookies();
      cookie.set(
        "logged-in",
        { loginTime: Date.now() },
        {
          path: "/",
          sameSite: true,
        }
      );

      let redirectUrl = getUrlCode();
      if (stringIsEmpty(redirectUrl)) {
        redirectUrl = paths.Dashboard;
      }

      const termsAndConditionsAccepted = localStorage.getItem("terms-accepted");
      window.location.href = termsAndConditionsAccepted ? redirectUrl : paths.Disclaimer;
      return;
    } else if (result?.status === 451) {
      showError(toastSubject.accountDisabled);
      return;
    }

    showError(toastSubject.invalidLoginCredentials);
  };

  return (
    <Grid id="login-wrapper" container spacing={0} direction="column" alignItems="center">
      <form id="login" onSubmit={onSubmit}>
        <FormControl>
          <h1>Login</h1>
          <TextField
            required
            autoComplete="off"
            defaultValue="vincent"
            label="Username"
            name="username"
          />
          <br />
          <TextField required label="Password" defaultValue="123" type="password" name="password" />
          <br />
          <Button disabled={submitInProgress} variant="contained" type="submit" fullWidth>
            Login
          </Button>
          {submitInProgress ? <LinearProgress /> : null}
          <br />
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
