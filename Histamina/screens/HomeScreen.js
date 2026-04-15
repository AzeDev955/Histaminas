import React, { useMemo } from "react";
import { StyleSheet, Text, SafeAreaView, FlatList, View } from "react-native";
import { MOCK_DATA } from "../data/alimentos";
import ItemCard from "../components/Itemcard";

export default function HomeScreen() {
  // Transformamos el JSON en un Array para que FlatList lo entienda
  const alimentosArray = useMemo(() => {
    const arrayPlano = [];
    const categorias = Object.keys(MOCK_DATA.alimentos);

    categorias.forEach((categoria) => {
      const items = MOCK_DATA.alimentos[categoria];
      Object.keys(items).forEach((key) => {
        arrayPlano.push({
          id: `${categoria}-${key}`,
          categoria: categoria.charAt(0).toUpperCase() + categoria.slice(1),
          nombre: items[key].nombre,
          histamina: items[key].histamina,
        });
      });
    });

    // Ordenamos alfabéticamente
    return arrayPlano.sort((a, b) => a.nombre.localeCompare(b.nombre));
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.headerTitle}>Semáforo de Histamina</Text>

      {/* Aquí renderizamos nuestra lista */}
      <FlatList
        data={alimentosArray}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ItemCard item={item} />}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F7", // Un gris muy clarito tipo Apple
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: "800",
    textAlign: "center",
    marginTop: 20,
    marginBottom: 20,
    color: "#1C1C1E",
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
});
