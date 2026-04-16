import React from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { ESTADOS_VALIDOS } from "@/constants/estados";

type Props = {
  nombre: string;
  setNombre: (value: string) => void;
  tipo: string;
  setTipo: (value: string) => void;
  estado: string;
  setEstado: (value: string) => void;
  histamina: number;
  setHistamina: (value: number) => void;
  notas: string;
  setNotas: (value: string) => void;
  tiposDisponibles: string[];
  onSubmit: () => void;
  submitLabel?: string;
};

export default function AdditiveForm({
  nombre,
  setNombre,
  tipo,
  setTipo,
  estado,
  setEstado,
  histamina,
  setHistamina,
  notas,
  setNotas,
  tiposDisponibles,
  onSubmit,
  submitLabel = "Guardar aditivo",
}: Props) {
  const tipos = tiposDisponibles.length
    ? tiposDisponibles
    : ["conservante", "antioxidante", "potenciador", "secuestrante"];

  return (
    <View style={styles.card}>
      <View style={styles.field}>
        <Text style={styles.label}>Nombre</Text>
        <TextInput
          value={nombre}
          onChangeText={setNombre}
          placeholder="Ej. Sulfito sódico"
          style={styles.input}
          placeholderTextColor="#9CA3AF"
        />
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Tipo</Text>
        <View style={styles.pickerWrapper}>
          <Picker selectedValue={tipo} onValueChange={setTipo}>
            {tipos.map((item) => (
              <Picker.Item
                key={item}
                label={item.replace(/_/g, " ")}
                value={item}
              />
            ))}
          </Picker>
        </View>
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Estado</Text>
        <View style={styles.pickerWrapper}>
          <Picker selectedValue={estado} onValueChange={setEstado}>
            {ESTADOS_VALIDOS.map((item) => (
              <Picker.Item
                key={item}
                label={item.replace(/_/g, " ")}
                value={item}
              />
            ))}
          </Picker>
        </View>
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Nivel</Text>
        <View style={styles.segmentRow}>
          {[0, 1, 2, 3].map((nivel) => {
            const isActive = histamina === nivel;

            return (
              <TouchableOpacity
                key={nivel}
                style={[
                  styles.segmentButton,
                  isActive && styles.segmentButtonActive,
                ]}
                onPress={() => setHistamina(nivel)}
              >
                <Text
                  style={[
                    styles.segmentButtonText,
                    isActive && styles.segmentButtonTextActive,
                  ]}
                >
                  {nivel}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Notas (opcional)</Text>
        <TextInput
          value={notas}
          onChangeText={setNotas}
          placeholder="Notas breves sobre tolerancia o contexto"
          style={[styles.input, styles.textarea]}
          placeholderTextColor="#9CA3AF"
          multiline
          numberOfLines={4}
          textAlignVertical="top"
        />
      </View>

      <TouchableOpacity style={styles.submitButton} onPress={onSubmit}>
        <Text style={styles.submitButtonText}>{submitLabel}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 20,
    marginTop: 8,
    borderRadius: 18,
    padding: 18,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },

  field: {
    marginBottom: 16,
  },

  label: {
    fontSize: 14,
    fontWeight: "700",
    color: "#374151",
    marginBottom: 8,
  },

  input: {
    backgroundColor: "#F3F4F6",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 14,
    fontSize: 15,
    color: "#111827",
  },

  textarea: {
    minHeight: 100,
  },

  pickerWrapper: {
    backgroundColor: "#F3F4F6",
    borderRadius: 12,
    overflow: "hidden",
  },

  segmentRow: {
    flexDirection: "row",
    gap: 8,
  },

  segmentButton: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 12,
    backgroundColor: "#EEF2F7",
    alignItems: "center",
  },

  segmentButtonActive: {
    backgroundColor: "#007AFF",
  },

  segmentButtonText: {
    fontSize: 15,
    fontWeight: "800",
    color: "#374151",
  },

  segmentButtonTextActive: {
    color: "#FFFFFF",
  },

  submitButton: {
    marginTop: 8,
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
