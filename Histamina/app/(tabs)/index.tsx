import React, { useState, useMemo } from "react";
import {
  StyleSheet,
  Text,
  FlatList,
  View,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MOCK_DATA } from "../../constants/alimentos";
import ItemCard from "@/components/Itemcard";
import CategoryCard from "../../components/CategoryCard";
import SearchBar from "../../components/SearchBar";
import { Ionicons } from "@expo/vector-icons";
import { getHistaminaConfig } from "../../utils/helpers"; // Importamos para los colores de los botones

export default function HomeScreen() {
  const [search, setSearch] = useState("");
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<
    string | null
  >(null);
  // Nuevo estado para el filtro por botones (0, 1, 2, 3 o null si no hay ninguno seleccionado)
  const [filtroHistamina, setFiltroHistamina] = useState<number | null>(null);

  // 1. Extraemos las categorías del JSON para el índice
  const categorias = useMemo(() => {
    return Object.keys(MOCK_DATA.alimentos).map((key) => ({
      id: key,
      nombre: key.charAt(0).toUpperCase() + key.slice(1),
      cantidad: Object.keys((MOCK_DATA.alimentos as any)[key]).length,
      icon: (() => {
        switch (key) {
          case "verduras":
            return "leaf";
          case "frutas":
            return "nutrition";
          case "lacteos y huevos":
            return "water";
          case "carnes":
            return "egg";
          case "pescados y mariscos":
            return "boat";
          case "bebidas":
            return "beer";
          case "especias y condimentos":
            return "flame";
          default:
            return "restaurant";
        }
      })(),
    }));
  }, []);

  // 2. Lógica de filtrado combinado
  const alimentosFiltrados = useMemo(() => {
    let lista: any[] = [];
    let hayFiltroActivo = false;

    // Aplanamos los datos
    Object.keys(MOCK_DATA.alimentos).forEach((cat) => {
      const items = (MOCK_DATA.alimentos as any)[cat];
      Object.keys(items).forEach((key) => {
        lista.push({
          id: `${cat}-${key}`,
          categoriaId: cat,
          categoria: cat.charAt(0).toUpperCase() + cat.slice(1),
          ...items[key],
        });
      });
    });

    // Aplicamos filtro por búsqueda de texto
    if (search) {
      lista = lista.filter((a) =>
        a.nombre.toLowerCase().includes(search.toLowerCase()),
      );
      hayFiltroActivo = true;
    }

    // Aplicamos filtro por categoría
    if (categoriaSeleccionada) {
      lista = lista.filter((a) => a.categoriaId === categoriaSeleccionada);
      hayFiltroActivo = true;
    }

    // Aplicamos filtro por nivel de histamina (los botones)
    if (filtroHistamina !== null) {
      lista = lista.filter((a) => a.histamina === filtroHistamina);
      hayFiltroActivo = true;
    }

    // Si no hay ningún filtro de ningún tipo, devolvemos null para renderizar el índice
    return hayFiltroActivo ? lista : null;
  }, [search, categoriaSeleccionada, filtroHistamina]);

  // Función para volver al índice limpiando los filtros
  const volverAlIndice = () => {
    setCategoriaSeleccionada(null);
    setFiltroHistamina(null);
    setSearch("");
  };

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

        {/* Texto informativo, visible solo en la pantalla de inicio principal */}
        {!search && !categoriaSeleccionada && (
          <Text style={styles.infoSubtitle}>
            Puedes comer cualquier cosa del nivel 0 y 1. El nivel 2 hay que
            probar tolerancia y deberíamos evitar el nivel 3. Te amo, siempre
          </Text>
        )}
      </View>

      <SearchBar value={search} onChangeText={setSearch} />

      {/* NUEVO: Botonera de Filtros de Histamina */}
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

      {/* RENDERIZADO CONDICIONAL: Índice o Lista */}
      {alimentosFiltrados === null && !search ? (
        <FlatList
          data={categorias}
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
          data={alimentosFiltrados}
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
  headerContainer: {
    marginBottom: 5,
  },
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
  emptyText: {
    textAlign: "center",
    marginTop: 50,
    color: "#8E8E93",
    fontSize: 16,
  },

  // Estilos de los nuevos botones
  histaminaFilterContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginBottom: 20,
    gap: 8,
  },
  histaminaButton: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFF",
  },
  histaminaButtonText: {
    fontSize: 13,
    fontWeight: "700",
  },
});
