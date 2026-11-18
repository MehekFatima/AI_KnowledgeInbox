import Database from "better-sqlite3";
import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dataDirectory = path.resolve(__dirname, "../data");

fs.mkdirSync(dataDirectory, { recursive: true });

const db = new Database(
  path.join(dataDirectory, "knowledge.db")
);


db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");
db.pragma("busy_timeout = 5000");


db.exec(`
  CREATE TABLE IF NOT EXISTS items (
    id TEXT PRIMARY KEY,
    type TEXT NOT NULL CHECK(type IN ('note', 'url')),
    title TEXT,
    source_url TEXT,
    raw_content TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'processing'
      CHECK(status IN ('processing', 'completed', 'failed')),
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS chunks (
    id TEXT PRIMARY KEY,
    item_id TEXT NOT NULL,
    chunk_index INTEGER NOT NULL,
    content TEXT NOT NULL,
    embedding TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY(item_id)
      REFERENCES items(id)
      ON DELETE CASCADE,

    UNIQUE(item_id, chunk_index)
  );

  CREATE INDEX IF NOT EXISTS idx_items_created_at
  ON items(created_at);

  CREATE INDEX IF NOT EXISTS idx_chunks_item_id
  ON chunks(item_id);
`);

console.log("SQLite database initialized.");

export default db;