// Electron API types
export interface ElectronAPI {
    
    
    // Dialog operations
    showSaveDialog: () => Promise<{ canceled: boolean; filePath?: string }>;
    showOpenDialog: (options: {
      filters?: { name: string; extensions: string[] }[];
      properties?: string[];
      title?: string;
    }) => Promise<{ canceled: boolean; filePaths: string[] }>;
    
    // Event listeners
    onFileOpened: (callback: (filePath: string) => void) => void;
    removeAllListeners: (channel: string) => void;
  
    // Platform info
    platform: string;
    isElectron: boolean;
  }
  
  declare global {
    interface Window {
      electron: {
        ipcRenderer: {
          invoke: (channel: string, ...args: any[]) => Promise<any>;
          // You can add more IPC methods if needed
        };
      };
      electronAPI: {
        savePdfToStorage: (file: File) => Promise<string>;
        testWrite: () => Promise<string>;
      }
      ElectronAPI;
    }
  }
  
  export {};

  
  