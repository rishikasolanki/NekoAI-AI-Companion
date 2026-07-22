const { app, BrowserWindow, Menu } = require("electron");
const path = require("path");
const Store = require("electron-store").default;

const store = new Store();

const FRONTEND_URL = "http://localhost:5173";
const DEFAULT_PET_BOUNDS = {
  width: 180,
  height: 180,
  x: 50,
  y: 50,
};

let mainWindow = null;
let petWindow = null;


/**
 * Creates the main NekoAI dashboard window.
 */
function createMainWindow() {
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.show();
    mainWindow.focus();
    return;
  }

  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 950,
    minHeight: 650,
    show: false,
    backgroundColor: "#f7f5fc",

    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  mainWindow.loadURL(FRONTEND_URL);

  mainWindow.once("ready-to-show", () => {
    mainWindow.show();
  });

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}


/**
 * Saves the current pet position and size.
 */
function savePetBounds() {
  if (!petWindow || petWindow.isDestroyed()) {
    return;
  }

  store.set("petBounds", petWindow.getBounds());
}


/**
 * Sends a setting update to the pet React page.
 */
function sendPetSetting(channel, value) {
  if (
    !petWindow ||
    petWindow.isDestroyed() ||
    petWindow.webContents.isDestroyed()
  ) {
    return;
  }

  petWindow.webContents.send(channel, value);
}


/**
 * Creates Neko's floating desktop window.
 */
function createPetWindow() {
  if (petWindow && !petWindow.isDestroyed()) {
    petWindow.show();
    return;
  }

  const savedBounds = store.get(
    "petBounds",
    DEFAULT_PET_BOUNDS
  );

  petWindow = new BrowserWindow({
    width: savedBounds.width || DEFAULT_PET_BOUNDS.width,
    height: savedBounds.height || DEFAULT_PET_BOUNDS.height,
    x: savedBounds.x,
    y: savedBounds.y,

    frame: false,
    transparent: true,
    backgroundColor: "#00000000",
    resizable: false,
    movable: true,
    alwaysOnTop: true,
    skipTaskbar: true,
    hasShadow: false,
    focusable: true,
    show: false,

    webPreferences: {
      /*
       * Kept temporarily because your current pet page may use
       * ipcRenderer directly.
       *
       * We will secure this after reviewing preload.js.
       */
      nodeIntegration: true,
      contextIsolation: false,
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

  petWindow.on("move", savePetBounds);
  petWindow.on("resize", savePetBounds);

  petWindow.on("closed", () => {
    petWindow = null;
  });

  const blinkEnabled = store.get(
    "blinkEnabled",
    true
  );

  const floatEnabled = store.get(
    "floatEnabled",
    true
  );

  const followEnabled = store.get(
    "followEnabled",
    true
  );

  petWindow.webContents.on(
    "did-finish-load",
    () => {
      sendPetSetting(
        "init-settings",
        {
          blinkEnabled,
          floatEnabled,
          followEnabled,
        }
      );
    }
  );

  const petMenu = Menu.buildFromTemplate([
    {
      label: "Blink",
      type: "checkbox",
      checked: blinkEnabled,

      click: (menuItem) => {
        store.set(
          "blinkEnabled",
          menuItem.checked
        );

        sendPetSetting(
          "toggle-blink",
          menuItem.checked
        );
      },
    },

    {
      label: "Floating Animation",
      type: "checkbox",
      checked: floatEnabled,

      click: (menuItem) => {
        store.set(
          "floatEnabled",
          menuItem.checked
        );

        sendPetSetting(
          "toggle-float",
          menuItem.checked
        );
      },
    },

    {
      label: "Follow Cursor",
      type: "checkbox",
      checked: followEnabled,

      click: (menuItem) => {
        store.set(
          "followEnabled",
          menuItem.checked
        );

        sendPetSetting(
          "toggle-follow",
          menuItem.checked
        );
      },
    },

    {
      type: "separator",
    },

    {
      label: "Open NekoAI",
      click: () => {
        createMainWindow();
      },
    },

    {
      label: "Hide for 10 seconds",
      click: () => {
        if (!petWindow || petWindow.isDestroyed()) {
          return;
        }

        petWindow.hide();

        setTimeout(() => {
          if (
            petWindow &&
            !petWindow.isDestroyed()
          ) {
            petWindow.showInactive();
          }
        }, 10_000);
      },
    },

    {
      label: "Reset Position",
      click: () => {
        if (!petWindow || petWindow.isDestroyed()) {
          return;
        }

        petWindow.setBounds(
          DEFAULT_PET_BOUNDS
        );

        store.set(
          "petBounds",
          DEFAULT_PET_BOUNDS
        );
      },
    },

    {
      type: "separator",
    },

    {
      label: "Close Pet",
      click: () => {
        if (
          petWindow &&
          !petWindow.isDestroyed()
        ) {
          petWindow.close();
        }
      },
    },

    {
      label: "Quit NekoAI",
      click: () => {
        app.quit();
      },
    },
  ]);

  petWindow.webContents.on(
    "context-menu",
    () => {
      petMenu.popup({
        window: petWindow,
      });
    }
  );
}


app.whenReady().then(() => {
  createMainWindow();
  createPetWindow();
});


app.on("activate", () => {
  createMainWindow();

  if (!petWindow || petWindow.isDestroyed()) {
    createPetWindow();
  }
});


app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});