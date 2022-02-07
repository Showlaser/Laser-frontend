import { BrowserRouter, Route } from "react-router-dom";
import React from "react";
import routerPaths from "services/shared/router-paths";
import Dashboard from "pages/dashboard";
import LaserSettings from "pages/laser-settings/laser-settings";
import PatternEditor from "pages/pattern-editor";
import AnimationEditor from "pages/animation";
import Installation from "pages/installation";

function routes() {
  return (
    <BrowserRouter>
      <Route exact path={routerPaths.Root} component={Dashboard} />
      <Route exact path={routerPaths.LaserSettings} component={LaserSettings} />
      <Route exact path={routerPaths.PatternEditor} component={PatternEditor} />
      <Route exact path={routerPaths.Installation} component={Installation} />
      <Route
        exact
        path={routerPaths.AnimationEditor}
        component={AnimationEditor}
      />
    </BrowserRouter>
  );
}

export default routes;
