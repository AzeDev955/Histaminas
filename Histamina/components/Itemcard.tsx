import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { getHistaminaConfig } from "../utils/helpers";

interface BaseItem {
  id: string;
  dbId?: number;
  nombre: string;
  categoria: string;
  estado: string;
  histamina: number;
  tipo?: string;
}

interface Props {
  item: BaseItem;
  modo: "alimentos" | "aditivos";
}

export default function ItemCard({ item, modo }: Props) {
  const config = getHistaminaConfig(item.histamina);
  const accentColor = modo === "aditivos" ? "#5856D6" : config.color;

  const onPress = () => {
    if (!item.dbId) return;

    if (modo === "aditivos") {
      router.push({
        pathname: "/editar-aditivo/[id]",
        params: { id: String(item.dbId) },
      });
      return;
    }

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
      style={[styles.card, { borderLeftColor: accentColor }]}
    >
      <View style={styles.info}>
        <Text style={styles.nombre} numberOfLines={2}>
          {item.nombre}
        </Text>

        <Text style={styles.categoria} numberOfLines={1}>
          {modo === "aditivos" && item.tipo
            ? `${item.tipo} · ${item.estado}`
            : `${item.categoria} · ${item.estado}`}
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
