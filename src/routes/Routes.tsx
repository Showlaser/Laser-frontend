import { Routes, Route } from "react-router-dom";
import React from "react";
import routerPaths from "services/shared/router-paths";
import PatternEditor from "pages/pattern-editor";
import AnimationEditor from "pages/animation-editor";
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
import Dashboard from "pages/dashboard";
import LasershowEditor from "pages/lasershow-editor";
import SafetyZones from "pages/safety-zones";

function routes() {
  return (
    <Routes>
      <Route path={routerPaths.Login} element={<Login />} />
      <Route path={routerPaths.Dashboard} element={<Dashboard />} />
      <Route path={routerPaths.PatternEditor} element={<PatternEditor />} />
      <Route path={routerPaths.Installation} element={<Installation />} />
      <Route path={routerPaths.SpotifyVote} element={<SpotifyVote />} />
      <Route path={routerPaths.ResetPassword} element={<PasswordReset />} />
      <Route path={routerPaths.Disclaimer} element={<Disclaimer />} />
      <Route path={routerPaths.Account} element={<Account />} />
      <Route path={routerPaths.Registration} element={<Registration />} />
      <Route path={routerPaths.Logout} element={<Logout />} />
      <Route path={routerPaths.LasershowSpotifyConnector} element={<LasershowSpotifyConnector />} />
      <Route path={routerPaths.ActivateAccount} element={<AccountActivation />} />
      <Route path={routerPaths.AnimationEditor} element={<AnimationEditor />} />
      <Route path={routerPaths.LasershowEditor} element={<LasershowEditor />} />
      <Route path={routerPaths.SafetyZones} element={<SafetyZones />} />
    </Routes>
  );
}

export default routes;
