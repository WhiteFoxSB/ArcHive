// ipc/fileSystem.ts
import fs from 'fs';
import path from 'path';
import os from 'os';

const storageDir = path.join(os.homedir(), 'Documents', 'ArcHivePapers');

export function ensureStorageFolder() {
  if (!fs.existsSync(storageDir)) {
    fs.mkdirSync(storageDir, { recursive: true });
  }
}

export function saveFileToStorage(originalFile: File): string {
  ensureStorageFolder();

  const reader = new FileReader();

  return new Promise<string>((resolve, reject) => {
    reader.onload = () => {
      const buffer = Buffer.from(reader.result as ArrayBuffer);
      const filePath = path.join(storageDir, originalFile.name);
      fs.writeFileSync(filePath, buffer);
      resolve(filePath);
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsArrayBuffer(originalFile);
  });
}
