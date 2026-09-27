# El terreno que ya existe.

**Resumen de producto — FlowSync (estado actual)**

Lo único construido y funcional es el ciclo de autenticación: registro, login, perfil autenticado y logout, con tokens de acceso y persistencia de sesión en frontend y backend. El único concepto de dominio real en el modelo de datos es el **usuario** (con email, nombre y credenciales) más sus tokens de acceso asociados; no existe ninguna entidad relacionada con tareas, equipos o proyectos, pese a que "gestión de tareas en equipo" es la premisa del producto. Todo lo que rodea esa capa de auth —layout, componentes UI de shadcn, rutas protegidas/públicas, cliente API— es infraestructura de soporte ya usada, no scaffold suelto. En cambio, sí quedan como andamiaje sin uso real: los directorios de tests (unit/functional) declarados pero vacíos, y la página de perfil, que es más una pantalla de verificación de la sesión que una funcionalidad de producto. En síntesis, FlowSync hoy es una base de autenticación completa sobre la que todavía no se ha construido ninguna capacidad de gestión de tareas en sí.


# El interrogatorio de cinco preguntas.

## Las cinco preguntas clave
1. **Usuario y contexto de uso**: ¿quién es concretamente el usuario que abre esta herramienta y cuándo la mira — un IC actualizando su estado, un manager haciendo seguimiento, o ambos por igual? ¿En equipos de cuántas personas y con qué distribución horaria (misma zona horaria o async real entre husos)?

2. **El dolor real detrás de la reunión de sync**: cuando dices que quieren evitar reuniones de sincronización, ¿el problema hoy es que no saben qué está haciendo cada uno, que lo saben tarde, que la información se pierde entre herramientas, o que la reunión en sí se siente como una pérdida de tiempo aunque la información ya esté disponible en otro sitio?

3. **Qué significa "tiempo real" en la práctica**: ¿el valor está en ver cambios de estado al instante mientras ocurren, o basta con que el estado esté siempre fresco y accesible sin esperar a la reunión (aunque se actualice con cierto lag)? ¿Qué frecuencia de actualización haría que alguien deje de convocar el sync?

4. **Definición de "menos rollo que Jira"**: ¿qué parte concreta de Jira (u otra herramienta similar) es la que quieren evitar — el número de campos/pasos para crear o mover una tarea, el proceso de triage/planificación, o algo del propio flujo de trabajo tipo tableros y sprints? ¿Hay una herramienta o hábito actual (Slack, hoja compartida, standup async) que ya intenta cubrir esto y que servirá de punto de comparación?

5. **Criterio de éxito del MVP**: si dentro de unas semanas un equipo deja de hacer su reunión de sync gracias a esto, ¿qué tuvo que poder hacer cada persona del equipo, como mínimo, para que ese reemplazo se sintiera seguro (no solo "ver tareas", sino qué acción o vista concreta te convencería de que el problema está resuelto)?

## Resumen de las respuestas a las cinco preguntas
**1. Usuario y contexto de uso**
El usuario es el par, no el manager: no hay reporte hacia arriba y a un lead le da igual este dato. Equipos remotos pequeños (3–10 personas), roles planos, todos ven y editan lo mismo. El caso de estudio es un equipo de 6 personas de producto SaaS en 3 husos horarios — es un arquetipo para diseñar, no un cliente validado. **Supuesto**: al ser async entre husos, el diseño no puede depender de que haya horas de solape; tiene que servir aunque nadie coincida en pantalla al mismo tiempo.

**2. El dolor real detrás del sync**
No es falta de reunión, es la ronda de "¿en qué estás?" que se come media daily, más las interrupciones puntuales por Slack para preguntar lo mismo entre reuniones. El coste es concreto y ya ocurrió: dos devs tocaron el mismo módulo la misma semana por no saberlo a tiempo, dos días perdidos. La daily no desaparece entera — sigue existiendo para hablar de bloqueos — solo desaparece la parte de "quién está en qué".

**3. Qué significa "tiempo real"**
Es frescura del dato, no presencia de la persona: ver el estado de la tarea actualizado al mirarlo, sin refrescar ni preguntar, no quién está conectado. Nada de chat, videollamada o edición simultánea, y nada de notificaciones push — es un resumen que se consulta (al llegar por la mañana, al volver de una reunión), no un aviso que interrumpe. La decisión que esto habilita es muy concreta: no empezar algo que otro ya está tocando, y elegir la siguiente tarea sabiendo qué está libre. **Supuesto**: como los bloqueos no se resuelven en este MVP, el vocabulario de estado de una tarea puede quedarse en algo simple tipo pendiente/en curso/hecha, sin necesidad de un estado explícito de "bloqueada".

**4. Qué significa "menos rollo que Jira"**
Crear una tarea y cambiarle el estado en segundos, sin flujos de configuración ni campos obligatorios — dos clics sobre una lista ya abierta. El punto de comparación real del caso de estudio es un gestor de tareas pesado más la daily de 15 minutos por videollamada. FlowSync sustituye a ese gestor, no convive con él (evita la doble actualización), y renuncia explícitamente a sprints, estimaciones, épicas, backlog priorizado e informes: un equipo que necesite eso no es el usuario objetivo.

**5. Criterio de éxito del MVP**
Éxito de producto = el equipo deja de hacer la ronda de "¿en qué estás?" en la daily porque el estado se ve de un vistazo, filtrando por estado para centrarse en lo pendiente. El criterio duro a una semana de uso real: cancelan esa ronda y nadie pide que vuelva; si la siguen haciendo igual, no funcionó. El riesgo #1, asumido explícitamente, es que la información se quede vieja — la única mitigación es que actualizar cueste dos clics, no obligar a nadie a hacerlo.

**Alcance ya cerrado (para que quede explícito, no son supuestos míos sino decisiones dadas):** un espacio único compartido sin entidad "equipo"; tarea = título, responsable, estado, fecha de vencimiento; estado tecleado por la propia persona, sin derivarlo de Git/CI/calendario; fuera del MVP van notificaciones push, integración con Slack, roles/permisos avanzados, analítica/reporting y comentarios en tareas. Se prioriza una vertical fina de punta a punta sobre andamiaje amplio a medias.

# El alcance en cinco bloques.
## 1. Problema

Los pares de un equipo remoto pequeño no tienen forma de ver en qué está trabajando cada uno sin preguntar o interrumpir. Ese hueco se tapa hoy con una ronda de "¿en qué estás?" que se come media daily y aun así llega tarde: ya ha pasado que dos personas tocaron el mismo módulo la misma semana por no saberlo a tiempo, con dos días perdidos de coste real.

## 2. Usuarios

Miembros de equipos remotos pequeños (3–10 personas), roles planos, sin jerarquía de permisos ni reporte hacia un manager — el valor lo cobran ellos entre sí, no un lead. Arquetipo de referencia (caso de estudio, no cliente validado): equipo de producto SaaS de 6 personas repartidas en 3 husos horarios, hoy con un gestor de tareas pesado y una daily de 15 minutos por videollamada.

## 3. Propuesta de valor

Ver el estado de todo el equipo de un vistazo, siempre fresco, sin preguntar ni interrumpir a nadie — y sin esperar a la daily para enterarse. Se sostiene porque actualizar el propio estado cuesta dos clics sobre una lista que la propia persona ya usa como su cola de trabajo: quien lo escribe es el primer beneficiado, no está haciendo un favor a los demás.

## 4. Alcance

- Identificarse en el espacio de equipo (reutilizando la capa de login/perfil ya construida en el proyecto).
- Un espacio único compartido con la lista de tareas de todo el equipo, visible para todos por igual.
- Crear una tarea con título, responsable y fecha de vencimiento, en segundos y sin campos obligatorios adicionales.
- Cambiar el estado de una tarea propia en dos clics (pendiente / en curso / hecha).
- Ver la lista de tareas de todo el equipo con su estado actualizado, sin refrescar ni preguntar.
- Filtrar la lista por estado para centrarse en lo pendiente.
- Ver de un vistazo qué tareas han superado su fecha de vencimiento.

## 5. NO-alcance

- **Notificaciones push**: la hipótesis a validar es que un resumen que se consulta basta para sustituir la ronda de "¿en qué estás?", no que haga falta interrumpir a nadie; meter push probaría la hipótesis contraria, que rechazamos a propósito.
- **Integración con Slack**: no ayuda a validar si dos clics en una lista propia son fricción suficientemente baja; además reintroduce la doble actualización entre herramientas, que es justo el motivo por el que este tipo de producto suele morir.
- **Roles y permisos avanzados**: el dolor ocurre entre pares sin jerarquía; construir permisos validaría una hipótesis de gobernanza que este equipo no tiene.
- **Analítica / reporting**: aquí nadie reporta hacia arriba, así que no existe la hipótesis de "visibilidad para manager" que justificaría construirlo.
- **Comentarios en tareas**: la hipótesis es que el estado por sí solo basta para coordinarse; los comentarios reintroducen la conversación y el "rollo" tipo Jira que se quiere evitar.
- **Gestión de bloqueos/impedimentos**: la daily reducida sigue existiendo para hablar de bloqueos; este MVP ataca solo la ronda de "¿en qué estás?", no sustituye la daily entera.
- **Sprints, estimaciones, épicas, backlog priorizado**: la hipótesis a probar es que dos clics sin fricción bastan para mantener el estado fresco; añadir planificación reintroduce la fricción de Jira y apunta a un usuario que planifica en sprints, que no es el nuestro.
- **Múltiples equipos / pertenencia a varios equipos / entidad "equipo"**: el mecanismo central a validar es que un espacio único compartido resuelve la coordinación entre pares; la complejidad de pertenencia no aporta señal sobre esa hipótesis y queda como supuesto documentado, no como algo a construir.
- **Derivar el estado desde Git, PRs, CI o calendario**: la hipótesis a probar es si teclear el estado a mano, en segundos, se sostiene por interés propio; automatizarlo impediría probar precisamente eso, y es además otro producto, con integraciones y OAuth de terceros.
- **Indicadores de presencia ("quién está conectado ahora")**: el producto declara que el estado es de la tarea, no de la persona; la presencia sería vigilancia, hipótesis que se rechaza de forma deliberada, no que se aplaza.

---------------------

# Las tres respuestas de la Parte B.

1. La IA propuso 7 capacidades dentro del alcance; después de mi recorte quedaron 4.
2. Dejé fuera: según la hipótesis que estamos validando, estas capacidades no son necesarias para comprobar si el equipo deja de hacer la ronda de "¿en qué estás?" y evita trabajo duplicado.
   - Filtrar la lista por estado para centrarse en lo pendiente,  porque con un equipo de 3–10 personas la lista completa es pequeña y escaneable a simple vista; filtrar ayuda a que la vista sea más cómoda, pero no es lo que prueba que dejaron de preguntar o que evitaron un choque — se puede validar la hipótesis mirando la lista entera.
   - Ver de un vistazo qué tareas han superado su fecha de vencimiento, porque detectar retrasos es una hipótesis distinta (gestión de plazos), no la de "dejar de preguntar" ni la de "no duplicar trabajo". Si se cae esta capacidad, el campo de fecha de vencimiento del punto 1 tampoco tiene ya ningún consumidor en el MVP.
   - Identificarse en el espacio de equipo (reutilizando la capa de login/perfil ya construida en el proyecto), porque lo que exigen "dejar de preguntar" y "no duplicar trabajo" es solo saber quién es cada uno para atribuir la tarea y para que cada persona filtre "las mías" — no necesitas cuentas con contraseña, tokens de sesión ni el flujo de signup/login completo que ya está construido.

3. La exclusión de la que menos seguro estoy es el filtro por estado. Lo he dejado fuera porque no es imprescindible para comprobar inicialmente si compartir responsable y estado evita preguntas y trabajo duplicado. Lo incorporaría si, durante el uso real, la cantidad de tareas hiciera que el equipo no pudiera identificar rápidamente qué está pendiente o en curso, o si siguiera haciendo la ronda de “¿en qué estás?” porque la lista completa resultase demasiado ruidosa. La tensión está entre mantener una vertical mínima y asegurar que la información sea realmente visible de un vistazo.