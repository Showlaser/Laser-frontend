import React from "react";
import "./App.css";
import { createTheme, ThemeProvider } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import Routes from "./routes/Routes";
import { Slide, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const theme = React.useMemo(() =>
    createTheme({
      palette: {
        type: "dark",
      },
    })
  );

  return (
    <div className="App">
      <ToastContainer
        autoClose={6000}
        position="bottom-center"
        transition={Slide}
        theme="dark"
      />
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Routes />
      </ThemeProvider>
    </div>
  );
}

export default App;
