import { useCallback, useEffect, useState } from "react";
import { getDb } from "../database/db";

export interface FoodItem {
  id: number;
  categoria_slug: string;
  clave: string;
  nombre: string;
  histamina: number;
}

type IoniconName =
  | "leaf"
  | "nutrition"
  | "water"
  | "egg"
  | "boat"
  | "beer"
  | "flame"
  | "restaurant";

export interface CategoryItem {
  id: string;
  nombre: string;
  cantidad: number;
  icon: IoniconName;
}

function getCategoryIcon(key: string): IoniconName {
  switch (key) {
    case "verduras":
      return "leaf";
    case "frutas":
      return "nutrition";
    case "lacteos":
      return "water";
    case "huevos":
      return "egg";
    case "pescados":
      return "boat";
    case "bebidas":
      return "beer";
    case "especias":
      return "flame";
    case "cereales":
      return "restaurant";
    case "dulces":
      return "restaurant";
    case "grasas":
      return "restaurant";
    case "carnes":
      return "restaurant";
    case "legumbres":
      return "restaurant";
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
