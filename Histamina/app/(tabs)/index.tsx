import React, { useEffect, useMemo, useState } from "react";
import {
  StyleSheet,
  Text,
  FlatList,
  View,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  ListRenderItem,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ItemCard from "@/components/Itemcard";
import CategoryCard from "../../components/CategoryCard";
import SearchBar from "../../components/SearchBar";
import { Ionicons } from "@expo/vector-icons";
import { getHistaminaConfig } from "../../utils/helpers";
import { initDb, resetDatabase } from "../../database/db";
import { seedDatabaseIfNeeded } from "../../database/seed";
import { useFoods, CategoryItem, CatalogMode } from "../../hooks/useFoods";
import { router } from "expo-router";
import { TEXTO } from "@/constants/msg";

type FoodListItem = {
  id: string;
  dbId: number;
  categoriaId: string;
  categoria: string;
  nombre: string;
  estado: string;
  histamina: number;
  itemType: "food";
};

type AdditiveListItem = {
  id: string;
  dbId: number;
  categoriaId: string;
  categoria: string;
  nombre: string;
  tipo: string;
  estado: string;
  histamina: number;
  itemType: "additive";
};

type HomeListItem = FoodListItem | AdditiveListItem | CategoryItem;

function isCategoryItem(item: HomeListItem): item is CategoryItem {
  return "cantidad" in item && "icon" in item;
}

function prettyLabel(texto: string) {
  return texto.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
}

export default function HomeScreen() {
  const [modo, setModo] = useState<CatalogMode>("alimentos");
  const [search, setSearch] = useState("");
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<
    string | null
  >(null);
  const [filtroHistamina, setFiltroHistamina] = useState<number | null>(null);
  const [ready, setReady] = useState(false);

  const {
    foods,
    foodCategories,
    additives,
    additiveCategories,
    loading,
    refresh,
  } = useFoods();

  const FORCE_RESET_ON_BOOT = false;

  useEffect(() => {
    (async () => {
      try {
        if (FORCE_RESET_ON_BOOT) {
          await resetDatabase();
        } else {
          await initDb();
        }

        await seedDatabaseIfNeeded();
        await refresh();
        setReady(true);
      } catch (error) {
        console.error("Error al iniciar la base de datos:", error);
        setReady(true);
      }
    })();
  }, [refresh]);

  const itemsFiltrados = useMemo<
    FoodListItem[] | AdditiveListItem[] | null
  >(() => {
    if (modo === "alimentos") {
      let lista: FoodListItem[] = foods.map((item) => ({
        id: `food-${item.id}`,
        dbId: item.id,
        categoriaId: item.categoria_slug,
        categoria: prettyLabel(item.categoria_slug),
        nombre: item.nombre,
        estado: prettyLabel(item.estado),
        histamina: item.histamina,
        itemType: "food",
      }));

      let hayFiltroActivo = false;

      if (search) {
        lista = lista.filter((a) =>
          `${a.nombre} ${a.estado}`
            .toLowerCase()
            .includes(search.toLowerCase()),
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
    }

    let lista: AdditiveListItem[] = additives.map((item) => ({
      id: `additive-${item.id}`,
      dbId: item.id,
      categoriaId: item.tipo,
      categoria: prettyLabel(item.tipo),
      nombre: item.nombre,
      tipo: prettyLabel(item.tipo),
      estado: prettyLabel(item.estado),
      histamina: item.histamina,
      itemType: "additive",
    }));

    let hayFiltroActivo = false;

    if (search) {
      lista = lista.filter((a) =>
        `${a.nombre} ${a.tipo} ${a.estado}`
          .toLowerCase()
          .includes(search.toLowerCase()),
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
  }, [modo, foods, additives, search, categoriaSeleccionada, filtroHistamina]);

  const volverAlIndice = () => {
    setCategoriaSeleccionada(null);
    setFiltroHistamina(null);
    setSearch("");
  };

  const cambiarModo = (nuevoModo: CatalogMode) => {
    setModo(nuevoModo);
    volverAlIndice();
  };

  const manejarResetDb = () => {
    Alert.alert(
      "Resetear base de datos",
      "Se borrarán los cambios locales y se volverán a cargar alimentos y aditivos base. ¿Quieres continuar?",
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
            } catch {
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
        <Text style={styles.loaderText}>Cargando catálogo…</Text>
      </SafeAreaView>
    );
  }

  const categoriasActuales =
    modo === "alimentos" ? foodCategories : additiveCategories;
  const mostrandoCategorias = itemsFiltrados === null && !search;
  const dataToRender: HomeListItem[] = mostrandoCategorias
    ? categoriasActuales
    : (itemsFiltrados ?? []);

  const renderItem: ListRenderItem<HomeListItem> = ({ item }) => {
    if (mostrandoCategorias && isCategoryItem(item)) {
      return (
        <CategoryCard
          nombre={item.nombre}
          cantidad={item.cantidad}
          icon={item.icon}
          onPress={() => setCategoriaSeleccionada(item.id)}
        />
      );
    }

    if (!mostrandoCategorias && !isCategoryItem(item)) {
      return <ItemCard item={item} modo={modo} />;
    }

    return null;
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList<HomeListItem>
        data={dataToRender}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListHeaderComponent={
          <>
            <View style={styles.headerContainer}>
              <View style={styles.header}>
                {(categoriaSeleccionada || filtroHistamina !== null) &&
                  !search && (
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
                      ? prettyLabel(categoriaSeleccionada)
                      : modo === "alimentos"
                        ? "Alimentos"
                        : "Aditivos"}
                </Text>
              </View>

              {!search && !categoriaSeleccionada && (
                <Text style={styles.infoSubtitle}>
                  Filtra por nivel y cambia entre alimentos y aditivos sin salir
                  de la pantalla principal.
                  {TEXTO}
                </Text>
              )}
            </View>

            <View style={styles.modeSwitch}>
              <TouchableOpacity
                style={[
                  styles.modeButton,
                  modo === "alimentos" && styles.modeButtonActive,
                ]}
                onPress={() => cambiarModo("alimentos")}
              >
                <Text
                  style={[
                    styles.modeButtonText,
                    modo === "alimentos" && styles.modeButtonTextActive,
                  ]}
                >
                  Alimentos
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.modeButton,
                  modo === "aditivos" && styles.modeButtonActive,
                ]}
                onPress={() => cambiarModo("aditivos")}
              >
                <Text
                  style={[
                    styles.modeButtonText,
                    modo === "aditivos" && styles.modeButtonTextActive,
                  ]}
                >
                  Aditivos
                </Text>
              </TouchableOpacity>
            </View>

            <SearchBar value={search} onChangeText={setSearch} />

            {modo === "alimentos" && (
              <TouchableOpacity
                style={styles.addButton}
                onPress={() => router.push("/nuevo-alimento")}
              >
                <Ionicons name="add-circle-outline" size={20} color="#FFF" />
                <Text style={styles.addButtonText}>Añadir alimento</Text>
              </TouchableOpacity>
            )}

            {modo === "aditivos" && (
              <TouchableOpacity
                style={[styles.addButton, styles.addButtonAdditive]}
                onPress={() => router.push("/nuevo-aditivo")}
              >
                <Ionicons name="flask-outline" size={20} color="#FFF" />
                <Text style={styles.addButtonText}>Añadir aditivo</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={styles.resetButton}
              onPress={manejarResetDb}
            >
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
                    onPress={() =>
                      setFiltroHistamina(isSelected ? null : nivel)
                    }
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
          </>
        }
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            No se encontraron elementos con estos filtros.
          </Text>
        }
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
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

  headerContainer: {
    marginBottom: 5,
    paddingTop: 10,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 20,
    position: "relative",
  },

  backButton: {
    position: "absolute",
    left: 20,
    zIndex: 10,
  },

  headerTitle: {
    fontSize: 26,
    fontWeight: "800",
    color: "#1C1C1E",
    textAlign: "center",
    paddingHorizontal: 48,
  },

  infoSubtitle: {
    fontSize: 14,
    color: "#8E8E93",
    textAlign: "center",
    paddingHorizontal: 30,
    lineHeight: 20,
    marginBottom: 10,
  },

  modeSwitch: {
    flexDirection: "row",
    backgroundColor: "#E9E9ED",
    marginHorizontal: 20,
    marginBottom: 14,
    borderRadius: 12,
    padding: 4,
  },

  modeButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
  },

  modeButtonActive: {
    backgroundColor: "#FFFFFF",
  },

  modeButtonText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#6B7280",
  },

  modeButtonTextActive: {
    color: "#1C1C1E",
  },

  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },

  addButton: {
    marginHorizontal: 20,
    marginBottom: 12,
    backgroundColor: "#007AFF",
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
  },

  addButtonAdditive: {
    backgroundColor: "#5856D6",
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
});
