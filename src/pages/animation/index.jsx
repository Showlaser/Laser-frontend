import {
  Button,
  List,
  ListItem,
  ListItemText,
  TextField,
  Slider,
} from "@material-ui/core";
import SideNav from "components/sidenav";
import "./index.css";
import PatternTimelineSection from "components/animation-editor/pattern-timeline-section";

export default function AnimationEditor() {
  const sideNavSettings = {
    pageName: "Animation editor",
  };

  const content = (
    <div>
      <PatternTimelineSection />
    </div>
  );

  return (
    <div>
      <SideNav content={content} settings={sideNavSettings} />
    </div>
  );
}
