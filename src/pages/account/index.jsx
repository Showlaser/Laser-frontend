import { Button, FormControl, TextField, Grid, Divider } from "@mui/material";
import SideNav from "components/sidenav";
import { useEffect, useState } from "react";
import { getCurrentUser, updateUser } from "services/logic/user-logic";
import { stringIsEmpty } from "services/shared/general";
import {
  showError,
  showSuccess,
  toastSubject,
} from "services/shared/toast-messages";

export default function Account() {
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordRepeat, setNewPasswordRepeat] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [buttonDisabled, setButtonDisabled] = useState(false);

  const sideNavSettings = { pageName: "Account" };

  useEffect(() => {
    getCurrentUser().then((user) => {
      setUsername(user.username);
      setEmail(user.email);
    });
  }, []);

  const passwordsMatch = () => {
    return newPassword === newPasswordRepeat;
  };

  const onUpdate = () => {
    const passwordShouldBeUpdated =
      !stringIsEmpty(newPassword) && !stringIsEmpty(newPasswordRepeat);
    let accountModel = {
      username,
      password: currentPassword,
      email,
    };

    if (passwordShouldBeUpdated) {
      if (!passwordsMatch()) {
        showError(toastSubject.passwordsDoNotMatch);
        return;
      }
      accountModel.newPassword = newPassword;
    }

    updateUser(accountModel).then((status) => {
      if (status.statusCode === 200) {
        showSuccess(toastSubject.changesSaved);
      }
    });
  };

  const content = (
    <Grid
      container
      spacing={0}
      direction="column"
      alignItems="center"
      justifyContent="center"
      style={{ minHeight: "70vh" }}
    >
      <FormControl
        style={{ width: "50%", maxWidth: "40vh" }}
        key="user-account"
      >
        <TextField
          fullWidth
          label="Username"
          value={username}
          required
          onChange={(e) => setUsername(e.target.value)}
        />
        <TextField
          fullWidth
          label="Email"
          value={email}
          required
          onChange={(e) => setEmail(e.target.value)}
        />
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
        <Divider style={{ width: "100%" }} />
        <TextField
          required
          fullWidth
          type="password"
          label="Current password"
          onChange={(e) => setCurrentPassword(e.target.value)}
        />
        <br />
        <Button disabled={buttonDisabled} fullWidth onClick={onUpdate}>
          Update account
        </Button>
      </FormControl>
    </Grid>
  );

  return <SideNav content={content} settings={sideNavSettings} />;
}
