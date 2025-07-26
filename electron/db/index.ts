import Database from 'better-sqlite3';
import path from 'node:path';
import { app } from 'electron';

const dbPath = app.isPackaged
  ? path.join(process.resourcesPath, 'database.db')
  : path.join(__dirname, '..', 'data', 'database.db');

const db = new Database(dbPath);

// Schema initialization (only runs once)
db.exec(`
  CREATE TABLE IF NOT EXISTS papers (
    id TEXT PRIMARY KEY,
    fileName TEXT,
    originalName TEXT,
    filePath TEXT,
    dateAdded TEXT,
    fileSize INTEGER,
    tags TEXT,
    projectIds TEXT,
    authors TEXT,
    journal TEXT,
    year TEXT,
    doi TEXT
  );

  CREATE TABLE IF NOT EXISTS categories (
    id TEXT PRIMARY KEY,
    name TEXT,
    color TEXT,
    paperCount INTEGER
  );
`);

export default db;
