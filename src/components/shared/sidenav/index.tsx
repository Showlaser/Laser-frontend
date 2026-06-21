import AnimationIcon from "@mui/icons-material/Animation";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import DashboardIcon from "@mui/icons-material/Dashboard";
import DeviceHubIcon from "@mui/icons-material/DeviceHub";
import FlareIcon from "@mui/icons-material/Flare";
import MenuIcon from "@mui/icons-material/Menu";
import MovieFilterIcon from "@mui/icons-material/MovieFilter";
import PolylineIcon from "@mui/icons-material/Polyline";
import ReportIcon from "@mui/icons-material/Report";
import { Alert, Fade, ListItemButton } from "@mui/material";
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
import { Link, useLocation } from "react-router-dom";
import paths from "services/shared/router-paths";
import { showError, toastSubject } from "services/shared/toast-messages";
import LightMode from "../../settings/light-mode";
import AccountPopover from "../account-popover";
import NotificationPopover from "../notification-popover";
import { OnTrue } from "../on-true";
import SpotifyController from "../spotify-controller";
import "./index.css";

const drawerWidth = 240;
// Neon accent shared by the app bar and the active nav item (matches theme primary).
const ACCENT = "#485cdb";

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
  backgroundColor: ACCENT,
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
  justifyContent: "space-between",
}));

type Props = {
  pageName?: string;
  children?: React.ReactNode;
  unsavedChanges?: boolean;
};

export default function SideNav({ pageName, children, unsavedChanges = false }: Props) {
  const theme = useTheme();
  const location = useLocation();
  const [open, setOpen] = React.useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  // When there are unsaved changes, warn the user by tinting the active page
  // green and every other destination red (clicking away would lose work).
  const getUnsavedColor = (isActive: boolean) => {
    if (!unsavedChanges) {
      return undefined;
    }

    return isActive ? "rgba(0, 255, 0, 0.6)" : "rgba(255, 0, 0, 0.6)";
  };

  return (
    <Box sx={{ display: "flex" }}>
      <AppBar position="fixed" open={open}>
        <Toolbar variant="dense">
          <Box sx={{ display: "flex", alignItems: "center", width: "100%", gap: 2 }}>
            <Box sx={{ flex: 1, display: "flex", justifyContent: "flex-start", alignItems: "center" }}>
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
            </Box>
            <Box sx={{ flex: 1, display: "flex", justifyContent: "center" }}>
              <Button
                startIcon={<ReportIcon />}
                style={{ color: "whitesmoke" }}
                variant="contained"
                onClick={() => showError(toastSubject.notImplemented)}
              >
                Emergency stop
              </Button>
            </Box>
            <Box sx={{ flex: 1, display: "flex", justifyContent: "flex-end", alignItems: "center" }}>
              <LightMode />
              <NotificationPopover />
              <SpotifyController />
              <AccountPopover />
            </Box>
          </Box>
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
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, pl: 1 }}>
            <FlareIcon
              sx={{
                color: ACCENT,
                filter: `drop-shadow(0 0 6px ${ACCENT})`,
              }}
            />
            <Box
              component="span"
              sx={{
                fontWeight: 700,
                fontSize: "0.8rem",
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "text.primary",
              }}
            >
              Laser Controller
            </Box>
          </Box>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === "ltr" ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
        </DrawerHeader>
        <OnTrue onTrue={unsavedChanges}>
          <Alert severity="warning">Your current page has unsaved changes!</Alert>
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
              icon: <MovieFilterIcon />,
              path: paths.LasershowEditor,
            },
            {
              title: "Animation editor",
              icon: <AnimationIcon />,
              path: paths.AnimationEditor,
            },
            {
              title: "Pattern editor",
              icon: <PolylineIcon />,
              path: paths.PatternEditor,
            },
            {
              title: "Showlaser manager",
              icon: <DeviceHubIcon />,
              path: paths.ShowlaserManager,
            },
          ].map((item, index) => {
            const isActive = location.pathname === item.path;
            const unsavedColor = getUnsavedColor(isActive);

            return (
              <ListItemButton
                key={`side-nav-list-item-${index}`}
                component={Link}
                to={item.path}
                sx={{
                  position: "relative",
                  mx: 1,
                  my: 0.5,
                  borderRadius: 2,
                  overflow: "hidden",
                  transition: "background 0.2s ease, box-shadow 0.2s ease",
                  ...(isActive && {
                    background: `linear-gradient(90deg, ${ACCENT}40 0%, ${ACCENT}0d 50%, ${ACCENT}40 100%)`,
                    backgroundSize: "200% 100%",
                    boxShadow: `0 0 12px ${ACCENT}55`,
                    animation: "sidenav-breathe 3.2s ease-in-out infinite",
                    "&::before": {
                      content: '""',
                      position: "absolute",
                      left: 0,
                      top: 8,
                      bottom: 8,
                      width: 4,
                      borderRadius: 4,
                      backgroundColor: ACCENT,
                      boxShadow: `0 0 8px ${ACCENT}, 0 0 4px ${ACCENT}`,
                      animation: "sidenav-breathe-bar 3.2s ease-in-out infinite",
                    },
                    // Respect users who prefer fewer animations: keep the static glow.
                    "@media (prefers-reduced-motion: reduce)": {
                      animation: "none",
                      "&::before": { animation: "none" },
                    },
                  }),
                  "&:hover": {
                    background: isActive
                      ? `linear-gradient(90deg, ${ACCENT}59 0%, ${ACCENT}1a 100%)`
                      : "rgba(127, 127, 127, 0.12)",
                  },
                  // Unsaved-changes warning takes precedence over the accent styling.
                  ...(unsavedColor && { backgroundColor: unsavedColor }),
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 40,
                    color: isActive ? ACCENT : "text.secondary",
                    transition: "color 0.2s ease",
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.title}
                  sx={{
                    "& .MuiListItemText-primary": {
                      color: isActive ? ACCENT : "text.primary",
                      fontWeight: isActive ? 600 : 400,
                    },
                  }}
                />
                <OnTrue onTrue={isActive}>
                  <ChevronRightIcon sx={{ fontSize: 18, color: ACCENT, opacity: 0.8 }} />
                </OnTrue>
              </ListItemButton>
            );
          })}
        </List>
        <Box
          sx={{
            mt: "auto",
            p: 2,
            textAlign: "center",
            fontSize: "0.7rem",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "text.secondary",
            opacity: 0.5,
          }}
        >
          Laser Controller · v{__APP_VERSION__}
        </Box>
      </Drawer>
      <Main id="menu-children" open={open} style={{ marginTop: "50px" }}>
        <Fade in={true} timeout={1000}>
          <span>{children}</span>
        </Fade>
      </Main>
    </Box>
  );
}
