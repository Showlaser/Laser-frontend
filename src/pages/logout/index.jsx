import paths from "services/shared/router-paths";
import Cookies from "universal-cookie";

export default function Logout() {
  const cookie = new Cookies();
  cookie.remove("LoggedIn");
  window.location = paths.Login;

  return null;
}
