// src/electron/main/main.ts
import { join } from "path";
import { app, BrowserWindow } from "electron";
import { spawn } from "child_process";

const isDev = process.env.npm_lifecycle_event === "app:dev" ? true : false;

function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 1000,
    webPreferences: {
      preload: join(__dirname, "../preload/preload.js"),
    },
    icon: "./src/assets/logo.ico",
    autoHideMenuBar: true,
    titleBarStyle: "hidden",
    titleBarOverlay: {
      color: "#161616",
      symbolColor: "#505050",
      height: 32,
    },
    frame: false,
    transparent: true,
  });

  // and load the index.html of the app.
  if (isDev) {
    mainWindow.loadURL("http://localhost:3000");
  } else {
    mainWindow.loadFile(join(__dirname, "../../index.html"));
  }

  const javaProcess = spawn("java", [
    "-jar",
    join(__dirname, "../../server.jar"),
  ]);
}
app.whenReady().then(() => {
  createWindow();
  app.on("activate", function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
