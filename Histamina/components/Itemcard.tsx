import React from "react";
import { View, Text, StyleSheet } from "react-native";
// Asumimos que pondremos helpers en una carpeta utils en la raíz
import { getHistaminaConfig } from "../utils/helpers";

// Definimos la forma de nuestros datos
interface Alimento {
  id: string;
  nombre: string;
  categoria: string;
  histamina: number;
}

interface Props {
  item: Alimento;
}

export default function ItemCard({ item }: Props) {
  const config = getHistaminaConfig(item.histamina);

  return (
    <View style={[styles.card, { borderLeftColor: config.color }]}>
      <View style={styles.info}>
        <Text style={styles.nombre}>{item.nombre}</Text>
        <Text style={styles.categoria}>{item.categoria}</Text>
      </View>
      <View style={[styles.badge, { backgroundColor: config.color + "20" }]}>
        <Text style={[styles.badgeText, { color: config.color }]}>
          {config.texto}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#FFF",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    borderLeftWidth: 6,
  },
  info: {
    flex: 1,
  },
  nombre: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  categoria: {
    fontSize: 13,
    color: "#888",
    marginTop: 4,
  },
  badge: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "700",
  },
});
