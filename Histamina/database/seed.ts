import { MOCK_DATA } from "../constants/alimentos";
import { getDb } from "./db";

function capitalizarCategoria(texto: string) {
  return texto.charAt(0).toUpperCase() + texto.slice(1);
}

export async function seedDatabaseIfNeeded() {
  const db = await getDb();

  const meta = await db.getFirstAsync<{ value: string }>(
    `SELECT value FROM app_meta WHERE key = ?`,
    ["seed_v1_done"],
  );

  if (meta?.value === "true") {
    return;
  }

  await db.withTransactionAsync(async () => {
    for (const categoriaSlug of Object.keys(MOCK_DATA.alimentos)) {
      await db.runAsync(
        `INSERT OR IGNORE INTO categorias (slug, nombre) VALUES (?, ?)`,
        [categoriaSlug, capitalizarCategoria(categoriaSlug)],
      );

      const items = (MOCK_DATA.alimentos as any)[categoriaSlug];

      for (const clave of Object.keys(items)) {
        const item = items[clave];

        await db.runAsync(
          `INSERT OR IGNORE INTO alimentos (categoria_slug, clave, nombre, histamina)
           VALUES (?, ?, ?, ?)`,
          [categoriaSlug, clave, item.nombre, item.histamina],
        );
      }
    }

    await db.runAsync(
      `INSERT OR REPLACE INTO app_meta (key, value) VALUES (?, ?)`,
      ["seed_v1_done", "true"],
    );
  });
}
