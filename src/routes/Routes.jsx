import { BrowserRouter, Route } from "react-router-dom";
import React from "react";
import routerPaths from "services/shared/router-paths";
import Dashboard from "pages/dashboard";
import PatternEditor from "pages/pattern-editor";
import AnimationEditor from "pages/animation";
import Installation from "pages/installation";
import Login from "pages/login";
import SpotifyVote from "pages/spotify-vote";
import PasswordReset from "pages/password-reset";
import Account from "pages/account";
import AccountActivation from "pages/account-activation";
import Registration from "pages/registration";
import LasershowSpotifyConnector from "pages/lasershow-spotify-connector";
import Logout from "pages/logout";
import Disclaimer from "pages/disclaimer";
import Settings from "pages/settings";
import CanvasTest from "pages/canvas-test";

function routes() {
  return (
    <BrowserRouter>
      <Route exact path={routerPaths.Login} component={Login} />
      <Route exact path={routerPaths.Root} component={Dashboard} />
      <Route exact path={routerPaths.Settings} component={Settings} />
      <Route exact path={routerPaths.PatternEditor} component={PatternEditor} />
      <Route exact path={routerPaths.Installation} component={Installation} />
      <Route exact path={routerPaths.SpotifyVote} component={SpotifyVote} />
      <Route exact path={routerPaths.ResetPassword} component={PasswordReset} />
      <Route exact path={routerPaths.Disclaimer} component={Disclaimer} />
      <Route exact path={routerPaths.Account} component={Account} />
      <Route exact path={routerPaths.Registration} component={Registration} />
      <Route exact path={routerPaths.Logout} component={Logout} />
      <Route exact path={routerPaths.LasershowSpotifyConnector} component={LasershowSpotifyConnector} />
      <Route exact path={routerPaths.ActivateAccount} component={AccountActivation} />
      <Route exact path={routerPaths.AnimationEditor} component={AnimationEditor} />
      <Route exact path={routerPaths.CanvasTest} component={CanvasTest} />
    </BrowserRouter>
  );
}

export default routes;
