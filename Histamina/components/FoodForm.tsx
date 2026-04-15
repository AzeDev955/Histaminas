import React from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { getHistaminaConfig } from "../utils/helpers";

interface FoodFormProps {
  nombre: string;
  setNombre: (value: string) => void;
  categoriaSlug: string;
  setCategoriaSlug: (value: string) => void;
  clave: string;
  setClave?: (value: string) => void;
  histamina: number;
  setHistamina: (value: number) => void;
  categoriasDisponibles: string[];
  onSubmit: () => void;
  submitLabel: string;
  showClave?: boolean;
}

function prettyCategoryName(slug: string) {
  return slug.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
}

export default function FoodForm({
  nombre,
  setNombre,
  categoriaSlug,
  setCategoriaSlug,
  clave,
  setClave,
  histamina,
  setHistamina,
  categoriasDisponibles,
  onSubmit,
  submitLabel,
  showClave = false,
}: FoodFormProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Nombre</Text>
      <TextInput
        style={styles.input}
        value={nombre}
        onChangeText={setNombre}
        placeholder="Ej. Yogur natural"
        placeholderTextColor="#8E8E93"
      />

      {showClave && (
        <>
          <Text style={styles.label}>Clave</Text>
          <TextInput
            style={styles.input}
            value={clave}
            onChangeText={setClave}
            placeholder="Ej. yogur_natural"
            autoCapitalize="none"
            placeholderTextColor="#8E8E93"
          />
        </>
      )}

      <Text style={styles.label}>Categoría</Text>
      <View style={styles.categoryWrap}>
        {categoriasDisponibles.map((cat) => {
          const active = cat === categoriaSlug;
          return (
            <TouchableOpacity
              key={cat}
              style={[styles.categoryChip, active && styles.categoryChipActive]}
              onPress={() => setCategoriaSlug(cat)}
            >
              <Text
                style={[
                  styles.categoryChipText,
                  active && styles.categoryChipTextActive,
                ]}
              >
                {prettyCategoryName(cat)}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <Text style={styles.label}>Nivel de histamina</Text>
      <View style={styles.levelWrap}>
        {[0, 1, 2, 3].map((nivel) => {
          const config = getHistaminaConfig(nivel);
          const active = nivel === histamina;

          return (
            <TouchableOpacity
              key={nivel}
              style={[
                styles.levelButton,
                { borderColor: config.color },
                active && { backgroundColor: config.color },
              ]}
              onPress={() => setHistamina(nivel)}
            >
              <Text
                style={[
                  styles.levelButtonText,
                  { color: active ? "#FFF" : config.color },
                ]}
              >
                Nivel {nivel}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <TouchableOpacity style={styles.submitButton} onPress={onSubmit}>
        <Text style={styles.submitButtonText}>{submitLabel}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  label: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1C1C1E",
    marginBottom: 8,
    marginTop: 16,
  },
  input: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 14,
    fontSize: 16,
    color: "#1C1C1E",
    borderWidth: 1,
    borderColor: "#E5E5EA",
  },
  categoryWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  categoryChip: {
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderColor: "#D1D1D6",
    borderRadius: 999,
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  categoryChipActive: {
    backgroundColor: "#007AFF",
    borderColor: "#007AFF",
  },
  categoryChipText: {
    color: "#1C1C1E",
    fontWeight: "600",
  },
  categoryChipTextActive: {
    color: "#FFF",
  },
  levelWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  levelButton: {
    borderWidth: 1.5,
    borderRadius: 999,
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  levelButtonText: {
    fontWeight: "700",
  },
  submitButton: {
    marginTop: 28,
    backgroundColor: "#007AFF",
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: "center",
  },
  submitButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "800",
  },
});
