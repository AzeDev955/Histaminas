import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { getHistaminaConfig } from "../utils/helpers";

interface Alimento {
  id: string;
  dbId?: number;
  nombre: string;
  categoria: string;
  histamina: number;
}

interface Props {
  item: Alimento;
}

export default function ItemCard({ item }: Props) {
  const config = getHistaminaConfig(item.histamina);

  const onPress = () => {
    if (!item.dbId) return;

    router.push({
      pathname: "/editar-alimento/[id]",
      params: { id: String(item.dbId) },
    });
  };

  return (
    <TouchableOpacity
      activeOpacity={0.75}
      onPress={onPress}
      disabled={!item.dbId}
      style={[styles.card, { borderLeftColor: config.color }]}
    >
      <View style={styles.info}>
        <Text style={styles.nombre} numberOfLines={2}>
          {item.nombre}
        </Text>
        <Text style={styles.categoria} numberOfLines={1}>
          {item.categoria}
        </Text>
      </View>

      <View style={styles.rightSide}>
        <View style={[styles.badge, { backgroundColor: `${config.color}20` }]}>
          <Text style={[styles.badgeText, { color: config.color }]}>
            {config.texto}
          </Text>
        </View>

        <Ionicons
          name="chevron-forward"
          size={18}
          color="#C7C7CC"
          style={styles.chevron}
        />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
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
    paddingRight: 12,
  },

  nombre: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1C1C1E",
  },

  categoria: {
    fontSize: 13,
    color: "#8E8E93",
    marginTop: 4,
    textTransform: "capitalize",
  },

  rightSide: {
    alignItems: "flex-end",
    justifyContent: "center",
    marginLeft: 8,
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

  chevron: {
    marginTop: 8,
  },
});
