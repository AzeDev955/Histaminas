import { MOCK_DATA } from "@/constants/alimentos";
import { getDb } from "./db";

type SeedItem =
  | {
      nombre: string;
      histamina: number;
      estado?: string;
    }
  | {
      nombre: string;
      histamina: number;
    };

function capitalizarCategoria(texto: string) {
  return texto.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
}

export async function seedDatabaseIfNeeded() {
  const db = await getDb();

  const meta = await db.getFirstAsync<{ value: string }>(
    `SELECT value FROM app_meta WHERE key = ?`,
    ["seed_v2_done"],
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

      const items = (
        MOCK_DATA.alimentos as Record<string, Record<string, SeedItem>>
      )[categoriaSlug];

      for (const clave of Object.keys(items)) {
        const item = items[clave];
        const estado = "estado" in item && item.estado ? item.estado : "normal";

        await db.runAsync(
          `INSERT OR IGNORE INTO alimentos (categoria_slug, clave, nombre, estado, histamina)
           VALUES (?, ?, ?, ?, ?)`,
          [categoriaSlug, clave, item.nombre, estado, item.histamina],
        );
      }
    }

    await db.runAsync(
      `INSERT OR REPLACE INTO app_meta (key, value) VALUES (?, ?)`,
      ["seed_v2_done", "true"],
    );
  });
}
