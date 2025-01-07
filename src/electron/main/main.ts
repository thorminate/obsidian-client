// src/electron/main/main.ts
import { join } from "path";
import { app, BrowserWindow, ipcMain } from "electron";

function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 1000,
    minHeight: 500,
    minWidth: 800,
    webPreferences: {
      preload: join(__dirname, "../preload/preload.js"),
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: true,
    },
    icon: "./src/assets/logo.ico",
    autoHideMenuBar: true,
    titleBarStyle: "hidden",
    frame: false,
    show: false,
  });
  // and load the index.html of the app.
  if (!app.isPackaged) {
    mainWindow.loadURL("http://localhost:3000");
  } else {
    mainWindow.loadFile(join(__dirname, "../../index.html"));
  }

  mainWindow.once("ready-to-show", () => {
    mainWindow.show();
  });
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

ipcMain.on("minimize", () => {
  for (const window of BrowserWindow.getAllWindows()) {
    window.minimize();
  }
});
