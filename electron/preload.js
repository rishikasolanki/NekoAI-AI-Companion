const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  // Listen for events from Electron
  onInitSettings: (callback) =>
    ipcRenderer.on("init-settings", (_, data) => callback(data)),

  onToggleBlink: (callback) =>
    ipcRenderer.on("toggle-blink", (_, enabled) => callback(enabled)),

  onToggleFloat: (callback) =>
    ipcRenderer.on("toggle-float", (_, enabled) => callback(enabled)),

  onToggleFollow: (callback) =>
    ipcRenderer.on("toggle-follow", (_, enabled) => callback(enabled)),

  // Remove listeners
  removeAllListeners: (channel) => {
    ipcRenderer.removeAllListeners(channel);
  },
});