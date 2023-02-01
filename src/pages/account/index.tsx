import {
  Button,
  TextField,
  Divider,
  Alert,
  LinearProgress,
  Fade,
  Paper,
  useTheme,
  FormControlLabel,
  FormGroup,
  Switch,
  Tooltip,
  Skeleton,
} from "@mui/material";
import SpotifyLogin from "components/settings/spotify-login";
import DeleteModal, { ModalOptions } from "components/shared/delete-modal";
import SideNav from "components/shared/sidenav";
import { User } from "models/components/shared/user";
import React, { useEffect, useState } from "react";
import { getCurrentUser, removeUser, updateUser } from "services/logic/user-logic";
import { getFormDataFromEvent } from "services/shared/form-data-helper";
import { stringIsEmpty } from "services/shared/general";
import { showError, toastSubject } from "services/shared/toast-messages";
import { dataSavingIsEnabled, setDataSaving } from "services/shared/user-settings";

export default function Account() {
  const [userData, setUserData] = useState<User | undefined>(undefined);
  const [emailChanged, setEmailChanged] = useState<boolean>(false);
  const [submitInProgress, setSubmitInProgress] = useState<boolean>(false);
  const [modalOptions, setModalOptions] = useState<ModalOptions>({
    show: false,
    onDelete: removeUser,
    title: "Are you sure you want to remove your account?",
  });

  useEffect(() => {
    getCurrentUser().then((user: User) => setUserData(user));
  }, []);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitInProgress(true);
    let formData: any = getFormDataFromEvent(e);
    const passwordShouldBeUpdated =
      !stringIsEmpty(formData?.newPassword) && !stringIsEmpty(formData?.newPasswordRepeat);

    if (passwordShouldBeUpdated) {
      const passwordsMatch = formData.newPasswordRepeat === formData.newPassword;
      if (!passwordsMatch) {
        showError(toastSubject.passwordsDoNotMatch);
        setSubmitInProgress(false);
        return;
      }
    }

    updateUser(formData).then((result: any) => {
      if (result.status === 401) {
        showError(toastSubject.invalidPassword);
      }
      setSubmitInProgress(false);
    });
  };

  const getSectionComponent = (text: string, children: any) => (
    <Paper style={{ padding: "15px", marginBottom: "15px" }}>
      <h2 style={{ color: "whitesmoke", marginBottom: "2px", marginTop: "0", textAlign: "center" }}>{text}</h2>
      <Divider style={{ marginBottom: "15px" }} />
      {children}
    </Paper>
  );

  return (
    <SideNav pageName="Account">
      <div style={{ width: "100%" }}>
        <div style={{ width: "50vh", margin: "0 auto" }}>
          <DeleteModal modalOptions={modalOptions} setModalOptions={setModalOptions} />
          {getSectionComponent(
            "Account",
            userData === undefined ? (
              <Skeleton
                style={{ marginTop: "-50px", marginBottom: "-50px" }}
                animation="wave"
                width="37vh"
                height="50vh"
              />
            ) : (
              <form key={userData?.username} onSubmit={onSubmit} style={{ textAlign: "center" }}>
                <TextField fullWidth label="Username" defaultValue={userData?.username} name="username" required />
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  name="email"
                  defaultValue={userData?.email}
                  required
                  onChange={(e) => {
                    userData?.email !== e.target.value ? setEmailChanged(true) : setEmailChanged(false);
                  }}
                />
                <TextField fullWidth type="password" name="newPassword" label="New password" />
                <TextField fullWidth type="password" label="Repeat password" name="newPasswordRepeat" />
                <br />
                <Divider style={{ width: "100%" }} />
                <TextField required fullWidth name="password" type="password" label="Current password" />
                <br />
                <Fade in={emailChanged} timeout={1000} style={{ display: emailChanged ? "block" : "none" }}>
                  <Alert severity="warning">
                    Warning if you change your email, you have to revalidate your email, make sure you entered the right
                    email address otherwise you will lose access to your account!
                  </Alert>
                </Fade>
                <br />
                <Button type="submit" variant="contained" disabled={submitInProgress} fullWidth>
                  Update account
                </Button>
                {submitInProgress ? <LinearProgress /> : null}
                <Button
                  style={{ marginTop: "15px" }}
                  fullWidth
                  color="error"
                  size="small"
                  variant="text"
                  onClick={() => {
                    let updatedModalOptions = { ...modalOptions };
                    updatedModalOptions.show = true;
                    setModalOptions(updatedModalOptions);
                  }}
                >
                  Remove account
                </Button>
              </form>
            )
          )}
          {getSectionComponent("Settings", <SpotifyLogin />)}
          {getSectionComponent(
            "Data saving",
            <FormGroup>
              <Tooltip
                placement="right-start"
                title="Turning this on will limit network requests to external services (like Spotify) to save network data"
              >
                <FormControlLabel
                  control={
                    <Switch defaultChecked={dataSavingIsEnabled()} onChange={(e) => setDataSaving(e.target.checked)} />
                  }
                  label="Enable data saving"
                />
              </Tooltip>
            </FormGroup>
          )}
        </div>
      </div>
    </SideNav>
  );
}
