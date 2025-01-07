import { contextBridge, ipcRenderer } from "electron";

export const API = {
  ipc: {
    send: (channel: string, data: any) => ipcRenderer.send(channel, data),
    on: (channel: string, listener: any) => ipcRenderer.on(channel, listener),
    once: (channel: string, listener: any) =>
      ipcRenderer.once(channel, listener),
    invoke: (channel: string, data: any) => ipcRenderer.invoke(channel, data),
  },
  window: {
    minimize: () => ipcRenderer.send("minimize"),
    maximize: () => ipcRenderer.send("maximize"),
    close: () => ipcRenderer.send("close"),
  },
};

contextBridge.exposeInMainWorld("api", API);
