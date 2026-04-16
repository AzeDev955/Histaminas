# Contexto para IAs y agentes

Este repositorio contiene una app movil Expo/React Native llamada **Histamina**. El proyecto real esta dentro de `Histamina/`; la raiz solo contiene metadatos de git y un `package-lock.json` vacio.

## Regla de ramas

- Trabajar normalmente contra `dev`.
- Si la rama actual ya es `dev`, entonces apuntar contra `main`.
- Antes de cambiar de rama o fusionar, revisar `git status` y no pisar cambios locales ajenos.

## Stack

- Expo SDK 54.
- React 19 y React Native 0.81.
- TypeScript.
- `expo-router` para navegacion basada en archivos.
- `expo-sqlite` para persistencia local.
- ESLint via `expo lint`.

## Comandos utiles

Ejecutar desde `Histamina/`:

```bash
npm install
npm run start
npm run android
npm run ios
npm run web
npm run lint
```

Tambien se puede arrancar con:

```bash
npx expo start
```

## Estructura principal

- `Histamina/app/`: rutas y pantallas principales de Expo Router.
- `Histamina/app/(tabs)/index.tsx`: pantalla principal del catalogo, filtros, busqueda, cambio entre alimentos/aditivos y reseteo de base de datos.
- `Histamina/app/(tabs)/explore.tsx`: pantalla de ejemplo generada por Expo; no parece parte central del producto.
- `Histamina/app/nuevo-alimento.tsx` y `Histamina/app/editar-alimento/[id].tsx`: alta y edicion de alimentos.
- `Histamina/app/nuevo-aditivo.tsx` y `Histamina/app/editar-aditivo/[id].tsx`: alta y edicion de aditivos.
- `Histamina/components/`: componentes de UI reutilizables, incluidos formularios y tarjetas.
- `Histamina/constants/`: datos base y constantes de dominio.
- `Histamina/database/`: acceso SQLite, seed inicial y operaciones CRUD.
- `Histamina/hooks/`: hooks compartidos, especialmente carga de catalogo.
- `Histamina/utils/`: helpers de presentacion/logica pequena.

## Modelo de datos local

La base local se abre en `Histamina/database/db.ts` como `histamina.db`.

Tablas principales:

- `categorias`: slug y nombre de categoria.
- `alimentos`: categoria, clave, nombre, estado, nivel de histamina y notas.
- `aditivos`: categoria fija `aditivos`, clave, nombre, tipo, estado, nivel de histamina, confianza, notas y alias JSON.
- `app_meta`: marcas internas como version del seed.

El seed esta en `Histamina/database/seed.ts` y carga datos desde:

- `Histamina/constants/alimentos.ts`
- `Histamina/constants/aditivos.ts`

La marca actual del seed es `seed_v4_done`. Si se cambia el contenido inicial y se quiere forzar recarga en instalaciones existentes, revisar esa clave o la estrategia de migracion.

## Flujo de datos

- `initDb()` crea tablas si faltan.
- `seedDatabaseIfNeeded()` inserta datos base una sola vez.
- `useFoods()` consulta alimentos/aditivos y agrupa categorias para la pantalla principal.
- La pantalla principal llama a `refresh()` al recuperar foco.
- Las operaciones CRUD viven en `database/foods.ts` y `database/aditivos.ts`.

## UI y estilos

- La UI usa `StyleSheet` local en cada pantalla/componente.
- Hay tema base en `Histamina/constants/theme.ts`, pero varias pantallas usan colores hardcodeados.
- Los niveles de histamina se centralizan parcialmente en `Histamina/utils/helpers.ts`:
  - 0: verde, libre.
  - 1: amarillo, bajo.
  - 2: naranja, medio.
  - 3: rojo, alto.
- Mantener textos en espanol para pantallas de producto.

## Convenciones observadas

- Imports con alias `@/` y tambien rutas relativas; respetar el estilo cercano del archivo editado.
- Componentes funcionales con hooks.
- Tipos TypeScript definidos cerca del uso cuando son especificos.
- Consultas SQLite con `getAllAsync`, `getFirstAsync`, `runAsync` y `withTransactionAsync`.
- Evitar reescribir datos de usuario al resetear salvo que la accion sea explicita.

## Puntos de cuidado

- Hay un cambio local existente en `Histamina/app/editar-alimento/[id].tsx`; no revertirlo sin permiso.
- `node_modules/` esta presente localmente pero no debe editarse.
- `README.md` sigue siendo el README base de Expo, asi que no asumir que documenta reglas reales del producto.
- Algunos textos aparecen con problemas de codificacion en consola. Antes de tocar copy visible, verificar el archivo en el editor y conservar acentos correctamente si se modifica.
- No profundizar en datos medicos sin validar: los niveles de histamina parecen catalogo orientativo, no consejo medico.

## Checklist recomendado para agentes

1. Confirmar rama con `git status --short --branch`.
2. Entrar a `Histamina/` para instalar, ejecutar o lintar.
3. Leer solo los archivos cercanos al cambio antes de editar.
4. Usar `npm run lint` como verificacion basica cuando aplique.
5. No tocar `node_modules`, `.expo` ni cambios locales ajenos.
