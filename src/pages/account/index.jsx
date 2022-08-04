import {
  Button,
  FormControl,
  TextField,
  Grid,
  Divider,
  Alert,
  LinearProgress,
} from "@mui/material";
import Modal from "components/confirm-modal";
import Loading from "components/shared/loading";
import SideNav from "components/shared/sidenav";
import { useCallback, useEffect, useState } from "react";
import {
  getCurrentUser,
  removeUser,
  updateUser,
} from "services/logic/user-logic";
import { getFormDataFromEvent } from "services/shared/form-data-helper";
import { deepClone, stringIsEmpty } from "services/shared/general";
import { showError, toastSubject } from "services/shared/toast-messages";

export default function Account() {
  const [userData, setUserData] = useState(undefined);
  const [emailChanged, setEmailChanged] = useState(false);
  const [submitInProgress, setSubmitInProgress] = useState(false);
  const [, updateState] = useState();
  const forceUpdate = useCallback(() => updateState({}), []);
  const [modalOptions, setModalOptions] = useState({
    title: "Remove account?",
    show: false,
    onOkClick: null,
    onCancelClick: null,
  });

  const sideNavSettings = { pageName: "Account" };

  useEffect(() => {
    getCurrentUser().then((user) => setUserData(user));
  }, []);

  const closeModal = () => {
    let modal = modalOptions;
    modal.show = false;
    setModalOptions(modal);
    forceUpdate();
  };

  const onSubmit = (e) => {
    e.preventDefault();
    setSubmitInProgress(true);
    let formData = getFormDataFromEvent(e);
    const passwordShouldBeUpdated =
      !stringIsEmpty(formData.newPassword) &&
      !stringIsEmpty(formData.newPasswordRepeat);

    if (passwordShouldBeUpdated) {
      const passwordsMatch =
        formData.newPasswordRepeat === formData.newPassword;
      if (!passwordsMatch) {
        showError(toastSubject.passwordsDoNotMatch);
        setSubmitInProgress(false);
        return;
      }
    }

    updateUser(formData).then((result) => {
      if (result.status === 401) {
        showError(toastSubject.invalidPassword);
      }
      setSubmitInProgress(false);
    });
  };

  const content = (
    <Loading objectToLoad={userData}>
      <Modal modal={modalOptions} />
      <Grid
        key={userData?.email}
        container
        spacing={0}
        direction="column"
        alignItems="center"
        justifyContent="center"
        style={{ minHeight: "70vh" }}
      >
        <form
          onSubmit={onSubmit}
          style={{ maxWidth: "40vh", textAlign: "center" }}
        >
          <TextField
            fullWidth
            label="Username"
            defaultValue={userData?.username}
            name="username"
            required
          />
          <TextField
            fullWidth
            label="Email"
            type="email"
            name="email"
            defaultValue={userData?.email}
            required
            onChange={(e) => {
              userData?.email !== e.target.value
                ? setEmailChanged(true)
                : setEmailChanged(false);
            }}
          />
          <TextField
            fullWidth
            type="password"
            name="newPassword"
            label="New password"
          />
          <TextField
            fullWidth
            name="repeatPassword"
            type="password"
            label="Repeat password"
            name="newPasswordRepeat"
          />
          <br />
          <Divider style={{ width: "100%" }} />
          <TextField
            required
            fullWidth
            name="password"
            type="password"
            label="Current password"
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
          <Button
            type="submit"
            variant="contained"
            disabled={submitInProgress}
            fullWidth
            type="submit"
          >
            Update account
          </Button>
          {submitInProgress ? <LinearProgress /> : null}
          <hr style={{ width: "100%" }} />
          <Button
            color="error"
            variant="text"
            onClick={() => {
              let options = deepClone(modalOptions);
              options.show = true;
              options.onCancelClick = closeModal;
              options.onOkClick = removeUser;
              setModalOptions(options);
              forceUpdate();
            }}
          >
            Remove account
          </Button>
        </form>
      </Grid>
    </Loading>
  );

  return <SideNav content={content} settings={sideNavSettings} />;
}
