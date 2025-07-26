import { fileURLToPath } from "url";
import path, { dirname, join } from "path";
import fs from "fs";
import os from "os";
import { app, ipcMain, dialog, BrowserWindow, Menu } from "electron";
import { readFile, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const storageDir = path.join(os.homedir(), "Documents", "ArcHivePapers");
process.env.DIST = join(__dirname, "../dist");
process.env.VITE_PUBLIC = app.isPackaged ? process.env.DIST : join(__dirname, "../public");
let win;
const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];
function createWindow() {
  const iconPath = app.isPackaged ? join(process.resourcesPath, "assets/icons/transparent.ico") : join(__dirname, "../public/assets/icons/transparent.ico");
  win = new BrowserWindow({
    //width: 1200,
    //height: 800,
    //minWidth: 800,
    //minHeight: 600,
    icon: iconPath,
    webPreferences: {
      preload: app.isPackaged ? path.join(__dirname, "preload.js") : path.join(__dirname, "../dist-electron/preload.js"),
      // dev mode
      nodeIntegration: false,
      contextIsolation: true,
      webSecurity: false,
      // Needed for loading local PDFs
      sandbox: false
      // Required for preload script compatibility
    },
    titleBarStyle: "default",
    title: "ArcHive",
    show: false
    // Don't show until ready
  });
  win.maximize();
  win.once("ready-to-show", () => {
    win == null ? void 0 : win.show();
  });
  win.webContents.openDevTools();
  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL);
  } else {
    win.loadFile(join(process.env.DIST, "index.html"));
  }
  createMenu();
}
function createMenu() {
  const template = [
    {
      label: "File",
      submenu: [
        {
          label: "Upload PDF",
          accelerator: "CmdOrCtrl+O",
          click: async () => {
            const result = await dialog.showOpenDialog(win, {
              filters: [
                { name: "PDF Files", extensions: ["pdf"] },
                { name: "All Files", extensions: ["*"] }
              ],
              properties: ["openFile"]
            });
            if (!result.canceled && result.filePaths.length > 0) {
              win == null ? void 0 : win.webContents.send("file-opened", result.filePaths[0]);
            }
          }
        },
        { type: "separator" },
        {
          label: "Exit",
          accelerator: process.platform === "darwin" ? "Cmd+Q" : "Ctrl+Q",
          click: () => {
            app.quit();
          }
        }
      ]
    },
    {
      label: "View",
      submenu: [
        { role: "reload" },
        { role: "forceReload" },
        { role: "toggleDevTools" },
        { type: "separator" },
        { role: "resetZoom" },
        { role: "zoomIn" },
        { role: "zoomOut" },
        { type: "separator" },
        { role: "togglefullscreen" }
      ]
    }
  ];
  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}
ipcMain.handle("read-file", async (_, filePath) => {
  try {
    const data = await readFile(filePath);
    return data;
  } catch (error) {
    throw new Error(`Failed to read file: ${error}`);
  }
});
ipcMain.handle("write-file", async (_, filePath, data) => {
  try {
    await writeFile(filePath, data, "utf8");
    return true;
  } catch (error) {
    throw new Error(`Failed to write file: ${error}`);
  }
});
ipcMain.handle("check-file-exists", async (_, filePath) => {
  return existsSync(filePath);
});
ipcMain.handle("show-save-dialog", async () => {
  const result = await dialog.showSaveDialog(win, {
    filters: [
      { name: "JSON Files", extensions: ["json"] },
      { name: "All Files", extensions: ["*"] }
    ]
  });
  return result;
});
ipcMain.handle("show-open-dialog", async (_, options) => {
  const result = await dialog.showOpenDialog(win, options);
  return result;
});
ipcMain.handle("save-pdf-to-storage", async (_event, { name, buffer }) => {
  try {
    if (!fs.existsSync(storageDir)) {
      fs.mkdirSync(storageDir, { recursive: true });
    }
    const filePath = path.join(storageDir, name);
    fs.writeFileSync(filePath, buffer);
    return filePath;
  } catch (error) {
    console.error("[save-pdf error]", error);
    throw new Error("Failed to write file to disk");
  }
});
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
    win = null;
  }
});
app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
app.whenReady().then(createWindow);
