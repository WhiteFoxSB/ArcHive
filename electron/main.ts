import { fileURLToPath } from 'url'
import path, { dirname, join } from 'path'
import db from './db';
import fs from 'fs';
import os from 'os';
import { app, BrowserWindow, Menu, dialog, ipcMain } from 'electron'
import { readFile, writeFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { ExtractedMetadata } from './services/pdfParser'



const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const storageDir = path.join(os.homedir(), 'Documents', 'ArcHivePapers');


// The built directory structure
process.env.DIST = join(__dirname, '../dist')
process.env.VITE_PUBLIC = app.isPackaged
  ? process.env.DIST
  : join(__dirname, '../public')







let win: BrowserWindow | null
const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL']



function createWindow() {

  const iconPath = app.isPackaged
  ? join(process.resourcesPath, 'assets/icons/transparent.ico') // when packaged
  : join(__dirname, '../public/assets/icons/transparent.ico')   // during dev

  //console.log("Icon path:", iconPath, "Exists?", existsSync(iconPath))

  win = new BrowserWindow({
    //width: 1200,
    //height: 800,
    //minWidth: 800,
    //minHeight: 600,
    icon: iconPath,
    webPreferences: {
      preload: app.isPackaged
        ? path.join(__dirname, 'preload.js') // this works in packaged app
        : path.join(__dirname, '../dist-electron/preload.js'), // dev mode
      nodeIntegration: false,
      contextIsolation: true,
      webSecurity: false, // Needed for loading local PDFs
      // sandbox: false
    },
    titleBarStyle: 'default',
    title: 'ArcHive',
    show: false, // Don't show until ready
  })

  win.maximize();

  // Show window when ready to prevent visual flash
  win.once('ready-to-show', () => {
    win?.show()
  })

  win.webContents.openDevTools();

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL)
  } else {
    win.loadFile(join(process.env.DIST, 'index.html'))
  }
  

  
  // Create application menu
  createMenu()
}

function createMenu() {
  const template = [
    {
      label: 'File',
      submenu: [
        {
          label: 'Upload PDF',
          accelerator: 'CmdOrCtrl+O',
          click: async () => {
            const result = await dialog.showOpenDialog(win!, {
              filters: [
                { name: 'PDF Files', extensions: ['pdf'] },
                { name: 'All Files', extensions: ['*'] }
              ],
              properties: ['openFile']
            })
            
            if (!result.canceled && result.filePaths.length > 0) {
              win?.webContents.send('file-opened', result.filePaths[0])
            }
          }
        },
        { type: 'separator' },
        {
          label: 'Exit',
          accelerator: process.platform === 'darwin' ? 'Cmd+Q' : 'Ctrl+Q',
          click: () => {
            app.quit()
          }
        }
      ]
    },
    {
      label: 'View',
      submenu: [
        { role: 'reload' },
        { role: 'forceReload' },
        { role: 'toggleDevTools' },
        { type: 'separator' },
        { role: 'resetZoom' },
        { role: 'zoomIn' },
        { role: 'zoomOut' },
        { type: 'separator' },
        { role: 'togglefullscreen' }
      ]
    }
  ]

  const menu = Menu.buildFromTemplate(template as any)
  Menu.setApplicationMenu(menu)
}

// IPC handlers for file operations
ipcMain.handle('read-file', async (_, filePath: string) => {
  try {
    const data = await readFile(filePath)
    return data
  } catch (error) {
    throw new Error(`Failed to read file: ${error}`)
  }
})

ipcMain.handle('write-file', async (_, filePath: string, data: string) => {
  try {
    await writeFile(filePath, data, 'utf8')
    return true
  } catch (error) {
    throw new Error(`Failed to write file: ${error}`)
  }
})

ipcMain.handle('check-file-exists', async (_, filePath: string) => {
  return existsSync(filePath)
})

ipcMain.handle('show-save-dialog', async () => {
  const result = await dialog.showSaveDialog(win!, {
    filters: [
      { name: 'JSON Files', extensions: ['json'] },
      { name: 'All Files', extensions: ['*'] }
    ]
  })
  return result
})

ipcMain.handle('show-open-dialog', async (_, options: any) => {
  const result = await dialog.showOpenDialog(win!, options)
  return result
})

/*ipcMain.handle('save-pdf-to-storage', async (_event, buffer: ArrayBuffer, fileName: string) => {
  if (!fs.existsSync(storageDir)) {
    fs.mkdirSync(storageDir, { recursive: true });
  }

  const filePath = path.join(storageDir, fileName);
  fs.writeFileSync(filePath, Buffer.from(buffer));

  return filePath; // absolute file path
});*/


//Main version
ipcMain.handle('save-pdf-to-storage', async (_event, { name, buffer }: { name: string; buffer: Buffer }) => {
  try {
    if (!fs.existsSync(storageDir)) {
      fs.mkdirSync(storageDir, { recursive: true });
    }

    const filePath = path.join(storageDir, name);
    fs.writeFileSync(filePath, buffer);

    return filePath;
  } catch (error) {
    console.error('[save-pdf error]', error);
    throw new Error('Failed to write file to disk');
  }
});

//Debugging version
/*ipcMain.handle('save-pdf-to-storage', async (_event, { name, buffer }: { name: string; buffer: Buffer }) => {
  try {
    console.log('[IPC] Received file:', name);
    console.log('[IPC] Buffer size:', buffer?.length);

    if (!fs.existsSync(storageDir)) {
      console.log('[IPC] Creating storage directory at:', storageDir);
      fs.mkdirSync(storageDir, { recursive: true });
    }

    const filePath = path.join(storageDir, name);
    console.log('[IPC] Writing file to:', filePath);

    fs.writeFileSync(filePath, buffer);

    console.log('[IPC] File saved successfully');
    return filePath;
  } catch (error) {
    console.error('[IPC ERROR] Failed to write file:', error);
    throw new Error('Failed to write file to disk');
  }
});*/

//Test case
/*ipcMain.handle('test-write', async () => {
  const dummyBuffer = Buffer.from('Hello world!');
  const folderPath = path.join(os.homedir(), 'Documents', 'ArcHivePapers');

  //const testPath = path.join(storageDir, 'test.txt');

  try {
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
    }

    const testPath = path.join(folderPath, 'test.txt');
    fs.writeFileSync(testPath, 'This is a test');
    console.log('[Test Write] Success:', testPath);
    return testPath;
  } catch (err) {
    console.error('[Test Write Error]:', err);
    throw new Error('Failed to write test file');
  }
});

ipcMain.handle('testWrite', async () => {
  console.log('⚡ testWrite handler triggered'); // ← Add this
  const folderPath = path.join(os.homedir(), 'Documents', 'ArcHivePapers');

  try {
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
    }

    const testFilePath = path.join(folderPath, 'test.txt');
    fs.writeFileSync(testFilePath, 'This is a test.');
    console.log('✅ File written to:', testFilePath); // ← Confirm path

    return testFilePath;
  } catch (error) {
    console.error('❌ Test write failed:', error);
    throw new Error('Failed to write test file');
  }
});*/




// Quit when all windows are closed, except on macOS
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
    win = null
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

app.whenReady().then(createWindow)