import * as SQLite from "expo-sqlite";

let db: SQLite.SQLiteDatabase | null = null;

export async function getDb() {
  if (!db) {
    db = await SQLite.openDatabaseAsync("histamina.db");
  }
  return db;
}

export async function initDb() {
  const db = await getDb();

  await db.execAsync(`
    PRAGMA journal_mode = WAL;

    CREATE TABLE IF NOT EXISTS categorias (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      slug TEXT NOT NULL UNIQUE,
      nombre TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS alimentos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      categoria_slug TEXT NOT NULL,
      clave TEXT NOT NULL,
      nombre TEXT NOT NULL,
      estado TEXT NOT NULL DEFAULT 'fresco',
      histamina INTEGER NOT NULL CHECK (histamina IN (0,1,2,3)),
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(categoria_slug, clave, estado)
    );

    CREATE TABLE IF NOT EXISTS aditivos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      categoria_slug TEXT NOT NULL DEFAULT 'aditivos',
      clave TEXT NOT NULL UNIQUE,
      nombre TEXT NOT NULL,
      tipo TEXT NOT NULL,
      estado TEXT NOT NULL DEFAULT 'procesado',
      histamina INTEGER NOT NULL CHECK (histamina IN (0,1,2,3)),
      confianza TEXT,
      notas TEXT,
      alias_json TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS app_meta (
      key TEXT PRIMARY KEY NOT NULL,
      value TEXT
    );
  `);
}

export async function resetDatabase() {
  const db = await getDb();

  await db.withTransactionAsync(async () => {
    await db.runAsync(`DELETE FROM alimentos`);
    await db.runAsync(`DELETE FROM aditivos`);
    await db.runAsync(`DELETE FROM categorias`);
    await db.runAsync(`DELETE FROM app_meta`);
  });
}
