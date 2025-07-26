import { contextBridge as i, ipcRenderer as n } from "electron";
console.log("👋 preload script loaded");
i.exposeInMainWorld("electronAPI", {
  // File operations
  readFile: (e) => n.invoke("read-file", e),
  writeFile: (e, t) => n.invoke("write-file", e, t),
  checkFileExists: (e) => n.invoke("check-file-exists", e),
  /*savePdfToStorage: async (file: File): Promise<string> => {
    const buffer = await file.arrayBuffer();
    const savedPath = await ipcRenderer.invoke('save-pdf-to-storage', buffer, file.name);
    return savedPath;
  },*/
  savePdfToStorage: async (e) => {
    const t = await e.arrayBuffer();
    return n.invoke("save-pdf-to-storage", {
      name: e.name,
      buffer: Buffer.from(t)
    });
  },
  //test operation
  testWrite: () => n.invoke("test-write"),
  // Dialog operations
  showSaveDialog: () => n.invoke("show-save-dialog"),
  showOpenDialog: (e) => n.invoke("show-open-dialog", e),
  // Event listeners
  onFileOpened: (e) => {
    n.on("file-opened", (t, o) => e(o));
  },
  // Remove listeners
  removeAllListeners: (e) => {
    n.removeAllListeners(e);
  },
  // Platform info
  platform: process.platform,
  isElectron: !0
});
function d(e = ["complete", "interactive"]) {
  return new Promise((t) => {
    e.includes(document.readyState) ? t(!0) : document.addEventListener("readystatechange", () => {
      e.includes(document.readyState) && t(!0);
    });
  });
}
const a = {
  append(e, t) {
    Array.from(e.children).find((o) => o === t) || e.appendChild(t);
  },
  remove(e, t) {
    Array.from(e.children).find((o) => o === t) && e.removeChild(t);
  }
};
function s() {
  const e = "loaders-css__square-spin", t = `
@keyframes square-spin {
  25% { 
    transform: perspective(100px) rotateX(180deg) rotateY(0); 
  }
  50% { 
    transform: perspective(100px) rotateX(180deg) rotateY(180deg); 
  }
  75% { 
    transform: perspective(100px) rotateX(0) rotateY(180deg); 
  }
  100% { 
    transform: perspective(100px) rotateX(0) rotateY(0); 
  }
}
.${e} > div {
  animation-fill-mode: both;
  width: 50px;
  height: 50px;
  background: #fff;
  animation: square-spin 3s 0s cubic-bezier(0.09, 0.57, 0.49, 0.9) infinite;
}
.app-loading-wrap {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #282c34;
  z-index: 9;
}
    `, o = document.createElement("style"), r = document.createElement("div");
  return o.id = "app-loading-style", o.innerHTML = t, r.className = "app-loading-wrap", r.innerHTML = `<div class="${e}"><div></div></div>`, {
    appendLoading() {
      a.append(document.head, o), a.append(document.body, r);
    },
    removeLoading() {
      a.remove(document.head, o), a.remove(document.body, r);
    }
  };
}
const { appendLoading: p, removeLoading: c } = s();
d().then(p);
window.onmessage = (e) => {
  e.data.payload === "removeLoading" && c();
};
