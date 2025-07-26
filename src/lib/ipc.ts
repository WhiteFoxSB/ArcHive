


export async function parsePdf(filePath: string) {
    return await window.electron.ipcRenderer.invoke('parse-pdf', filePath)
  }
  