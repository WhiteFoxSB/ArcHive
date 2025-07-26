import { useState, useEffect } from 'react';
import { ElectronAPI } from '../types/electron';

export function useElectron() {
  const [isElectron, setIsElectron] = useState(false);
  const [electronAPI, setElectronAPI] = useState<ElectronAPI | null>(null);

  useEffect(() => {
    if (window.electronAPI) {
      setIsElectron(true);
      setElectronAPI(window.electronAPI as ElectronAPI);
    }
  }, []);

  return {
    isElectron,
    electronAPI,
  };
}

// Utility functions for common Electron operations
export const electronUtils = {
  // File operations
  async readFile(filePath: string): Promise<string | null> {
    if (!window.electronAPI) return null;
    try {
      const buffer = await window.electronAPI.readFile(filePath);
      return buffer.toString();
    } catch (error) {
      console.error('Error reading file:', error);
      return null;
    }
  },

  async writeFile(filePath: string, data: string): Promise<boolean> {
    if (!window.electronAPI) return false;
    try {
      return await window.electronAPI.writeFile(filePath, data);
    } catch (error) {
      console.error('Error writing file:', error);
      return false;
    }
  },

  async fileExists(filePath: string): Promise<boolean> {
    if (!window.electronAPI) return false;
    try {
      return await window.electronAPI.checkFileExists(filePath);
    } catch (error) {
      console.error('Error checking file:', error);
      return false;
    }
  },

  // Dialog operations
  async openFileDialog(filters?: { name: string; extensions: string[] }[]): Promise<string | null> {
    if (!window.electronAPI) return null;
    try {
      const result = await window.electronAPI.showOpenDialog({
        filters: filters || [
          { name: 'All Files', extensions: ['*'] }
        ],
        properties: ['openFile']
      });
      
      return result.canceled ? null : result.filePaths[0] || null;
    } catch (error) {
      console.error('Error opening file dialog:', error);
      return null;
    }
  },

  async saveFileDialog(): Promise<string | null> {
    if (!window.electronAPI) return null;
    try {
      const result = await window.electronAPI.showSaveDialog();
      return result.canceled ? null : result.filePath || null;
    } catch (error) {
      console.error('Error opening save dialog:', error);
      return null;
    }
  },

  // PDF specific operations
  async openPdfDialog(): Promise<string | null> {
    return electronUtils.openFileDialog([
      { name: 'PDF Files', extensions: ['pdf'] },
      { name: 'All Files', extensions: ['*'] }
    ]);
  },

  // Register file open listener (for menu actions)
  onFileOpened(callback: (filePath: string) => void): void {
    if (window.electronAPI) {
      window.electronAPI.onFileOpened(callback);
    }
  },

  // Cleanup listeners
  removeAllListeners(channel: string): void {
    if (window.electronAPI) {
      window.electronAPI.removeAllListeners(channel);
    }
  }
};