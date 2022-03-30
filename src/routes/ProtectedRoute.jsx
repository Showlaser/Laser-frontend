import React from "react";
import { Route, Redirect } from "react-router-dom";
import Cookies from "universal-cookie";
import paths from "services/shared/router-paths";

const ProtectedRoute = ({ component: Component, user, roles, ...rest }) => {
  const loggedIn = new Cookies()?.get("LoggedIn") !== undefined;

  return (
    <Route
      {...rest}
      render={(props) => {
        if (loggedIn) {
          return <Component {...rest} {...props} />;
        }

        return (
          <Redirect
            to={{
              pathname: paths.Login,
              state: {
                from: props.location,
              },
            }}
          />
        );
      }}
    />
  );
};

export default ProtectedRoute;
