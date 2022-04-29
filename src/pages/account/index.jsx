import {
  Button,
  FormControl,
  TextField,
  Grid,
  Divider,
  Alert,
} from "@mui/material";
import Loading from "components/shared/loading";
import SideNav from "components/sidenav";
import { useEffect, useState } from "react";
import { getCurrentUser, updateUser } from "services/logic/user-logic";
import { stringIsEmpty } from "services/shared/general";
import { showError, toastSubject } from "services/shared/toast-messages";

export default function Account() {
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordRepeat, setNewPasswordRepeat] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [currentEmail, setCurrentEmail] = useState("");
  const [emailChanged, setEmailChanged] = useState(false);
  const [buttonDisabled, setButtonDisabled] = useState(false);

  const sideNavSettings = { pageName: "Account" };

  useEffect(() => {
    getCurrentUser().then((user) => {
      setUsername(user.username);
      setEmail(user.email);
      setCurrentEmail(user.email);
    });
  }, []);

  const passwordsMatch = () => {
    return newPassword === newPasswordRepeat;
  };

  const onUpdate = () => {
    setButtonDisabled(true);
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
        setButtonDisabled(false);
        return;
      }
      accountModel.newPassword = newPassword;
    }

    updateUser(accountModel).then((result) => {
      if (result.status === 401) {
        showError(toastSubject.invalidPassword);
      }
      setButtonDisabled(false);
    });
    setButtonDisabled(false);
  };

  const content = (
    <Loading objectToLoad={username}>
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
            type="email"
            value={email}
            required
            onChange={(e) => {
              currentEmail !== e.target.value
                ? setEmailChanged(true)
                : setEmailChanged(false);
              setEmail(e.target.value);
            }}
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
          <span hidden={!emailChanged}>
            <Alert severity="warning">
              Warning if you change your email, you have to revalidate your
              email, make sure you entered the right email address otherwise you
              will lose access to your account!
            </Alert>
          </span>
          <br />
          <Button disabled={buttonDisabled} fullWidth onClick={onUpdate}>
            Update account
          </Button>
        </FormControl>
      </Grid>
    </Loading>
  );

  return <SideNav content={content} settings={sideNavSettings} />;
}