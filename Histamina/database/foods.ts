import { getDb } from "./db";

export interface FoodRow {
  id: number;
  categoria_slug: string;
  clave: string;
  nombre: string;
  estado: string;
  histamina: number;
  notas?: string | null;
}

export async function getFoodById(id: number) {
  const db = await getDb();

  return db.getFirstAsync<FoodRow>(
    `SELECT id, categoria_slug, clave, nombre, estado, histamina
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
  estado,
  histamina,
  notas,
}: {
  categoriaSlug: string;
  clave: string;
  nombre: string;
  estado: string;
  histamina: number;
  notas?: string;
}) {
  const db = await getDb();

  await db.runAsync(
    `INSERT INTO alimentos (categoria_slug, clave, nombre, estado, histamina, notas)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [categoriaSlug, clave, nombre, estado, histamina, notas ?? null],
  );
}

export async function updateFood({
  id,
  categoriaSlug,
  nombre,
  estado,
  histamina,
  notas,
}: {
  id: number;
  categoriaSlug: string;
  nombre: string;
  estado: string;
  histamina: number;
  notas?: string;
}) {
  const db = await getDb();

  await db.runAsync(
    `UPDATE alimentos
     SET nombre = ?,
         categoria_slug = ?,
         estado = ?,
         histamina = ?,
         notas = ?,
         updated_at = CURRENT_TIMESTAMP
     WHERE id = ?`,
    [nombre, categoriaSlug, estado, histamina, notas ?? null, id],
  );
}

export async function deleteFood(id: number) {
  const db = await getDb();

  await db.runAsync(`DELETE FROM alimentos WHERE id = ?`, [id]);
}
