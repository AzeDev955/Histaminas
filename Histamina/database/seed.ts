import { MOCK_DATA } from "@/constants/alimentos";
import { MOCK_ADITIVOS } from "@/constants/aditivos";
import { getDb } from "./db";

type SeedFoodItem = {
  nombre: string;
  histamina: number;
  estado?: string;
};

type SeedAdditiveItem = {
  nombre: string;
  tipo: string;
  estado?: string;
  histamina: number;
  confianza?: string;
  notas?: string;
  alias?: string[];
};

function capitalizarCategoria(texto: string) {
  return texto.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
}

export async function seedDatabaseIfNeeded() {
  const db = await getDb();

  const meta = await db.getFirstAsync<{ value: string }>(
    `SELECT value FROM app_meta WHERE key = ?`,
    ["seed_v4_done"],
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
        MOCK_DATA.alimentos as Record<string, Record<string, SeedFoodItem>>
      )[categoriaSlug];

      for (const clave of Object.keys(items)) {
        const item = items[clave];
        const estado = item.estado ?? "fresco";

        await db.runAsync(
          `INSERT OR IGNORE INTO alimentos (categoria_slug, clave, nombre, estado, histamina)
           VALUES (?, ?, ?, ?, ?)`,
          [categoriaSlug, clave, item.nombre, estado, item.histamina],
        );
      }
    }

    await db.runAsync(
      `INSERT OR IGNORE INTO categorias (slug, nombre) VALUES (?, ?)`,
      ["aditivos", "Aditivos"],
    );

    for (const categoriaSlug of Object.keys(MOCK_ADITIVOS.aditivos)) {
      const items = (
        MOCK_ADITIVOS.aditivos as Record<
          string,
          Record<string, SeedAdditiveItem>
        >
      )[categoriaSlug];

      for (const clave of Object.keys(items)) {
        const item = items[clave];

        await db.runAsync(
          `INSERT OR IGNORE INTO aditivos
            (categoria_slug, clave, nombre, tipo, estado, histamina, confianza, notas, alias_json)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            "aditivos",
            clave,
            item.nombre,
            item.tipo,
            item.estado ?? "procesado",
            item.histamina,
            item.confianza ?? null,
            item.notas ?? null,
            JSON.stringify(item.alias ?? []),
          ],
        );
      }
    }

    await db.runAsync(
      `INSERT OR REPLACE INTO app_meta (key, value) VALUES (?, ?)`,
      ["seed_v4_done", "true"],
    );
  });
}
