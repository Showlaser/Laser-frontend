import * as React from "react";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import DashboardIcon from "@mui/icons-material/Dashboard";
import AllInclusiveIcon from "@mui/icons-material/AllInclusive";
import SettingsIcon from "@mui/icons-material/Settings";
import paths from "services/shared/router-paths";
import ThumbsUpDownIcon from "@mui/icons-material/ThumbsUpDown";
import TheatersIcon from "@mui/icons-material/Theaters";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import "./index.css";
import SettingsInputComponentIcon from "@mui/icons-material/SettingsInputComponent";
import LogoutIcon from "@mui/icons-material/Logout";
import SpotifyController from "../spotify-controller";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  AccordionSummaryProps,
  Grid,
  ListItemButton,
} from "@mui/material";
import Button from "@mui/material/Button";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

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
  pageName: string;
  children: React.ReactNode;
};

export default function SideNav({ pageName, children }: Props) {
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <Box sx={{ display: "flex" }}>
      <AppBar position="fixed" open={open}>
        <Toolbar>
          <Grid container direction="row" spacing={2} alignItems="center">
            <Grid item xs>
              <Grid display="flex" justifyContent="flex-start" alignItems="center">
                <IconButton
                  color="inherit"
                  aria-label="open drawer"
                  onClick={handleDrawerOpen}
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
                <Button fullWidth color="error" onClick={() => alert("I do nothing, so no emergency stop! 🙃")}>
                  Emergency stop
                </Button>
              </Grid>
            </Grid>
            <Grid item xs container direction="column">
              <Grid display="flex" justifyContent="flex-end">
                <SpotifyController />
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
            backgroundColor: "#22334f",
          },
        }}
        variant="persistent"
        anchor="left"
        open={open}
      >
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === "ltr" ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
          {[
            { title: "Dashboard", icon: <DashboardIcon />, path: paths.Dashboard },
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
              title: "Lasershow Spotify connector",
              icon: <SettingsInputComponentIcon />,
              path: paths.LasershowSpotifyConnector,
            },
            {
              title: "Settings",
              icon: <SettingsIcon />,
              path: paths.Settings,
            },
            {
              title: "Account",
              icon: <AccountCircleIcon />,
              path: paths.Account,
            },
            {
              title: "Logout",
              icon: <LogoutIcon />,
              path: paths.Logout,
            },
          ].map((item, index) => (
            <ListItemButton onClick={() => (window.location.href = item.path)} key={`side-nav-list-item-${index}`}>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.title} />
            </ListItemButton>
          ))}
        </List>
      </Drawer>
      <Main id="menu-children" open={open} style={{ marginTop: "50px" }}>
        {children}
      </Main>
    </Box>
  );
}
