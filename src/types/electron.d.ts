// Electron API types
export interface ElectronAPI {
    // File operations
    readFile: (filePath: string) => Promise<any>;
    writeFile: (filePath: string, data: string) => Promise<boolean>;
    checkFileExists: (filePath: string) => Promise<boolean>;
    savePdfToStorage: (file: File) => Promise<string>;
    testWrite: () => Promise<string>;
    
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
      electronAPI: ElectronAPI;
    }
  }
  
  export {};

  
  