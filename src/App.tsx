import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider, extendTheme, useColorScheme } from "@mui/material/styles";
import type {} from "@mui/x-tree-view/themeAugmentation";
import { Slide, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import Routes from "./routes/Routes";

const theme = extendTheme({
  colorSchemes: {
    light: {
      palette: {
        background: {
          default: "#ffffff",
          paper: "#ffffff",
        },
        primary: {
          main: "#485cdb",
        },
      },
    },
    dark: {
      palette: {
        background: {
          default: "#2b2b2b",
          paper: "#2b2b2b",
        },
        primary: {
          main: "#485cdb",
        },
      },
    },
  },
  components: {
    MuiSelect: {
      defaultProps: {
        variant: "standard",
      },
    },
    MuiTextField: {
      defaultProps: {
        variant: "standard",
      },
    },
    MuiTooltip: {
      defaultProps: {
        enterDelay: 750,
        TransitionProps: { timeout: 250 },
      },
    },
    MuiRichTreeView: {
      styleOverrides: {
        root: {
          backgroundColor: "red",
        },
      },
    },
    MuiPaper: {
      defaultProps: {
        elevation: 4,
      },
    },
    MuiButton: {
      styleOverrides: {
        // Static neon glow on primary buttons to match the sidenav accent
        // (#485cdb = rgb(72, 92, 219)). No animation.
        containedPrimary: {
          boxShadow: "0 0 12px rgba(72, 92, 219, 0.55)",
          "&:hover": {
            boxShadow: "0 0 18px rgba(72, 92, 219, 0.75)",
          },
        },
      },
    },
    MuiFormControlLabel: {
      styleOverrides: {
        label: {
          color: "var(--mui-palette-text-primary)",
        },
      },
    },
    MuiFormLabel: {
      styleOverrides: {
        root: {
          color: "var(--mui-palette-text-primary)",
        },
      },
    },
  },
});

function AppContent() {
  const { mode, systemMode } = useColorScheme();
  const resolvedMode = (mode === "system" ? systemMode : mode) ?? "dark";

  return (
    <div className="App">
      <Routes />
      <ToastContainer
        autoClose={6000}
        position="bottom-center"
        transition={Slide}
        theme={resolvedMode}
      />
    </div>
  );
}

function App() {
  return (
    <ThemeProvider theme={theme} defaultMode="dark">
      <CssBaseline />
      <AppContent />
    </ThemeProvider>
  );
}

export default App;
