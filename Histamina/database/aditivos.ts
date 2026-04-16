import { getDb } from "./db";

export interface AdditiveRow {
  id: number;
  categoria_slug: string;
  clave: string;
  nombre: string;
  tipo: string;
  estado: string;
  histamina: number;
  confianza?: string | null;
  notas?: string | null;
  alias_json?: string | null;
}

export async function getAditivoById(id: number) {
  const db = await getDb();

  return db.getFirstAsync<AdditiveRow>(
    `SELECT id, categoria_slug, clave, nombre, tipo, estado, histamina, confianza, notas, alias_json
     FROM aditivos
     WHERE id = ?`,
    [id],
  );
}

export async function getTiposAditivo() {
  const db = await getDb();

  return db.getAllAsync<{ tipo: string }>(
    `SELECT DISTINCT tipo
     FROM aditivos
     ORDER BY tipo ASC`,
  );
}

export async function createAditivo({
  clave,
  nombre,
  tipo,
  estado,
  histamina,
  notas,
}: {
  clave: string;
  nombre: string;
  tipo: string;
  estado: string;
  histamina: number;
  notas?: string;
}) {
  const db = await getDb();

  await db.runAsync(
    `INSERT INTO aditivos (categoria_slug, clave, nombre, tipo, estado, histamina, notas)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    ["aditivos", clave, nombre, tipo, estado, histamina, notas?.trim() || null],
  );
}

export async function updateAditivo({
  id,
  nombre,
  tipo,
  estado,
  histamina,
  notas,
}: {
  id: number;
  nombre: string;
  tipo: string;
  estado: string;
  histamina: number;
  notas?: string;
}) {
  const db = await getDb();

  await db.runAsync(
    `UPDATE aditivos
     SET nombre = ?,
         tipo = ?,
         estado = ?,
         histamina = ?,
         notas = ?,
         updated_at = CURRENT_TIMESTAMP
     WHERE id = ?`,
    [nombre, tipo, estado, histamina, notas?.trim() || null, id],
  );
}

export async function deleteAditivo(id: number) {
  const db = await getDb();

  await db.runAsync(`DELETE FROM aditivos WHERE id = ?`, [id]);
}
