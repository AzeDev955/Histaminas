import { useCallback, useEffect, useState } from "react";
import { getDb } from "../database/db";

export type CatalogMode = "alimentos" | "aditivos";

export interface FoodItem {
  id: number;
  categoria_slug: string;
  clave: string;
  nombre: string;
  estado: string;
  histamina: number;
}

export interface AdditiveItem {
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

type IoniconName =
  | "leaf"
  | "nutrition"
  | "water"
  | "egg"
  | "boat"
  | "beer"
  | "flame"
  | "restaurant"
  | "flask";

export interface CategoryItem {
  id: string;
  nombre: string;
  cantidad: number;
  icon: IoniconName;
}

function getFoodCategoryIcon(key: string): IoniconName {
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
    default:
      return "restaurant";
  }
}

function getAdditiveTypeIcon(key: string): IoniconName {
  switch (key) {
    case "conservante":
      return "flask";
    case "antioxidante":
      return "flask";
    case "potenciador":
      return "flask";
    case "secuestrante":
      return "flask";
    default:
      return "flask";
  }
}

function prettyLabel(slug: string) {
  return slug.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
}

export function useFoods() {
  const [foods, setFoods] = useState<FoodItem[]>([]);
  const [foodCategories, setFoodCategories] = useState<CategoryItem[]>([]);
  const [additives, setAdditives] = useState<AdditiveItem[]>([]);
  const [additiveCategories, setAdditiveCategories] = useState<CategoryItem[]>(
    [],
  );
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const db = await getDb();

    const alimentos = await db.getAllAsync<FoodItem>(
      `SELECT id, categoria_slug, clave, nombre, estado, histamina
       FROM alimentos
       ORDER BY nombre COLLATE NOCASE ASC, estado COLLATE NOCASE ASC`,
    );

    const categoriasAlimentos = await db.getAllAsync<{
      categoria_slug: string;
      cantidad: number;
    }>(
      `SELECT categoria_slug, COUNT(*) as cantidad
       FROM alimentos
       GROUP BY categoria_slug
       ORDER BY categoria_slug ASC`,
    );

    const aditivos = await db.getAllAsync<AdditiveItem>(
      `SELECT id, categoria_slug, clave, nombre, tipo, estado, histamina, confianza, notas, alias_json
       FROM aditivos
       ORDER BY nombre COLLATE NOCASE ASC`,
    );

    const categoriasAditivos = await db.getAllAsync<{
      tipo: string;
      cantidad: number;
    }>(
      `SELECT tipo, COUNT(*) as cantidad
       FROM aditivos
       GROUP BY tipo
       ORDER BY tipo ASC`,
    );

    setFoods(alimentos);
    setFoodCategories(
      categoriasAlimentos.map((c) => ({
        id: c.categoria_slug,
        nombre: prettyLabel(c.categoria_slug),
        cantidad: c.cantidad,
        icon: getFoodCategoryIcon(c.categoria_slug),
      })),
    );

    setAdditives(aditivos);
    setAdditiveCategories(
      categoriasAditivos.map((c) => ({
        id: c.tipo,
        nombre: prettyLabel(c.tipo),
        cantidad: c.cantidad,
        icon: getAdditiveTypeIcon(c.tipo),
      })),
    );

    setLoading(false);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return {
    foods,
    foodCategories,
    additives,
    additiveCategories,
    loading,
    refresh,
  };
}
