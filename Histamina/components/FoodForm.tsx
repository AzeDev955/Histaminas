import React from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { getHistaminaConfig } from "../utils/helpers";
import { ESTADOS_VALIDOS } from "../constants/estados";

interface FoodFormProps {
  nombre: string;
  setNombre: (value: string) => void;
  categoriaSlug: string;
  setCategoriaSlug: (value: string) => void;
  clave: string;
  setClave?: (value: string) => void;
  estado: string;
  setEstado: (value: string) => void;
  histamina: number;
  setHistamina: (value: number) => void;
  notas: string;
  setNotas: (value: string) => void;
  categoriasDisponibles: string[];
  onSubmit: () => void;
  submitLabel: string;
  showClave?: boolean;
}

function prettyLabel(texto: string) {
  return texto.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
}

export default function FoodForm({
  nombre,
  setNombre,
  categoriaSlug,
  setCategoriaSlug,
  clave,
  setClave,
  estado,
  setEstado,
  histamina,
  setHistamina,
  notas,
  setNotas,
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
        placeholder="Ej. Atún"
        placeholderTextColor="#8E8E93"
      />

      {showClave && (
        <>
          <Text style={styles.label}>Clave</Text>
          <TextInput
            style={styles.input}
            value={clave}
            onChangeText={setClave}
            placeholder="Ej. atun"
            autoCapitalize="none"
            placeholderTextColor="#8E8E93"
          />
        </>
      )}

      <Text style={styles.label}>Categoría</Text>
      <View style={styles.wrap}>
        {categoriasDisponibles.map((cat) => {
          const active = cat === categoriaSlug;

          return (
            <TouchableOpacity
              key={cat}
              style={[styles.chip, active && styles.chipActive]}
              onPress={() => setCategoriaSlug(cat)}
            >
              <Text style={[styles.chipText, active && styles.chipTextActive]}>
                {prettyLabel(cat)}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <Text style={styles.label}>Estado</Text>
      <View style={styles.wrap}>
        {ESTADOS_VALIDOS.map((itemEstado) => {
          const active = itemEstado === estado;

          return (
            <TouchableOpacity
              key={itemEstado}
              style={[styles.chip, active && styles.chipActive]}
              onPress={() => setEstado(itemEstado)}
            >
              <Text style={[styles.chipText, active && styles.chipTextActive]}>
                {prettyLabel(itemEstado)}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <Text style={styles.label}>Nivel</Text>
      <View style={styles.histaminaRow}>
        {[0, 1, 2, 3].map((nivel) => {
          const config = getHistaminaConfig(nivel);
          const active = histamina === nivel;

          return (
            <TouchableOpacity
              key={nivel}
              style={[
                styles.histaminaButton,
                { borderColor: config.color },
                active && { backgroundColor: config.color },
              ]}
              onPress={() => setHistamina(nivel)}
            >
              <Text
                style={[
                  styles.histaminaButtonText,
                  { color: active ? "#FFF" : config.color },
                ]}
              >
                {nivel}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <Text style={styles.label}>Notas</Text>
      <TextInput
        style={[styles.input, styles.textarea]}
        value={notas}
        onChangeText={setNotas}
        placeholder="Notas opcionales sobre tolerancia, preparación o contexto"
        placeholderTextColor="#8E8E93"
        multiline
        numberOfLines={4}
        textAlignVertical="top"
      />

      <TouchableOpacity style={styles.submitButton} onPress={onSubmit}>
        <Text style={styles.submitButtonText}>{submitLabel}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 18,
    marginHorizontal: 20,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },

  label: {
    fontSize: 14,
    fontWeight: "700",
    color: "#374151",
    marginBottom: 8,
    marginTop: 10,
  },

  input: {
    backgroundColor: "#F3F4F6",
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 14,
    fontSize: 15,
    color: "#111827",
  },

  textarea: {
    minHeight: 100,
  },

  wrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },

  chip: {
    backgroundColor: "#EEF2F7",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 999,
  },

  chipActive: {
    backgroundColor: "#007AFF",
  },

  chipText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
  },

  chipTextActive: {
    color: "#FFFFFF",
  },

  histaminaRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 2,
    marginBottom: 4,
  },

  histaminaButton: {
    flex: 1,
    borderWidth: 1.5,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
  },

  histaminaButtonText: {
    fontSize: 15,
    fontWeight: "800",
  },

  submitButton: {
    marginTop: 20,
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
