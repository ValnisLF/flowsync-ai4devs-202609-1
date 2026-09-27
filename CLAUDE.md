# FlowSync — guía para el agente

Proyecto de práctica del curso AI4Devs (rama `s1/start`, ver [README.md](README.md)). Es un
scaffold: `backend/` (AdonisJS 7 + Lucid + VineJS + TypeScript) y `frontend/` (React 19 + Vite +
TypeScript), ahora mismo con lo mínimo (auth API en el backend, página de bienvenida sin tocar en
el frontend). Antes de "mejorar" algo que parece incompleto, comprueba si es scaffold sin usar
todavía o si de verdad hace falta.

## Convenciones

**Backend (`backend/`)**
- Nombres de archivo en `snake_case` (`user_transformer.ts`, `access_tokens_controller.ts`);
  clases en `PascalCase`.
- Controladores finos: la lógica de serialización va en `app/transformers/`, la validación de
  entrada en `app/validators/` (VineJS), no en el controlador.
- Rutas centralizadas en `start/routes.ts`, agrupadas bajo `/api/v1`.
- Importa con los alias de `imports` de `package.json` (`#controllers/*`, `#models/*`,
  `#validators/*`, etc.), no con rutas relativas que suban más de un nivel.
- Todo cambio de comportamiento en el backend necesita un test Japa en `tests/` (`node ace test`).
- Migraciones solo hacia adelante contra la base local (sqlite en `tmp/`); nunca reescribas una
  migración ya aplicada, añade una nueva.

**Frontend (`frontend/`)**
- Componentes funcionales con hooks, TypeScript estricto. Nada de componentes de clase.
- Estilo del código existente: comillas simples, sin punto y coma — es lo que aplican Prettier y
  el hook de formateo, no lo fuerces a mano.
- `oxlint` es el linter (`.oxlintrc.json`); respeta sus reglas de React (`rules-of-hooks`, etc.)
  en vez de añadir excepciones.

**General**
- Commits en formato conventional commits, en inglés.
- Variables de entorno solo en `.env` / `.env.local`, nunca committeadas; `.env.example` documenta
  qué hace falta.
- No añadas dependencias npm nuevas (backend o frontend) sin preguntar antes: el scaffold es
  deliberadamente mínimo para el ejercicio.
- No toques `frontend/` en una tarea que es solo de `backend/`, ni al revés, salvo que la tarea
  cruce ambos explícitamente.

## Prohibido

- Commitear `.env`, `.env.test` con secretos reales, o archivos de base de datos (`tmp/*.sqlite3`
  y similares).
- Operaciones destructivas de git (`push --force`, `reset --hard`, `rebase -i`, `checkout .`) sin
  confirmación explícita del usuario.
- Ejecutar migraciones o seeds contra una base de datos que no sea la local de desarrollo/test.
- Saltarte los hooks de este repo para que un cambio "pase": nada de `--no-verify`, ni editar
  `.claude/settings.json` para desactivar el hook de formateo/lint/tests porque un check falla.
  Si el hook bloquea, arregla lo que reporta.
- Reescribir la estructura de rutas o las convenciones de nombres ya existentes
  (`start/routes.ts`, `snake_case` en backend) sin una razón indicada en la tarea.

## Proceso

- Antes de dar un cambio por terminado, pide una revisión al subagente `adversarial-reviewer`
  (ver `.claude/agents/adversarial-reviewer.md`) sobre el diff que acabas de escribir.
- Este repo tiene hooks automáticos (`.claude/settings.json`): al editar un archivo se formatea y
  lintea solo; al terminar el turno, si tocaste `frontend/` o `backend/`, se corre lint (y tests
  en backend) y se bloquea el cierre si algo falla. Es información, no un obstáculo — corrige lo
  que señale en vez de rodearlo.
