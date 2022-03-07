import { BrowserRouter, Route } from "react-router-dom";
import React from "react";
import routerPaths from "services/shared/router-paths";
import Dashboard from "pages/dashboard";
import LaserSettings from "pages/laser-settings/laser-settings";
import PatternEditor from "pages/pattern-editor";
import AnimationEditor from "pages/animation";
import Installation from "pages/installation";
import Login from "pages/login";
import ProtectedRoute from "./ProtectedRoute";

function routes() {
  return (
    <BrowserRouter>
      <Route exact path={routerPaths.Login} component={Login} />
      <ProtectedRoute exact path={routerPaths.Root} component={Dashboard} />
      <ProtectedRoute
        exact
        path={routerPaths.LaserSettings}
        component={LaserSettings}
      />
      <ProtectedRoute
        exact
        path={routerPaths.PatternEditor}
        component={PatternEditor}
      />
      <ProtectedRoute
        exact
        path={routerPaths.Installation}
        component={Installation}
      />
      <ProtectedRoute
        exact
        path={routerPaths.AnimationEditor}
        component={AnimationEditor}
      />
    </BrowserRouter>
  );
}

export default routes;
