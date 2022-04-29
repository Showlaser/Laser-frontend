import { BrowserRouter, Route } from "react-router-dom";
import React from "react";
import routerPaths from "services/shared/router-paths";
import Dashboard from "pages/dashboard";
import LaserSettings from "pages/laser-settings/laser-settings";
import PatternEditor from "pages/pattern-editor";
import AnimationEditor from "pages/animation";
import Installation from "pages/installation";
import Login from "pages/login";
import SpotifyVote from "pages/spotify-vote";
import PasswordReset from "pages/password-reset";
import Account from "pages/account";
import AccountActivation from "pages/account-activation";

function routes() {
  return (
    <BrowserRouter>
      <Route exact path={routerPaths.Login} component={Login} />
      <Route exact path={routerPaths.Root} component={Dashboard} />
      <Route exact path={routerPaths.LaserSettings} component={LaserSettings} />
      <Route exact path={routerPaths.PatternEditor} component={PatternEditor} />
      <Route exact path={routerPaths.Installation} component={Installation} />
      <Route exact path={routerPaths.SpotifyVote} component={SpotifyVote} />
      <Route exact path={routerPaths.ResetPassword} component={PasswordReset} />
      <Route exact path={routerPaths.Account} component={Account} />
      <Route
        exact
        path={routerPaths.ActivateAccount}
        component={AccountActivation}
      />
      <Route
        exact
        path={routerPaths.LasershowEditor}
        component={AnimationEditor}
      />
    </BrowserRouter>
  );
}

export default routes;
