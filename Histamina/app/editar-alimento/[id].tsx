import React, { useEffect, useState } from "react";
import { Alert, ScrollView, StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";
import FoodForm from "../../components/FoodForm";
import {
  deleteFood,
  getCategorySlugs,
  getFoodById,
  updateFood,
} from "../../database/foods";
import { TouchableOpacity } from "react-native";

export default function EditarAlimentoScreen() {
  const params = useLocalSearchParams<{ id: string }>();

  const [foodId, setFoodId] = useState<number | null>(null);
  const [nombre, setNombre] = useState("");
  const [clave, setClave] = useState("");
  const [categoriaSlug, setCategoriaSlug] = useState("");
  const [histamina, setHistamina] = useState(0);
  const [categorias, setCategorias] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const id = Number(params.id);
      if (!id) return;

      const [food, categoryRows] = await Promise.all([
        getFoodById(id),
        getCategorySlugs(),
      ]);

      const slugs = categoryRows.map((r) => r.categoria_slug);
      setCategorias(slugs);

      if (food) {
        setFoodId(food.id);
        setNombre(food.nombre);
        setClave(food.clave);
        setCategoriaSlug(food.categoria_slug);
        setHistamina(food.histamina);
      }

      setLoading(false);
    })();
  }, [params.id]);

  const guardar = async () => {
    if (!foodId) return;

    if (!nombre.trim()) {
      Alert.alert("Falta el nombre", "Escribe un nombre para el alimento.");
      return;
    }

    try {
      await updateFood({
        id: foodId,
        nombre: nombre.trim(),
        categoriaSlug,
        histamina,
      });

      Alert.alert("Cambios guardados", "El alimento se ha actualizado.", [
        {
          text: "OK",
          onPress: () => router.back(),
        },
      ]);
    } catch {
      Alert.alert("Error", "No se pudo actualizar el alimento.");
    }
  };

  const eliminar = async () => {
    if (!foodId) return;

    Alert.alert(
      "Eliminar alimento",
      `¿Seguro que quieres eliminar "${nombre}"?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            await deleteFood(foodId);
            router.back();
          },
        },
      ],
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.loading}>Cargando alimento…</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>Editar alimento</Text>
        <Text style={styles.subtitle}>
          Puedes cambiar nombre, categoría y nivel.
        </Text>

        <FoodForm
          nombre={nombre}
          setNombre={setNombre}
          categoriaSlug={categoriaSlug}
          setCategoriaSlug={setCategoriaSlug}
          clave={clave}
          histamina={histamina}
          setHistamina={setHistamina}
          categoriasDisponibles={categorias}
          onSubmit={guardar}
          submitLabel="Guardar cambios"
        />

        <TouchableOpacity style={styles.deleteButton} onPress={eliminar}>
          <Text style={styles.deleteButtonText}>Eliminar alimento</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F5F7" },
  scroll: { paddingTop: 10, paddingBottom: 40 },
  loading: {
    padding: 20,
    fontSize: 16,
    color: "#6B7280",
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#1C1C1E",
    paddingHorizontal: 20,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 15,
    color: "#6B7280",
    paddingHorizontal: 20,
    marginBottom: 8,
  },
  deleteButton: {
    marginHorizontal: 20,
    marginTop: 10,
    backgroundColor: "#FF3B30",
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: "center",
  },
  deleteButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "800",
  },
});
