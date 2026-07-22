const { BrowserWindow } = require("electron");
const path = require("path");

const FRONTEND_URL =
  process.env.VITE_DEV_SERVER_URL ||
  "http://localhost:5173";


function createPetWindow(options = {}) {
  const petWindow = new BrowserWindow({
    width: options.width || 180,
    height: options.height || 180,

    x: options.x,
    y: options.y,

    frame: false,
    transparent: true,
    backgroundColor: "#00000000",

    resizable: false,
    movable: true,

    alwaysOnTop: true,
    skipTaskbar: true,
    hasShadow: false,

    show: false,

    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  petWindow.setAlwaysOnTop(true, "floating");

  petWindow.setVisibleOnAllWorkspaces(
    true,
    {
      visibleOnFullScreen: true,
    }
  );

  petWindow.loadURL(`${FRONTEND_URL}/pet`);

  petWindow.once("ready-to-show", () => {
    petWindow.showInactive();
  });

  return petWindow;
}


module.exports = createPetWindow;