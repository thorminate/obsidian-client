import { contextBridge, ipcMain, ipcRenderer } from "electron";

window.addEventListener("DOMContentLoaded", () => {
  const replaceText = (selector: any, text: any) => {
    const element = document.getElementById(selector);
    if (element) element.innerText = text;
  };

  for (const dependency of ["chrome", "node", "electron"]) {
    replaceText(`${dependency}-version`, process.versions[dependency]);
  }
});

contextBridge.exposeInMainWorld("java", {
  send: (str: string) => ipcMain.emit("to-java", str),
  receive: () => ipcRenderer.on("from-java", (event, arg) => console.log(arg)),
});
