import React, { useEffect, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";
import AdditiveForm from "../../components/AdditiveForm";
import {
  deleteAditivo,
  getAditivoById,
  getTiposAditivo,
  updateAditivo,
} from "../../database/aditivos";

export default function EditarAditivoScreen() {
  const params = useLocalSearchParams<{ id: string }>();

  const [aditivoId, setAditivoId] = useState<number | null>(null);
  const [nombre, setNombre] = useState("");
  const [tipo, setTipo] = useState("");
  const [estado, setEstado] = useState("procesado");
  const [histamina, setHistamina] = useState(0);
  const [notas, setNotas] = useState("");
  const [tipos, setTipos] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const id = Number(params.id);
      if (!id) return;

      const [aditivo, tiposRows] = await Promise.all([
        getAditivoById(id),
        getTiposAditivo(),
      ]);

      const tiposDisponibles = tiposRows.map((r) => r.tipo);
      setTipos(tiposDisponibles);

      if (aditivo) {
        setAditivoId(aditivo.id);
        setNombre(aditivo.nombre);
        setTipo(aditivo.tipo);
        setEstado(aditivo.estado);
        setHistamina(aditivo.histamina);
        setNotas(aditivo.notas ?? "");
      }

      setLoading(false);
    })();
  }, [params.id]);

  const guardar = async () => {
    if (!aditivoId) return;

    if (!nombre.trim()) {
      Alert.alert("Falta el nombre", "Escribe un nombre para el aditivo.");
      return;
    }

    try {
      await updateAditivo({
        id: aditivoId,
        nombre: nombre.trim(),
        tipo,
        estado,
        histamina,
        notas,
      });

      Alert.alert("Cambios guardados", "El aditivo se ha actualizado.", [
        {
          text: "OK",
          onPress: () => router.back(),
        },
      ]);
    } catch {
      Alert.alert("Error", "No se pudo actualizar el aditivo.");
    }
  };

  const eliminar = async () => {
    if (!aditivoId) return;

    Alert.alert(
      "Eliminar aditivo",
      `¿Seguro que quieres eliminar "${nombre}"?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            await deleteAditivo(aditivoId);
            router.back();
          },
        },
      ],
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.loading}>Cargando aditivo…</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>Editar aditivo</Text>
        <Text style={styles.subtitle}>
          Puedes cambiar nombre, tipo, estado, nivel y notas.
        </Text>

        <AdditiveForm
          nombre={nombre}
          setNombre={setNombre}
          tipo={tipo}
          setTipo={setTipo}
          estado={estado}
          setEstado={setEstado}
          histamina={histamina}
          setHistamina={setHistamina}
          notas={notas}
          setNotas={setNotas}
          tiposDisponibles={tipos}
          onSubmit={guardar}
          submitLabel="Guardar cambios"
        />

        <TouchableOpacity style={styles.deleteButton} onPress={eliminar}>
          <Text style={styles.deleteButtonText}>Eliminar aditivo</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F5F7" },

  scroll: {
    paddingTop: 10,
    paddingBottom: 40,
  },

  loading: {
    padding: 20,
    fontSize: 16,
    color: "#6B7280",
  },

  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#1C1C1E",
    paddingHorizontal: 20,
    marginBottom: 6,
  },

  subtitle: {
    fontSize: 15,
    color: "#6B7280",
    paddingHorizontal: 20,
    marginBottom: 8,
  },

  deleteButton: {
    marginHorizontal: 20,
    marginTop: 10,
    backgroundColor: "#FF3B30",
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: "center",
  },

  deleteButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "800",
  },
});
