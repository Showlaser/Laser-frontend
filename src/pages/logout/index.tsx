import { logout } from "services/logic/user-logic";
import paths from "services/shared/router-paths";
import Cookies from "universal-cookie";
import React, { useEffect, useState } from "react";
import { Grid, LinearProgress } from "@mui/material";
import "./index.css";

export default function Logout() {
  const [logoutPending, setLogoutPending] = useState<boolean>(true);

  useEffect(() => {
    logoutUser();
  }, []);

  const onLogoutComplete = () => {
    setLogoutPending(false);
    setTimeout(() => (window.location.href = paths.Login), 2500);
  };

  const logoutUser = async () => {
    const cookie = new Cookies();
    cookie.remove("LoggedIn");
    await logout();
    onLogoutComplete();
  };

  return (
    <Grid id="logout-wrapper" container spacing={0} direction="column" alignItems="center">
      <div id="logout">
        <h1>{logoutPending ? "Logout pending" : "Logout complete"}</h1>
        {logoutPending ? (
          <LinearProgress sx={{ width: "100%" }} />
        ) : (
          <b style={{ paddingLeft: "10px" }}>Redirecting to login</b>
        )}
      </div>
    </Grid>
  );
}
