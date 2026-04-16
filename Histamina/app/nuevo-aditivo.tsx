import React, { useEffect, useState } from "react";
import { Alert, ScrollView, StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import AdditiveForm from "../components/AdditiveForm";
import { createAditivo, getTiposAditivo } from "../database/aditivos";

function slugify(texto: string) {
  return texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "_");
}

export default function NuevoAditivoScreen() {
  const [nombre, setNombre] = useState("");
  const [tipo, setTipo] = useState("");
  const [estado, setEstado] = useState("procesado");
  const [histamina, setHistamina] = useState(0);
  const [notas, setNotas] = useState("");
  const [tipos, setTipos] = useState<string[]>([]);

  useEffect(() => {
    (async () => {
      const rows = await getTiposAditivo();
      const valores = rows.map((r) => r.tipo);
      setTipos(valores);

      if (valores.length > 0) {
        setTipo(valores[0]);
      } else {
        setTipo("conservante");
      }
    })();
  }, []);

  const guardar = async () => {
    if (!nombre.trim()) {
      Alert.alert("Falta el nombre", "Escribe un nombre para el aditivo.");
      return;
    }

    if (!tipo.trim()) {
      Alert.alert("Falta el tipo", "Selecciona un tipo.");
      return;
    }

    const clave = slugify(nombre);

    try {
      await createAditivo({
        clave,
        nombre: nombre.trim(),
        tipo,
        estado,
        histamina,
        notas,
      });

      Alert.alert("Guardado", "El aditivo se ha añadido correctamente.", [
        {
          text: "OK",
          onPress: () => router.back(),
        },
      ]);
    } catch {
      Alert.alert(
        "No se pudo guardar",
        "Puede que ya exista un aditivo con esa clave o haya un dato inválido.",
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>Nuevo aditivo</Text>
        <Text style={styles.subtitle}>
          Añade un aditivo nuevo a tu base local.
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
          submitLabel="Guardar aditivo"
        />
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
});
