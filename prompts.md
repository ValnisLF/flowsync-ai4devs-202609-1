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
Antes de definir el alcance del MVP, inspecciona el proyecto FlowSync y explícame:

1. Qué capacidades de producto ya están construidas.
2. Qué conceptos principales existen en el modelo de datos actual.
3. Qué partes parecen ser únicamente scaffold o código de partida todavía sin utilizar.

Devuélveme únicamente un resumen de producto de 3 a 5 líneas. No propongas todavía nuevas funcionalidades, no diseñes la solución y no incluyas endpoints, tablas ni detalles de arquitectura.
```

**Qué salió:** **Resumen de producto — FlowSync (estado actual)**

Lo único construido y funcional es el ciclo de autenticación: registro, login, perfil autenticado y logout, con tokens de acceso y persistencia de sesión en frontend y backend. El único concepto de dominio real en el modelo de datos es el **usuario** (con email, nombre y credenciales) más sus tokens de acceso asociados; no existe ninguna entidad relacionada con tareas, equipos o proyectos, pese a que "gestión de tareas en equipo" es la premisa del producto. Todo lo que rodea esa capa de auth —layout, componentes UI de shadcn, rutas protegidas/públicas, cliente API— es infraestructura de soporte ya usada, no scaffold suelto. En cambio, sí quedan como andamiaje sin uso real: los directorios de tests (unit/functional) declarados pero vacíos, y la página de perfil, que es más una pantalla de verificación de la sesión que una funcionalidad de producto. En síntesis, FlowSync hoy es una base de autenticación completa sobre la que todavía no se ha construido ninguna capacidad de gestión de tareas en sí.

## Prompt 2

**Modelo:** Sonnet 5 High
**Herramienta:** Claude Code

```
Partimos de esta petición:

«Quiero que FlowSync sea una herramienta para que los equipos remotos sepan en qué está trabajando cada uno sin tener que hacer reuniones de sincronización. Algo tipo tareas compartidas pero más en tiempo real y menos rollo que Jira.»

Antes de proponer ninguna solución, haz una única ronda con las cinco preguntas de producto que más reducirían la incertidumbre sobre el problema, los usuarios y el alcance del MVP.

Haz exactamente cinco preguntas. No hagas una segunda ronda, no propongas funcionalidades todavía y no preguntes por el modelo de datos, los endpoints ni la arquitectura.
```

**Qué salió:** 
1. **Usuario y contexto de uso**: ¿quién es concretamente el usuario que abre esta herramienta y cuándo la mira — un IC actualizando su estado, un manager haciendo seguimiento, o ambos por igual? ¿En equipos de cuántas personas y con qué distribución horaria (misma zona horaria o async real entre husos)?

2. **El dolor real detrás de la reunión de sync**: cuando dices que quieren evitar reuniones de sincronización, ¿el problema hoy es que no saben qué está haciendo cada uno, que lo saben tarde, que la información se pierde entre herramientas, o que la reunión en sí se siente como una pérdida de tiempo aunque la información ya esté disponible en otro sitio?

3. **Qué significa "tiempo real" en la práctica**: ¿el valor está en ver cambios de estado al instante mientras ocurren, o basta con que el estado esté siempre fresco y accesible sin esperar a la reunión (aunque se actualice con cierto lag)? ¿Qué frecuencia de actualización haría que alguien deje de convocar el sync?

4. **Definición de "menos rollo que Jira"**: ¿qué parte concreta de Jira (u otra herramienta similar) es la que quieren evitar — el número de campos/pasos para crear o mover una tarea, el proceso de triage/planificación, o algo del propio flujo de trabajo tipo tableros y sprints? ¿Hay una herramienta o hábito actual (Slack, hoja compartida, standup async) que ya intenta cubrir esto y que servirá de punto de comparación?

5. **Criterio de éxito del MVP**: si dentro de unas semanas un equipo deja de hacer su reunión de sync gracias a esto, ¿qué tuvo que poder hacer cada persona del equipo, como mínimo, para que ese reemplazo se sintiera seguro (no solo "ver tareas", sino qué acción o vista concreta te convencería de que el problema está resuelto)?

## Prompt 3

**Modelo:** Sonnet 5 High
**Herramienta:** Claude Code

```
Estas son las respuestas de producto ya decididas. Utilízalas para responder a tus cinco preguntas.

Si alguna pregunta no queda cubierta por esta información, toma una decisión razonable y declárala expresamente como supuesto. No hagas más preguntas.

- Qué duele hoy: la daily de sincronización y el "¿en qué estás?" constante por Slack/chat. Nadie ve el estado del equipo sin interrumpir a alguien.
- Quién cobra el valor: los pares, no un lead. No hay reporte hacia arriba y a un manager le daría igual. Duele a los dos devs que descubren tarde que iban a lo mismo, y al que interrumpe a otro para preguntar.
- Episodio concreto: dos personas del equipo tocaron el mismo módulo la misma semana porque una empezó sin que la otra lo supiera. Dos días perdidos.
- Qué reunión desaparece (respuesta honesta, no la vendas de más): la daily NO desaparece entera. Desaparece la ronda de "¿en qué estás?", que hoy se come la mitad de los 15 minutos. La parte de bloqueos sigue, y este MVP no la resuelve.
- Usuarios / equipo: equipos remotos pequeños, 3–10 personas. Roles planos: en el MVP todos ven y editan lo mismo, sin jerarquía de permisos.
- Primer usuario concreto: equipo de 6 personas de producto SaaS, en 3 husos horarios, que hoy usa un gestor de tareas pesado y una daily de 15 minutos por videollamada. Es un CASO DE ESTUDIO, no un cliente real.
- Fronteras: un espacio único compartido, sin entidad "equipo". Varios equipos separados, o gente en más de uno, queda FUERA del MVP: se anota como supuesto en el PRD, no se construye.
- "Tiempo real" = ver los cambios de estado de las tareas sin refrescar ni preguntar. NO es chat, NO es videollamada, NO es colaboración simultánea sobre el mismo documento.
- Es frescura, no presencia: el estado es de la TAREA, no de la persona. Nada de "quién está conectado ahora" ni indicadores de actividad; eso es vigilancia y lo rechazamos a propósito.
- Forma de la señal: resumen que espera, no aviso que interrumpe. El caso es "llego por la mañana o vuelvo de una reunión y veo qué se ha movido". Sin notificaciones push.
- Qué decisión cambia: no empezar algo que otra persona ya está tocando, y elegir lo siguiente sabiendo qué está libre. Si la única respuesta fuera "sentirse informado", el tiempo real no valdría lo que cuesta.
- De dónde sale el estado: lo teclea la persona que hace la tarea, en segundos. Derivarlo de señales externas (Git/PRs, CI, calendario) está FUERA del MVP: es otro producto, con integraciones y OAuth de terceros.
- Por qué se sostiene: no porque sea más agradable, sino porque son dos clics sobre una lista ya abierta, sin campos obligatorios, sin decidir sprint ni estimación. Y quien lo escribe cobra en el momento: esa misma lista es su cola de trabajo, la mira para decidir qué coge, y de paso deja de recibir interrupciones preguntándole cómo va. Si el beneficio fuera solo para los demás, no lo escribiría.
- Si la información se queda vieja: el producto pierde el sentido, y lo asumo. Es el riesgo #1 a validar, no un detalle. La mitigación es que actualizar cueste dos clics, no obligar a nadie.
- Es donde se hace el trabajo, no donde se cuenta: sustituye al gestor de tareas, no convive con él. FlowSync crea las tareas, no lee las de otro sitio. Convivir exigiría doble actualización, que es como muere esta categoría.
- Renuncia explícita a sprints, estimaciones, épicas, backlog priorizado e informes. Un equipo que necesite eso no es nuestro usuario.
- "Menos rollo que Jira" = crear una tarea y cambiarle el estado en segundos, sin flujos de configuración ni campos obligatorios. Lo mínimo para saber quién está en qué.
- Qué necesita una tarea en el MVP: título, responsable, estado y fecha de vencimiento. La fecha, para ver de un vistazo qué se ha pasado de plazo.
- Cómo se consume la lista: filtrando por estado, para centrarse en lo pendiente.
- Éxito para el usuario: dejar de hacer la ronda de "¿en qué estás?" de la daily porque el estado del equipo se ve de un vistazo.
- Criterio a una semana de uso real: que el equipo cancele esa ronda y nadie pida que vuelva. Si la siguen haciendo igual, no funcionó.
- Cuánto construir: una vertical fina y usable de punta a punta, no el andamiaje amplio de un producto. Prefiero una capability terminada a tres a medias.
- Fuera del MVP: notificaciones push, integración con Slack, roles/permisos avanzados, analítica/reporting, comentarios en tareas.

```

**Qué salió:** la respuesta a las cinco preguntas clave.

## Prompt 4

**Modelo:** Sonnet 5 High
**Herramienta:** Claude Code

```
A partir del proyecto existente, de las respuestas de producto y de los supuestos declarados, propón el alcance del MVP de FlowSync.

Organízalo únicamente en estos cinco bloques y en este orden:

1. Problema
2. Usuarios
3. Propuesta de valor
4. Alcance
5. NO-alcance

Sé agresivo recortando el MVP. Buscamos una única vertical pequeña pero usable de punta a punta, no el andamiaje de un producto completo.

En el alcance, enumera claramente cada capacidad incluida. En el NO-alcance, justifica cada exclusión explicando qué hipótesis principal del producto no ayuda a validar.

No incluyas tablas, modelo de datos, endpoints, arquitectura, diagramas, casos de uso detallados ni requisitos técnicos.
```

**Qué salió:** El alcance del MVP de FlowSync organizado en los cinco bloques solicitados.



## Prompt 5

**Modelo:** Sonnet 5 High
**Herramienta:** Claude Code

```

```

**Qué salió:** Que no la necesitamos para esa hipótesis.

## Prompt 6

**Modelo:** Sonnet 5 High
**Herramienta:** Claude Code

```

```

**Qué salió:** Que no la necesitamos para esa hipótesis.