import * as React from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
type Anchor = "top" | "left" | "bottom" | "right";
type Props = {
  location: Anchor;
  children: any;
  button: React.ReactElement;
  forceClose?: boolean;
};

export default function TemporaryDrawer({
  location,
  children,
  button,
  forceClose,
}: Props) {
  const [state, setState] = React.useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
  });

  React.useEffect(() => {
    if (forceClose) {
      toggleDrawer(location, false);
    }
  }, [forceClose]);

  const toggleDrawer = (anchor: Anchor, open: boolean) => {
    setState({ ...state, [anchor]: open });
  };

  const list = (anchor: Anchor) => (
    <Box
      sx={{ width: anchor === "top" || anchor === "bottom" ? "auto" : 250 }}
      role="presentation"
    >
      <List>{children}</List>
    </Box>
  );

  return (
    <div>
      {([location] as const).map((anchor) => (
        <React.Fragment key={anchor}>
          {React.cloneElement(button, {
            onClick: () => toggleDrawer(anchor, true),
          })}
          <Drawer
            anchor={anchor}
            open={state[anchor]}
            onClose={() => toggleDrawer(anchor, false)}
          >
            {list(anchor)}
          </Drawer>
        </React.Fragment>
      ))}
    </div>
  );
}