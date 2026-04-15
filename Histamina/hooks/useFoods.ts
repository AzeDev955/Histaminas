import { useCallback, useEffect, useState } from "react";
import { getDb } from "../database/db";

export interface FoodItem {
  id: number;
  categoria_slug: string;
  clave: string;
  nombre: string;
  histamina: number;
}

export interface CategoryItem {
  id: string;
  nombre: string;
  cantidad: number;
  icon: string;
}

function getCategoryIcon(key: string) {
  switch (key) {
    case "verduras":
    case "verduras_y_hortalizas":
    case "verduras_y_setas":
      return "leaf";
    case "frutas":
    case "frutas_seguras":
      return "nutrition";
    case "lacteos":
    case "lacteos_y_huevos":
      return "water";
    case "carnes":
      return "egg";
    case "pescados_y_mariscos":
    case "pescados y mariscos":
      return "boat";
    case "bebidas":
      return "beer";
    case "especias_y_condimentos":
    case "especias y condimentos":
      return "flame";
    default:
      return "restaurant";
  }
}

function prettyCategoryName(slug: string) {
  return slug.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
}

export function useFoods() {
  const [foods, setFoods] = useState<FoodItem[]>([]);
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const db = await getDb();

    const alimentos = await db.getAllAsync<FoodItem>(
      `SELECT id, categoria_slug, clave, nombre, histamina
       FROM alimentos
       ORDER BY nombre COLLATE NOCASE ASC`,
    );

    const categoriasRaw = await db.getAllAsync<{
      categoria_slug: string;
      cantidad: number;
    }>(
      `SELECT categoria_slug, COUNT(*) as cantidad
       FROM alimentos
       GROUP BY categoria_slug
       ORDER BY categoria_slug ASC`,
    );

    setFoods(alimentos);

    setCategories(
      categoriasRaw.map((c) => ({
        id: c.categoria_slug,
        nombre: prettyCategoryName(c.categoria_slug),
        cantidad: c.cantidad,
        icon: getCategoryIcon(c.categoria_slug),
      })),
    );

    setLoading(false);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { foods, categories, loading, refresh };
}
