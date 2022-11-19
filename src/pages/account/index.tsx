import { Button, TextField, Grid, Divider, Alert, LinearProgress, Fade, Modal, Paper } from "@mui/material";
import SideNav from "components/shared/sidenav";
import { User } from "models/components/shared/user";
import React from "react";
import { useEffect, useState } from "react";
import { getCurrentUser, removeUser, updateUser } from "services/logic/user-logic";
import { getFormDataFromEvent } from "services/shared/form-data-helper";
import { stringIsEmpty } from "services/shared/general";
import { showError, toastSubject } from "services/shared/toast-messages";
import CloseIcon from "@mui/icons-material/Close";

export default function Account() {
  const [userData, setUserData] = useState<User | undefined>(undefined);
  const [emailChanged, setEmailChanged] = useState<boolean>(false);
  const [submitInProgress, setSubmitInProgress] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);

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

  const content = (
    <Grid
      key={userData?.email}
      container
      spacing={0}
      direction="column"
      alignItems="center"
      justifyContent="center"
      style={{ minHeight: "70vh" }}
    >
      <Modal open={showModal}>
        <Grid
          container
          spacing={0}
          direction="column"
          alignItems="center"
          justifyContent="center"
          style={{ minHeight: "100vh" }}
        >
          <Paper sx={{ textAlign: "left", width: "60%", padding: "5px 20px 5px 20px" }}>
            <h3>Are you sure you want to delete your account?</h3>
            <p>Your account cannot be restored!</p>
            <Divider />
            <br />
            <div style={{ float: "right" }}>
              <Button variant="text" onClick={() => setShowModal(false)}>
                Cancel
              </Button>
              <Button variant="contained" color="primary" onClick={removeUser} style={{ marginLeft: "5px" }}>
                Ok
              </Button>
            </div>
          </Paper>
        </Grid>
      </Modal>
      <form onSubmit={onSubmit} style={{ maxWidth: "40vh", textAlign: "center" }}>
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
        <Fade
          in={emailChanged}
          timeout={1000}
          style={{ transitionDelay: "500ms", display: emailChanged ? "block" : "none" }}
        >
          <Alert severity="warning">
            Warning if you change your email, you have to revalidate your email, make sure you entered the right email
            address otherwise you will lose access to your account!
          </Alert>
        </Fade>
        <br />
        <Button type="submit" variant="contained" disabled={submitInProgress} fullWidth>
          Update account
        </Button>
        {submitInProgress ? <LinearProgress /> : null}
        <hr style={{ width: "100%" }} />
        <Button color="error" variant="text" onClick={() => setShowModal(true)}>
          Remove account
        </Button>
      </form>
    </Grid>
  );

  return <SideNav children={content} pageName="Account" />;
}
