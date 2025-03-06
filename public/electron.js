const path = require("path");
const { app, BrowserWindow } = require("electron");
const { spawn } = require("node:child_process");
const isDev = require("electron-is-dev");
const bat = spawn("cmd.exe", [
  "/c",
  "D:/Deze Pc/Documenten/Projecten/Laser projector/Pc software/LaserAPI/LaserAPI/bin/Release/net6.0-windows10.0.22621.0/LaserApi.exe",
]);

function createWindow() {
  // Create the browser window.
  const win = new BrowserWindow({
    webPreferences: {
      nodeIntegration: true,
    },
    autoHideMenuBar: true,
  });

  win.once("ready-to-show", () => {
    win.show();
  });

  // and load the index.html of the app.
  // win.loadFile("index.html");
  win.loadURL(isDev ? "http://localhost:3000" : `file://${path.join(__dirname, "../build/index.html")}`);
}

bat.stdout.on("data", (data) => {
  console.log(data.toString());
});

bat.stderr.on("data", (data) => {
  console.error(data.toString());
});

bat.on("exit", (code) => {
  console.log(`Child exited with code ${code}`);
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
