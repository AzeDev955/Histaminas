import React, { useEffect, useMemo, useState } from "react";
import {
  StyleSheet,
  Text,
  FlatList,
  View,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ItemCard from "@/components/Itemcard";
import CategoryCard from "../../components/CategoryCard";
import SearchBar from "../../components/SearchBar";
import { Ionicons } from "@expo/vector-icons";
import { getHistaminaConfig } from "../../utils/helpers";
import { initDb, resetDatabase } from "../../database/db";
import { seedDatabaseIfNeeded } from "../../database/seed";
import { useFoods } from "../../hooks/useFoods";
import { router } from "expo-router";

export default function HomeScreen() {
  const [search, setSearch] = useState("");
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<
    string | null
  >(null);
  const [filtroHistamina, setFiltroHistamina] = useState<number | null>(null);
  const [ready, setReady] = useState(false);

  const { foods, categories, loading, refresh } = useFoods();

  useEffect(() => {
    (async () => {
      await initDb();
      await seedDatabaseIfNeeded();
      await refresh();
      setReady(true);
    })();
  }, [refresh]);

  const alimentosFiltrados = useMemo(() => {
    let lista = foods.map((item) => ({
      id: String(item.id),
      dbId: item.id,
      categoriaId: item.categoria_slug,
      categoria: item.categoria_slug
        .replace(/_/g, " ")
        .replace(/\b\w/g, (l) => l.toUpperCase()),
      nombre: item.nombre,
      histamina: item.histamina,
    }));

    let hayFiltroActivo = false;

    if (search) {
      lista = lista.filter((a) =>
        a.nombre.toLowerCase().includes(search.toLowerCase()),
      );
      hayFiltroActivo = true;
    }

    if (categoriaSeleccionada) {
      lista = lista.filter((a) => a.categoriaId === categoriaSeleccionada);
      hayFiltroActivo = true;
    }

    if (filtroHistamina !== null) {
      lista = lista.filter((a) => a.histamina === filtroHistamina);
      hayFiltroActivo = true;
    }

    return hayFiltroActivo ? lista : null;
  }, [foods, search, categoriaSeleccionada, filtroHistamina]);

  const volverAlIndice = () => {
    setCategoriaSeleccionada(null);
    setFiltroHistamina(null);
    setSearch("");
  };

  const manejarResetDb = () => {
    Alert.alert(
      "Resetear base de datos",
      "Se borrarán los cambios locales y se volverá a cargar el catálogo base. ¿Quieres continuar?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Resetear",
          style: "destructive",
          onPress: async () => {
            try {
              setReady(false);

              await resetDatabase();
              await initDb();
              await seedDatabaseIfNeeded();
              await refresh();

              volverAlIndice();
              setReady(true);

              Alert.alert("Hecho", "La base de datos se ha restaurado.");
            } catch (error) {
              setReady(true);
              Alert.alert("Error", "No se pudo resetear la base de datos.");
            }
          },
        },
      ],
    );
  };

  if (!ready || loading) {
    return (
      <SafeAreaView style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loaderText}>Cargando alimentos…</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <View style={styles.header}>
          {(categoriaSeleccionada || filtroHistamina !== null) && !search && (
            <TouchableOpacity
              onPress={volverAlIndice}
              style={styles.backButton}
            >
              <Ionicons name="arrow-back" size={24} color="#007AFF" />
            </TouchableOpacity>
          )}
          <Text style={styles.headerTitle}>
            {search
              ? "Resultados"
              : categoriaSeleccionada
                ? categoriaSeleccionada.toUpperCase()
                : "Mi Compra"}
          </Text>
        </View>

        {!search && !categoriaSeleccionada && (
          <Text style={styles.infoSubtitle}>
            Puedes comer cualquier cosa del nivel 0 y 1. El nivel 2 hay que
            probar tolerancia y deberíamos evitar el nivel 3. Te amo, siempre
          </Text>
        )}
      </View>

      <SearchBar value={search} onChangeText={setSearch} />

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => router.push("/nuevo-alimento")}
      >
        <Ionicons name="add-circle-outline" size={20} color="#FFF" />
        <Text style={styles.addButtonText}>Añadir alimento</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.resetButton} onPress={manejarResetDb}>
        <Ionicons name="refresh-outline" size={20} color="#FFF" />
        <Text style={styles.resetButtonText}>Resetear base de datos</Text>
      </TouchableOpacity>

      <View style={styles.histaminaFilterContainer}>
        {[0, 1, 2, 3].map((nivel) => {
          const config = getHistaminaConfig(nivel);
          const isSelected = filtroHistamina === nivel;

          return (
            <TouchableOpacity
              key={nivel}
              style={[
                styles.histaminaButton,
                { borderColor: config.color },
                isSelected && { backgroundColor: config.color },
              ]}
              onPress={() => setFiltroHistamina(isSelected ? null : nivel)}
            >
              <Text
                style={[
                  styles.histaminaButtonText,
                  { color: isSelected ? "#FFF" : config.color },
                ]}
              >
                Nivel {nivel}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {alimentosFiltrados === null && !search ? (
        <FlatList
          data={categories}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <CategoryCard
              nombre={item.nombre}
              cantidad={item.cantidad}
              icon={item.icon}
              onPress={() => setCategoriaSeleccionada(item.id)}
            />
          )}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <FlatList
          data={alimentosFiltrados ?? []}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <ItemCard item={item} />}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={
            <Text style={styles.emptyText}>
              No se encontraron alimentos con estos filtros.
            </Text>
          }
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F5F7" },
  loaderContainer: {
    flex: 1,
    backgroundColor: "#F5F5F7",
    justifyContent: "center",
    alignItems: "center",
  },
  loaderText: {
    marginTop: 12,
    color: "#6B7280",
    fontSize: 15,
  },
  headerContainer: { marginBottom: 5 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 20,
    position: "relative",
  },
  backButton: { position: "absolute", left: 20, zIndex: 10 },
  headerTitle: { fontSize: 26, fontWeight: "800", color: "#1C1C1E" },
  infoSubtitle: {
    fontSize: 14,
    color: "#8E8E93",
    textAlign: "center",
    paddingHorizontal: 30,
    lineHeight: 20,
    marginBottom: 10,
  },
  listContainer: { paddingHorizontal: 20, paddingBottom: 20 },
  histaminaFilterContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
    marginHorizontal: 20,
    marginBottom: 16,
    flexWrap: "wrap",
  },
  histaminaButton: {
    borderWidth: 1.5,
    borderRadius: 999,
    paddingVertical: 8,
    paddingHorizontal: 14,
  },
  histaminaButtonText: {
    fontWeight: "700",
    fontSize: 14,
  },
  emptyText: {
    textAlign: "center",
    color: "#8E8E93",
    fontSize: 15,
    marginTop: 30,
  },
  addButton: {
    marginHorizontal: 20,
    marginBottom: 16,
    backgroundColor: "#007AFF",
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
  },
  addButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "800",
  },
  resetButton: {
    marginHorizontal: 20,
    marginBottom: 16,
    backgroundColor: "#FF3B30",
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
  },
  resetButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "800",
  },
});
