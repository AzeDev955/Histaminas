export const ESTADOS_VALIDOS = [
  "fresco",
  "congelado",
  "enlatado",
  "fermentado",
  "ahumado",
  "curado",
  "madurado",
  "seco",
  "cocido",
  "procesado",
  "destilado",
  "infusion",
  "bebida",
  "crudo",
  "encurtido",
] as const;

export type EstadoValido = (typeof ESTADOS_VALIDOS)[number];
