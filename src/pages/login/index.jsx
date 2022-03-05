import { Button, Divider, FormControl, Grid, TextField } from "@mui/material";
import { login } from "services/logic/login-logic";
import routerPaths from "services/shared/router-paths";

export default function Login() {
  const onSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    login(formData);
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
          <TextField
            autoComplete="off"
            value="vincent"
            label="Username"
            name="username"
          />
          <br />
          <TextField
            label="Password"
            value="qwerty"
            type="password"
            name="password"
          />
          <br />
          <Button type="submit" fullWidth>
            Login
          </Button>
          <br />
          <Divider />
          <a className="link-btn" href={routerPaths.Register}>
            Register
          </a>
          <a className="link-btn" href={routerPaths.ForgotPassword}>
            Forgot password?
          </a>
        </FormControl>
      </form>
    </Grid>
  );
}
