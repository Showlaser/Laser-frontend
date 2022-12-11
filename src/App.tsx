import React from "react";
import "./App.css";
import Routes from "./routes/Routes";
import CssBaseline from "@mui/material/CssBaseline";
import { Slide, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ThemeProvider, createTheme } from "@mui/material/styles";

interface Events {
  onKeyDown: (e: React.KeyboardEvent) => void;
}

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
        },
      }),
    []
  );

  return (
    <div className="App">
      <ToastContainer autoClose={6000} position="bottom-center" transition={Slide} theme="dark" />
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Routes />
      </ThemeProvider>
    </div>
  );
}

export default App;
