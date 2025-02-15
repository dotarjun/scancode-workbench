import sqlite3 from "sqlite3";
import {
  app,
  BrowserWindow,
  nativeImage,
  ipcMain,
  Menu,
  shell,
} from "electron";

import getTemplate from "./mainMenu";
import { setUpGlobalIpcListeners, setUpWindowListeners } from "./mainActions";
import { WORKBENCH_TITLE } from "./constants/general";

// This allows TypeScript to pick up the magic constant that's auto-generated by Forge's Webpack
// plugin that tells the Electron app where to look for the Webpack-bundled app code (depending on
// whether you're running in development or production).
declare const MAIN_WINDOW_WEBPACK_ENTRY: string;
// declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

const isDev = !app.isPackaged;

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) {
  // eslint-disable-line global-require
  app.quit();
}
// app.allowRendererProcessReuse = false;

const APP_ICON_NATIVE_IMAGE = nativeImage.createFromPath(
  app.getAppPath() + "/src/assets/app-icon/icon.png"
);

export const createWindow = (): void => {
  // ipcMain.handle('dialog', (event, method, params) => {
  //   dialog[method](params);
  // });
  // contextBridge.exposeInMainWorld('electron', {
  //   openDialog: (method, config) => ipcRenderer.invoke('dialog', method, config),
  //   // dialog: dialog
  // });

  let x: number, y: number;
  const currentWindow = BrowserWindow.getFocusedWindow();
  if (currentWindow) {
    const offset = 30;
    const [currentWindowX, currentWindowY] = currentWindow.getPosition();
    x = currentWindowX + offset;
    y = currentWindowY + offset;
  }

  // Create the browser window.
  const mainWindow = new BrowserWindow({
    title: WORKBENCH_TITLE,
    width: 1200,
    height: 800,
    x,
    y,
    icon: APP_ICON_NATIVE_IMAGE,
    webPreferences: {
      nodeIntegration: true,
      nodeIntegrationInWorker: true,
      contextIsolation: false,
      // webSecurity: false,
      // nodeIntegrationInSubFrames: true,
      // preload: path.join(__dirname, 'index.js'),
      // enableRemoteModule: true,
    },
  });
  Menu.setApplicationMenu(Menu.buildFromTemplate(getTemplate()));

  console.log(
    "\n" + isDev ? "Dev mode" : "Prod mode",
    `- Sqlite version: ${sqlite3.VERSION}`
  );
  // console.log("Preload URL: ", MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY);
  console.log("Load URL: ", MAIN_WINDOW_WEBPACK_ENTRY);

  // and load the index.html of the app.
  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

  // open all URLs in default browser window
  // We do this only in production, to prevent hot reloads getting opened in browser
  if (!isDev) {
    mainWindow.webContents.on("will-navigate", (event, url) => {
      event.preventDefault();
      shell.openExternal(url);
    });
  }
  setUpWindowListeners(mainWindow);
};

setUpGlobalIpcListeners();

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", () => {
  createWindow();
  if (app.dock) {
    app.dock.setIcon(APP_ICON_NATIVE_IMAGE);
  }
});

// @TOIMPROVE
// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
    ipcMain.removeAllListeners();
  }
});

app.on("activate", () => {
  // On MacOS, it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
