export const getHistaminaConfig = (nivel: number) => {
  switch (nivel) {
    case 0:
      return { color: "#34C759", texto: "Nivel 0 - Libre" };
    case 1:
      return { color: "#FFCC00", texto: "Nivel 1 - Bajo" };
    case 2:
      return { color: "#FF9500", texto: "Nivel 2 - Medio" };
    case 3:
      return { color: "#FF3B30", texto: "Nivel 3 - Alto" };
    default:
      return { color: "#8E8E93", texto: "Desconocido" };
  }
};
