import AllInclusiveIcon from "@mui/icons-material/AllInclusive";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import DashboardIcon from "@mui/icons-material/Dashboard";
import HiveIcon from "@mui/icons-material/Hive";
import MenuIcon from "@mui/icons-material/Menu";
import MovieIcon from "@mui/icons-material/Movie";
import TheatersIcon from "@mui/icons-material/Theaters";
import ThumbsUpDownIcon from "@mui/icons-material/ThumbsUpDown";
import { Alert, Fade, Grid, ListItemButton } from "@mui/material";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { styled, useTheme } from "@mui/material/styles";
import Toolbar from "@mui/material/Toolbar";
import * as React from "react";
import { Link } from "react-router-dom";
import paths from "services/shared/router-paths";
import { showError, toastSubject } from "services/shared/toast-messages";
import AccountPopover from "../account-popover";
import NotificationPopover from "../notification-popover";
import { OnTrue } from "../on-true";
import SpotifyController from "../spotify-controller";
import "./index.css";

const drawerWidth = 240;

const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })<{
  open?: boolean;
}>(({ theme, open }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  transition: theme.transitions.create("margin", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginLeft: `-${drawerWidth}px`,
  ...(open && {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  }),
}));

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})<AppBarProps>(({ theme, open }) => ({
  backgroundColor: "rgba(72, 92, 219, 0.8)",
  transition: theme.transitions.create(["margin", "width"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: "flex-end",
}));

type Props = {
  pageName?: string;
  children?: React.ReactNode;
  unsavedChanges?: boolean;
};

export default function SideNav({
  pageName,
  children,
  unsavedChanges = false,
}: Props) {
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const getListItemBackgroundColor = (title: string) => {
    if (unsavedChanges) {
      return title !== pageName
        ? "rgba(255, 0, 0, 0.6)"
        : "rgba(0, 255, 0, 0.6)";
    }

    return undefined;
  };

  return (
    <Box sx={{ display: "flex" }}>
      <AppBar position="fixed" open={open}>
        <Toolbar variant="dense">
          <Grid container direction="row" spacing={2} alignItems="center">
            <Grid item xs>
              <Grid
                display="flex"
                justifyContent="flex-start"
                alignItems="center"
              >
                <IconButton
                  color="inherit"
                  aria-label="open drawer"
                  onClick={() => handleDrawerOpen()}
                  edge="start"
                  sx={{ mr: 2, ...(open && { display: "none" }) }}
                >
                  <MenuIcon />
                </IconButton>
                {pageName}
              </Grid>
            </Grid>
            <Grid item xs container direction="column">
              <Grid display="flex" justifyContent="center">
                <Button
                  style={{ color: "whitesmoke" }}
                  variant="contained"
                  onClick={() => showError(toastSubject.notImplemented)}
                >
                  Emergency stop
                </Button>
              </Grid>
            </Grid>
            <Grid item xs container direction="column">
              <Grid display="flex" justifyContent="flex-end">
                <NotificationPopover />
                <SpotifyController />
                <AccountPopover />
              </Grid>
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
        variant="persistent"
        anchor="left"
        open={open}
      >
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === "ltr" ? (
              <ChevronLeftIcon />
            ) : (
              <ChevronRightIcon />
            )}
          </IconButton>
        </DrawerHeader>
        <OnTrue onTrue={unsavedChanges}>
          <Alert severity="warning">
            Your current page has unsaved changes!
          </Alert>
        </OnTrue>
        <Divider />
        <List>
          {[
            {
              title: "Dashboard",
              icon: <DashboardIcon />,
              path: paths.Dashboard,
            },
            {
              title: "Lasershow editor",
              icon: <MovieIcon />,
              path: paths.LasershowEditor,
            },
            {
              title: "Animation editor",
              icon: <TheatersIcon />,
              path: paths.AnimationEditor,
            },
            {
              title: "Pattern editor",
              icon: <AllInclusiveIcon />,
              path: paths.PatternEditor,
            },
            {
              title: "Vote",
              icon: <ThumbsUpDownIcon />,
              path: paths.SpotifyVote,
            },
            {
              title: "Showlaser manager",
              icon: <HiveIcon />,
              path: paths.ShowlaserManager,
            },
          ].map((item, index) => (
            <ListItemButton
              style={{
                backgroundColor: getListItemBackgroundColor(item.title),
              }}
              key={`side-nav-list-item-${index}`}
              component={Link}
              to={item.path}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.title} />
            </ListItemButton>
          ))}
        </List>
      </Drawer>
      <Main id="menu-children" open={open} style={{ marginTop: "50px" }}>
        <Fade in={true} timeout={1000}>
          <span>{children}</span>
        </Fade>
      </Main>
    </Box>
  );
}
