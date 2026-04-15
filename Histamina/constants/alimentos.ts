export const MOCK_DATA = {
  alimentos: {
    verduras: {
      zanahoria: { nombre: "Zanahoria", histamina: 0 },
      pepino: { nombre: "Pepino", histamina: 0 },
      calabacin: { nombre: "Calabacín", histamina: 0 },
      calabaza: { nombre: "Calabaza", histamina: 0 },
      brocoli: { nombre: "Brócoli", histamina: 0 },
      esparragos: { nombre: "Espárragos", histamina: 0 },
      cebolla: { nombre: "Cebolla", histamina: 1 },
      ajo: { nombre: "Ajo", histamina: 1 },
      champiñones: { nombre: "Champiñones", histamina: 2 },
      tomate: { nombre: "Tomate", histamina: 3 },
      espinacas: { nombre: "Espinacas", histamina: 3 },
      berenjena: { nombre: "Berenjena", histamina: 3 },
      chucrut: { nombre: "Chucrut (Col fermentada)", histamina: 3 },
    },
    frutas: {
      manzana: { nombre: "Manzana", histamina: 0 },
      melocoton: { nombre: "Melocotón", histamina: 0 },
      arandanos: { nombre: "Arándanos", histamina: 0 },
      melon: { nombre: "Melón", histamina: 0 },
      mango: { nombre: "Mango", histamina: 1 },
      pera: { nombre: "Pera", histamina: 1 },
      frambuesa: { nombre: "Frambuesa", histamina: 1 },
      platano: { nombre: "Plátano", histamina: 2 },
      kiwi: { nombre: "Kiwi", histamina: 2 },
      fresa: { nombre: "Fresa", histamina: 3 },
      limon: { nombre: "Limón / Cítricos", histamina: 3 },
      pina: { nombre: "Piña", histamina: 3 },
      papaya: { nombre: "Papaya", histamina: 3 },
      aguacate: { nombre: "Aguacate", histamina: 3 },
    },
    "cereales y tuberculos": {
      arroz: { nombre: "Arroz", histamina: 0 },
      patata: { nombre: "Patata", histamina: 0 },
      maiz: { nombre: "Maíz", histamina: 0 },
      avena: { nombre: "Avena", histamina: 0 },
      quinoa: { nombre: "Quinoa", histamina: 0 },
      trigo: { nombre: "Trigo (harina blanca)", histamina: 1 },
      trigo_sarraceno: { nombre: "Trigo sarraceno", histamina: 2 },
      germen_trigo: { nombre: "Germen de trigo", histamina: 3 },
    },
    legumbres: {
      lentejas: { nombre: "Lentejas", histamina: 2 },
      garbanzos: { nombre: "Garbanzos", histamina: 2 },
      cacahuetes: { nombre: "Cacahuetes", histamina: 3 },
      soja: { nombre: "Soja", histamina: 3 },
      tofu: { nombre: "Tofu", histamina: 3 },
    },
    "frutos secos y semillas": {
      macadamia: { nombre: "Nueces de Macadamia", histamina: 0 },
      pistachos: { nombre: "Pistachos", histamina: 0 },
      chufa: { nombre: "Chufa", histamina: 0 },
      almendras: { nombre: "Almendras", histamina: 1 },
      avellanas: { nombre: "Avellanas", histamina: 2 },
      nueces: { nombre: "Nueces", histamina: 3 },
      anacardos: { nombre: "Anacardos", histamina: 3 },
    },
    carnes: {
      carne_conservada: {
        nombre:
          "Carne en conserva, curada, marinada o ahumada (ej. jamón, bacon)",
        histamina: 3,
      },
      carne_madurada: {
        nombre: "Carne madurada o envejecida en seco",
        histamina: 3,
      },
      carne_picada_fina: {
        nombre: "Carne finamente picada o fiambres (pasteles de carne)",
        histamina: 3,
      },
      salchichas_embutidos: {
        nombre: "Salchichas y embutidos (ej. salami, paté de hígado)",
        histamina: 3,
      },
      visceras: {
        nombre: "Vísceras y entresijos (especialmente hígado)",
        histamina: 3,
      },
      carne_mostrador: {
        nombre: "Carne fresca de mostrador (sin envasar)",
        histamina: 1,
      },
      carne_picada_envasada: { nombre: "Carne picada envasada", histamina: 2 },
      salchichas_precocinadas: {
        nombre: "Salchichas precocinadas",
        histamina: 2,
      },
      carne_caza: { nombre: "Carne de caza / Venado (madurada)", histamina: 2 },
      carne_fresca_natural: {
        nombre:
          "Carne fresca natural (pollo, ternera, cerdo... envasada con fecha)",
        histamina: 0,
      },
      carne_congelada: {
        nombre: "Carne congelada (descongelada rápidamente)",
        histamina: 0,
      },
      jamon_cocido: {
        nombre: "Jamón cocido puro (sin extracto de levadura ni glutamato)",
        histamina: 0,
      },
    },

    "pescados y mariscos": {
      pescado_conserva_ahumado: {
        nombre: "Pescado en conserva, ahumado, salado o marinado",
        histamina: 3,
      },
      pescados_scombridae: {
        nombre: "Atún, caballa, arenque, sardinas, anchoas, mahi mahi",
        histamina: 3,
      },
      salsas_pescado: { nombre: "Salsas de pescado", histamina: 3 },
      mariscos: {
        nombre:
          "Mariscos (mejillones, langosta, cangrejo, gambas, langostinos)",
        histamina: 3,
      },
      pescado_fresco_mostrador: {
        nombre: "Pescado 'fresco' (mostrador, mercado o restaurante)",
        histamina: 2,
      },
      marisco_fresco: {
        nombre: "Marisco fresco (mostrador o restaurante)",
        histamina: 2,
      },
      pescado_recien_pescado: {
        nombre: "Pescado absolutamente fresco (recién pescado)",
        histamina: 0,
      },
      pescado_congelado_rapido: {
        nombre: "Pescado congelado (descongelar rápido, no en nevera)",
        histamina: 0,
      },
      pescados_blancos_seguros: {
        nombre: "Bacalao, trucha, perca, abadejo, panga",
        histamina: 0,
      },
    },
    "lacteos y huevos": {
      huevos_frescos: {
        nombre: "Huevos frescos (gallina, codorniz, etc.)",
        histamina: 0,
      },
      queso_curado_duro: { nombre: "Queso curado y duro", histamina: 3 },
      queso_semicurado_blando: {
        nombre: "Queso semicurado y blando (madurado)",
        histamina: 3,
      },
      queso_procesado_fundir: {
        nombre: "Queso procesado (para fundir, en porciones)",
        histamina: 3,
      },
      queso_azul_moho: {
        nombre: "Queso azul y quesos con moho (Brie, Camembert)",
        histamina: 3,
      },
      fondue: { nombre: "Fondue", histamina: 3 },
      gouda_curado: { nombre: "Gouda curado / envejecido", histamina: 3 },
    },
    "especias y condimentos": {
      sal: { nombre: "Sal", histamina: 0 },
      hierbas_frescas: {
        nombre: "Hierbas frescas (Perejil, Albahaca)",
        histamina: 0,
      },
      vinagre_manzana: { nombre: "Vinagre de manzana", histamina: 1 },
      curry: { nombre: "Curry", histamina: 2 },
      mostaza: { nombre: "Mostaza", histamina: 2 },
      salsa_soja: { nombre: "Salsa de soja", histamina: 3 },
      vinagre_balsamico: { nombre: "Vinagre balsámico / Vino", histamina: 3 },
      chile: { nombre: "Chile / Especias picantes", histamina: 3 },
    },
    bebidas: {
      agua: { nombre: "Agua natural", histamina: 0 },
      infusion_hierbas: {
        nombre: "Infusiones (Menta, Manzanilla)",
        histamina: 0,
      },
      cafe: { nombre: "Café (consumo moderado)", histamina: 1 },
      te_negro: { nombre: "Té negro / Té verde", histamina: 2 },
      vino_tinto: { nombre: "Vino tinto", histamina: 3 },
      cerveza: { nombre: "Cerveza", histamina: 3 },
      kombucha: { nombre: "Kombucha / Bebidas fermentadas", histamina: 3 },
    },
  },
};
