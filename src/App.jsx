import React from "react";
import "./App.css";
import { createTheme, ThemeProvider } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import Routes from "./routes/Routes";
import { Provider, KeepAlive } from "react-keep-alive";
import LaserCommunicator from "services/shared/laser-communicator";

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
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Routes />
      </ThemeProvider>
    </div>
  );
}

export default App;
