# Prompts

Aquí van **todos los prompts que lanzaste** para hacer el ejercicio, en el orden en que los
lanzaste, con el modelo y la herramienta de cada uno.

Esto no es papeleo. Lo que se revisa es **cómo pediste las cosas**, no solo lo que salió: un
resultado flojo con un prompt bueno y un resultado flojo con un prompt vago necesitan feedback
distinto, y sin este archivo no se distinguen.

## Cómo rellenarlo

- Un apartado `## Prompt N` por cada prompt.
- **Pega el prompt tal cual lo lanzaste**, dentro del bloque de código, aunque ocupe diez líneas
  y aunque tenga faltas. No lo reescribas para que quede bien: el que arreglaste mentalmente
  después no es el que lanzaste.
- Incluye también los que **no funcionaron**. Suelen ser los más útiles de leer.
- `Modelo` y `Herramienta` en todos. Si cambiaste de una a otra a mitad, se nota aquí.

Borra el ejemplo de abajo cuando escribas el primero.

---

## Prompt 1

**Modelo:** Sonnet 5 High
**Herramienta:** Claude Code

```
Trabaja exclusivamente sobre el requisito «Lo que cada tarea muestra de su responsable» de openspec/specs/tasks/spec.md, no sobre toda la capability.

Lee sus tres scenarios y los tests existentes que puedan cubrirlos. Abre cada test candidato y comprueba sus aserciones: el nombre del test o la existencia de código que implementa la regla no demuestran cobertura.

Devuélveme una matriz de exactamente tres filas y cuatro columnas: scenario resumido en una línea | nombre exacto del test que lo cubre (vacío si no puedes identificarlo) | Cubierto / No cubierto / No lo sé | qué falta para decidir, si marcaste «No lo sé». Indica la ruta y la aserción concreta que justifican cada «Cubierto». Encima escribe «Scenarios en el requisito: 3 · Cubiertos: [número confirmado]».

No modifiques archivos, no escribas tests y no arregles código todavía. Señala cualquier ambigüedad real entre lo que dice la spec y lo que tendría que afirmar un test.
```

**Qué salió:** funcionó, 0 cubiertos.


## Prompt 2

**Modelo:** Sonnet 5 High
**Herramienta:** Claude Code

```
Continúa solo con el requisito «Lo que cada tarea muestra de su responsable». La matriz confirmada tiene 3 scenarios y 0 cubiertos.

Crea docs/verificacion/jaba.md con la matriz de cuatro columnas y tres filas que acabas de justificar. Anota encima «Scenarios en el requisito: 3 · Cubiertos: 0». Escribe también debajo la primera línea de la parte B: antes de mirar estimé 2 cubiertos; al comprobarlo encontré 0. Deja las otras dos líneas para mi reflexión posterior.

Escribe exactamente un test funcional por cada uno de los tres scenarios en backend/tests/functional/tasks/, siguiendo los patrones reales de backend/tests/functional/auth/. Comprueba el JSON de tareas, no solo el perfil de usuario. Para el segundo scenario, lee literalmente el requisito completo: dice que se muestran nombre e iniciales y ningún otro dato de la cuenta. Examina si `id` en `assignee` entra en conflicto con esa regla; no lo des por permitido en silencio. Explica en tu informe qué aserción elegiste y por qué.

Ejecuta los tests nuevos y comunica el resultado de cada uno. No cambies código de producción, la spec ni tests para hacerlos pasar. Si un test falla, déjalo fallando. No edites nada fuera de docs/verificacion/jaba.md y backend/tests/functional/tasks/.
```

**Qué salió:** Creó tres tests: dos pasan y uno falla por una clave adicional en assignee.

## Prompt 3

**Modelo:** Sonnet 5 High
**Herramienta:** Claude Code

```
En backend/tests/functional/tasks/assignee.spec.ts, mejora solo el segundo test para que haga ambas peticiones (tarea suelta y lista) antes de afirmar el resultado. Compara en una única aserción las claves ordenadas de los dos objetos assignee con las claves esperadas ['fullName', 'initials'] para cada uno. Así, si falla, el resultado debe mostrar las claves reales de ambas rutas y un primer fallo no ocultará la segunda comprobación.

Mantén exactamente un test por scenario. No cambies las claves esperadas, no ajustes el test para que pase, no edites producción ni la spec. Ejecuta los tres tests y déjalos tal como resulten.
```

**Qué salió:** 2 pasan; el segundo falla y muestra las claves de ambas rutas.
