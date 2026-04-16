import React from "react";
import { TouchableOpacity, Text, StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

type IoniconName =
  | "leaf"
  | "nutrition"
  | "water"
  | "egg"
  | "boat"
  | "beer"
  | "flame"
  | "restaurant";

interface CategoryCardProps {
  nombre: string;
  cantidad: number;
  onPress: () => void;
  icon: IoniconName;
}

export default function CategoryCard({
  nombre,
  cantidad,
  onPress,
  icon,
}: CategoryCardProps) {
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.75}
    >
      <View style={styles.iconContainer}>
        <Ionicons name={icon} size={26} color="#007AFF" />
      </View>

      <View style={styles.textContainer}>
        <Text style={styles.title} numberOfLines={1}>
          {nombre}
        </Text>
        <Text style={styles.subtitle}>
          {cantidad} {cantidad === 1 ? "alimento" : "alimentos"}
        </Text>
      </View>

      <Ionicons name="chevron-forward" size={18} color="#C7C7CC" />
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
  },

  iconContainer: {
    width: 46,
    height: 46,
    backgroundColor: "#F0F7FF",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },

  textContainer: {
    flex: 1,
    paddingRight: 10,
  },

  title: {
    fontSize: 17,
    fontWeight: "700",
    color: "#1C1C1E",
  },

  subtitle: {
    fontSize: 13,
    color: "#8E8E93",
    marginTop: 4,
  },
});
