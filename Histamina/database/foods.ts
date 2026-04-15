import { getDb } from "./db";

export interface FoodRow {
  id: number;
  categoria_slug: string;
  clave: string;
  nombre: string;
  histamina: number;
}

export async function getFoodById(id: number) {
  const db = await getDb();

  return db.getFirstAsync<FoodRow>(
    `SELECT id, categoria_slug, clave, nombre, histamina
     FROM alimentos
     WHERE id = ?`,
    [id],
  );
}

export async function getCategorySlugs() {
  const db = await getDb();

  return db.getAllAsync<{ categoria_slug: string }>(
    `SELECT DISTINCT categoria_slug
     FROM alimentos
     ORDER BY categoria_slug ASC`,
  );
}

export async function addFood({
  categoriaSlug,
  clave,
  nombre,
  histamina,
}: {
  categoriaSlug: string;
  clave: string;
  nombre: string;
  histamina: number;
}) {
  const db = await getDb();

  await db.runAsync(
    `INSERT INTO alimentos (categoria_slug, clave, nombre, histamina)
     VALUES (?, ?, ?, ?)`,
    [categoriaSlug, clave, nombre, histamina],
  );
}

export async function updateFood({
  id,
  categoriaSlug,
  nombre,
  histamina,
}: {
  id: number;
  categoriaSlug: string;
  nombre: string;
  histamina: number;
}) {
  const db = await getDb();

  await db.runAsync(
    `UPDATE alimentos
     SET categoria_slug = ?, nombre = ?, histamina = ?, updated_at = CURRENT_TIMESTAMP
     WHERE id = ?`,
    [categoriaSlug, nombre, histamina, id],
  );
}

export async function deleteFood(id: number) {
  const db = await getDb();

  await db.runAsync(`DELETE FROM alimentos WHERE id = ?`, [id]);
}
