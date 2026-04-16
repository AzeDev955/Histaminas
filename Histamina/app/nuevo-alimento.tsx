import React, { useEffect, useState } from "react";
import { Alert, ScrollView, StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import FoodForm from "../components/FoodForm";
import { addFood, getCategorySlugs } from "../database/foods";

function slugify(texto: string) {
  return texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "_");
}

export default function NuevoAlimentoScreen() {
  const [nombre, setNombre] = useState("");
  const [clave, setClave] = useState("");
  const [categoriaSlug, setCategoriaSlug] = useState("");
  const [estado, setEstado] = useState("normal");
  const [histamina, setHistamina] = useState(0);
  const [categorias, setCategorias] = useState<string[]>([]);

  useEffect(() => {
    (async () => {
      const rows = await getCategorySlugs();
      const slugs = rows.map((r) => r.categoria_slug);
      setCategorias(slugs);

      if (slugs.length > 0) {
        setCategoriaSlug(slugs[0]);
      }
    })();
  }, []);

  const guardar = async () => {
    if (!nombre.trim()) {
      Alert.alert("Falta el nombre", "Escribe un nombre para el alimento.");
      return;
    }

    if (!categoriaSlug) {
      Alert.alert("Falta la categoría", "Selecciona una categoría.");
      return;
    }

    const finalClave = clave.trim() || slugify(nombre);

    try {
      await addFood({
        nombre: nombre.trim(),
        clave: finalClave,
        categoriaSlug,
        estado,
        histamina,
      });

      Alert.alert("Guardado", "El alimento se ha añadido correctamente.", [
        {
          text: "OK",
          onPress: () => router.back(),
        },
      ]);
    } catch (error) {
      Alert.alert(
        "No se pudo guardar",
        "Puede que ya exista este alimento con el mismo estado dentro de la categoría.",
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>Nuevo alimento</Text>
        <Text style={styles.subtitle}>
          Añade un alimento nuevo a tu base local.
        </Text>

        <FoodForm
          nombre={nombre}
          setNombre={setNombre}
          categoriaSlug={categoriaSlug}
          setCategoriaSlug={setCategoriaSlug}
          clave={clave}
          setClave={setClave}
          estado={estado}
          setEstado={setEstado}
          histamina={histamina}
          setHistamina={setHistamina}
          categoriasDisponibles={categorias}
          onSubmit={guardar}
          submitLabel="Guardar alimento"
          showClave
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F5F7" },

  scroll: {
    paddingTop: 10,
    paddingBottom: 40,
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
});
