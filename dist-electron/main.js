import { fileURLToPath as y } from "url";
import c, { dirname as g, join as i } from "path";
import d from "fs";
import v from "os";
import { app as s, ipcMain as n, dialog as f, BrowserWindow as w, Menu as m } from "electron";
import { readFile as F, writeFile as _ } from "node:fs/promises";
import { existsSync as D } from "node:fs";
const P = y(import.meta.url), l = g(P), p = c.join(v.homedir(), "Documents", "ArcHivePapers");
process.env.DIST = i(l, "../dist");
process.env.VITE_PUBLIC = s.isPackaged ? process.env.DIST : i(l, "../public");
let e;
const u = process.env.VITE_DEV_SERVER_URL;
function h() {
  const t = s.isPackaged ? i(process.resourcesPath, "assets/icons/transparent.ico") : i(l, "../public/assets/icons/transparent.ico");
  e = new w({
    //width: 1200,
    //height: 800,
    //minWidth: 800,
    //minHeight: 600,
    icon: t,
    webPreferences: {
      preload: s.isPackaged ? c.join(l, "preload.js") : c.join(l, "../dist-electron/preload.js"),
      // dev mode
      nodeIntegration: !1,
      contextIsolation: !0,
      webSecurity: !1
      // Needed for loading local PDFs
      // sandbox: false
    },
    titleBarStyle: "default",
    title: "ArcHive",
    show: !1
    // Don't show until ready
  }), e.maximize(), e.once("ready-to-show", () => {
    e == null || e.show();
  }), e.webContents.openDevTools(), u ? e.loadURL(u) : e.loadFile(i(process.env.DIST, "index.html")), b();
}
function b() {
  const t = [
    {
      label: "File",
      submenu: [
        {
          label: "Upload PDF",
          accelerator: "CmdOrCtrl+O",
          click: async () => {
            const r = await f.showOpenDialog(e, {
              filters: [
                { name: "PDF Files", extensions: ["pdf"] },
                { name: "All Files", extensions: ["*"] }
              ],
              properties: ["openFile"]
            });
            !r.canceled && r.filePaths.length > 0 && (e == null || e.webContents.send("file-opened", r.filePaths[0]));
          }
        },
        { type: "separator" },
        {
          label: "Exit",
          accelerator: process.platform === "darwin" ? "Cmd+Q" : "Ctrl+Q",
          click: () => {
            s.quit();
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
  ], o = m.buildFromTemplate(t);
  m.setApplicationMenu(o);
}
n.handle("read-file", async (t, o) => {
  try {
    return await F(o);
  } catch (r) {
    throw new Error(`Failed to read file: ${r}`);
  }
});
n.handle("write-file", async (t, o, r) => {
  try {
    return await _(o, r, "utf8"), !0;
  } catch (a) {
    throw new Error(`Failed to write file: ${a}`);
  }
});
n.handle("check-file-exists", async (t, o) => D(o));
n.handle("show-save-dialog", async () => await f.showSaveDialog(e, {
  filters: [
    { name: "JSON Files", extensions: ["json"] },
    { name: "All Files", extensions: ["*"] }
  ]
}));
n.handle("show-open-dialog", async (t, o) => await f.showOpenDialog(e, o));
n.handle("save-pdf-to-storage", async (t, { name: o, buffer: r }) => {
  try {
    d.existsSync(p) || d.mkdirSync(p, { recursive: !0 });
    const a = c.join(p, o);
    return d.writeFileSync(a, r), a;
  } catch (a) {
    throw console.error("[save-pdf error]", a), new Error("Failed to write file to disk");
  }
});
s.on("window-all-closed", () => {
  process.platform !== "darwin" && (s.quit(), e = null);
});
s.on("activate", () => {
  w.getAllWindows().length === 0 && h();
});
s.whenReady().then(h);
