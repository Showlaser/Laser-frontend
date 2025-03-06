import Account from "pages/account";
import AccountActivation from "pages/account-activation";
import AnimationEditor from "pages/animation-editor";
import Dashboard from "pages/dashboard";
import Disclaimer from "pages/disclaimer";
import Installation from "pages/installation";
import LasershowEditor from "pages/lasershow-editor";
import LasershowSpotifyConnector from "pages/lasershow-spotify-connector";
import Login from "pages/login";
import Logout from "pages/logout";
import PasswordReset from "pages/password-reset";
import PatternEditor from "pages/pattern-editor";
import Registration from "pages/registration";
import ShowlasersManager from "pages/showlasers-manager";
import SpotifyVote from "pages/spotify-vote";
import React from "react";
import { Route, Routes } from "react-router-dom";
import routerPaths from "services/shared/router-paths";

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
      <Route
        path={routerPaths.ShowlaserManager}
        element={<ShowlasersManager />}
      />
      <Route path={routerPaths.Logout} element={<Logout />} />
      <Route
        path={routerPaths.LasershowSpotifyConnector}
        element={<LasershowSpotifyConnector />}
      />
      <Route
        path={routerPaths.ActivateAccount}
        element={<AccountActivation />}
      />
      <Route path={routerPaths.AnimationEditor} element={<AnimationEditor />} />
      <Route path={routerPaths.LasershowEditor} element={<LasershowEditor />} />
    </Routes>
  );
}

export default routes;
