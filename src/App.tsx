import React from "react";
import "./App.css";
import Routes from "./routes/Routes";
import CssBaseline from "@mui/material/CssBaseline";
import { Slide, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import type {} from "@mui/x-tree-view/themeAugmentation";

function App() {
  const theme = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode: "dark",
          ...{
            background: {
              default: "#2b2b2b",
              paper: "#2b2b2b",
            },
          },
          primary: {
            main: "#485cdb",
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
        },
      }),
    []
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className="App">
        <Routes />
        <ToastContainer autoClose={6000} position="bottom-center" transition={Slide} theme="dark" />
      </div>
    </ThemeProvider>
  );
}

export default App;
