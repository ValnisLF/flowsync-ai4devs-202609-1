## Purpose

Esta spec describe el comportamiento observable hoy en el vertical de cuentas y acceso de FlowSync: registro, inicio de sesión, gestión de la sesión y consulta del perfil propio. No describe cómo debería funcionar, solo lo que el sistema hace actualmente.

## Requirements

### Requirement: Registro de una cuenta nueva
El sistema SHALL permitir crear una cuenta nueva a partir de un email, una contraseña y su confirmación, devolviendo la cuenta creada junto con un token de acceso.

#### Scenario: Registro con datos válidos
- **WHEN** se envían un email no registrado previamente, una contraseña de entre 8 y 32 caracteres y una confirmación idéntica a la contraseña
- **THEN** la respuesta incluye los datos de la cuenta creada (identificador, nombre completo, email, iniciales y fechas de creación/actualización) y un token de acceso, sin incluir la contraseña

### Requirement: Unicidad del email en el registro
El sistema SHALL rechazar el registro de una cuenta con un email que ya está registrado.

#### Scenario: Registro con un email ya existente
- **WHEN** se intenta registrar una cuenta con un email que ya pertenece a otra cuenta
- **THEN** la petición se rechaza y no se crea ninguna cuenta nueva

### Requirement: Reglas de validación de los datos de registro
El sistema SHALL validar el formato del email, la longitud de la contraseña y la coincidencia entre la contraseña y su confirmación antes de crear la cuenta.

#### Scenario: Email con formato inválido
- **WHEN** se envía un valor que no tiene forma de email en el campo de email del registro
- **THEN** la petición se rechaza y no se crea ninguna cuenta

#### Scenario: Contraseña demasiado corta o demasiado larga
- **WHEN** se envía una contraseña de menos de 8 caracteres o de más de 32 caracteres
- **THEN** la petición se rechaza y no se crea ninguna cuenta

#### Scenario: Confirmación de contraseña distinta de la contraseña
- **WHEN** la confirmación de contraseña enviada al backend no coincide con la contraseña
- **THEN** la petición se rechaza y no se crea ninguna cuenta

#### Scenario: Confirmación de contraseña distinta en el formulario de registro
- **WHEN** en el formulario de registro la contraseña y su repetición no coinciden en el momento de enviar el formulario
- **THEN** la interfaz muestra un error bajo el campo de repetición de contraseña sin llegar a contactar con el backend

### Requirement: Nombre completo opcional en el registro
El sistema SHALL permitir registrar una cuenta sin indicar un nombre completo.

#### Scenario: Registro sin nombre completo
- **WHEN** se registra una cuenta dejando vacío el campo de nombre completo
- **THEN** la cuenta se crea con el nombre completo vacío y sus iniciales se calculan a partir del email

### Requirement: Inicio de sesión con email y contraseña
El sistema SHALL permitir iniciar sesión con un email y una contraseña que coincidan con los de una cuenta existente, devolviendo los datos de la cuenta y un nuevo token de acceso.

#### Scenario: Inicio de sesión con credenciales correctas
- **WHEN** se envían el email y la contraseña de una cuenta existente
- **THEN** la respuesta incluye los datos de esa cuenta y un token de acceso nuevo

### Requirement: Rechazo de credenciales inválidas en el inicio de sesión
El sistema SHALL rechazar el inicio de sesión cuando el email no corresponde a ninguna cuenta o la contraseña no coincide, sin indicar cuál de los dos datos es incorrecto.

#### Scenario: Email o contraseña incorrectos
- **WHEN** se envían un email que no existe, o un email existente con una contraseña que no coincide
- **THEN** la petición se rechaza con un único mensaje genérico que no distingue si el problema es el email o la contraseña

#### Scenario: Mensaje mostrado en el formulario de inicio de sesión
- **WHEN** el backend rechaza el intento de inicio de sesión por credenciales incorrectas
- **THEN** la interfaz muestra el aviso "El email o la contraseña no son correctos" sin asociarlo a ningún campo concreto

### Requirement: Protección de los recursos de cuenta mediante token
El sistema SHALL exigir un token de acceso válido para consultar el perfil propio o cerrar sesión, y SHALL rechazar la petición cuando el token falta o no es válido.

#### Scenario: Acceso sin token o con un token no reconocido
- **WHEN** se solicita el perfil propio o el cierre de sesión sin incluir un token de acceso, o incluyendo uno que el backend no reconoce
- **THEN** la petición se rechaza y no se devuelven datos de la cuenta

#### Scenario: Acceso con un token válido
- **WHEN** se solicita el perfil propio o el cierre de sesión incluyendo el token de acceso de una sesión vigente
- **THEN** la petición se atiende con normalidad

### Requirement: Cierre de sesión revoca el token
El sistema SHALL invalidar el token de acceso usado al cerrar sesión, de forma que ese mismo token deja de servir para acceder a los recursos protegidos.

#### Scenario: Reutilización del token tras cerrar sesión
- **WHEN** se cierra sesión con un token de acceso y después se vuelve a usar ese mismo token para solicitar el perfil propio
- **THEN** esa petición posterior se rechaza

### Requirement: Duración de la sesión del token
El sistema SHALL mantener un token de acceso válido indefinidamente, sin caducarlo automáticamente por el paso del tiempo, hasta que se cierre sesión explícitamente.

#### Scenario: Uso de un token tiempo después de haberlo obtenido
- **WHEN** se usa un token de acceso obtenido en un inicio de sesión o registro anterior, sin que se haya cerrado sesión con él
- **THEN** el token sigue siendo válido para acceder a los recursos protegidos

### Requirement: Consulta del perfil propio
El sistema SHALL permitir a una cuenta autenticada consultar únicamente sus propios datos de perfil.

#### Scenario: Consulta del propio perfil
- **WHEN** una cuenta autenticada solicita su perfil
- **THEN** la respuesta incluye su identificador, nombre completo, email, iniciales y fechas de creación/actualización

### Requirement: Los datos de la cuenta nunca incluyen la contraseña
El sistema SHALL excluir la contraseña de cualquier respuesta que describa una cuenta de usuario.

#### Scenario: Respuestas que describen una cuenta
- **WHEN** se completa un registro, un inicio de sesión o una consulta de perfil
- **THEN** los datos de la cuenta devueltos no incluyen la contraseña en ninguna forma

### Requirement: Restauración de la sesión al cargar la aplicación
El sistema SHALL restaurar automáticamente la sesión de una persona que ya tenía un token guardado, validándolo contra el backend antes de darla por iniciada.

#### Scenario: Recarga de la aplicación con un token todavía válido
- **WHEN** se carga la aplicación y hay un token guardado de una sesión anterior que el backend sigue reconociendo
- **THEN** la sesión se restaura automáticamente sin pasar por la pantalla de inicio de sesión

#### Scenario: Recarga de la aplicación con un token que el backend ya no reconoce
- **WHEN** se carga la aplicación y el backend rechaza el token guardado por no reconocerlo como válido
- **THEN** la sesión guardada se descarta y la persona es dirigida a la pantalla de inicio de sesión con un aviso explicando que su sesión caducó

#### Scenario: Recarga de la aplicación sin poder contactar con el backend
- **WHEN** se carga la aplicación con un token guardado y la validación contra el backend falla por un motivo distinto a que el token sea inválido (por ejemplo, el backend no responde)
- **THEN** la persona ve la aplicación como si no hubiera iniciado sesión y se muestra un aviso de que no se ha podido restaurar la sesión, pero el token guardado no se elimina

### Requirement: Protección de rutas según el estado de sesión en la interfaz
El sistema SHALL dirigir a cada persona a la pantalla adecuada según si tiene o no una sesión activa, impidiendo que las pantallas de acceso y las pantallas protegidas se muestren al estado de sesión contrario.

#### Scenario: Acceso a una pantalla protegida sin sesión activa
- **WHEN** se intenta visitar la pantalla de perfil sin tener una sesión activa
- **THEN** se redirige a la pantalla de inicio de sesión

#### Scenario: Acceso a las pantallas de inicio de sesión o registro con sesión activa
- **WHEN** se intenta visitar la pantalla de inicio de sesión o la de registro teniendo ya una sesión activa
- **THEN** se redirige a la pantalla de perfil

#### Scenario: Visita a una dirección no reconocida por la aplicación
- **WHEN** se visita una dirección dentro de la aplicación que no corresponde a ninguna pantalla definida
- **THEN** se redirige hacia la pantalla de perfil, lo que a su vez envía a la pantalla de inicio de sesión si no hay sesión activa

### Requirement: Mensajes de error en los formularios de acceso
El sistema SHALL mostrar en los formularios de registro e inicio de sesión un mensaje en castellano para cada error devuelto por el backend, asociado al campo correspondiente cuando el error identifica uno.

#### Scenario: Error de validación asociado a un campo visible en el formulario
- **WHEN** el backend devuelve un error de validación sobre un campo que el formulario muestra en pantalla
- **THEN** el mensaje traducido aparece junto a ese campo

#### Scenario: Error que no corresponde a ningún campo visible en el formulario
- **WHEN** el backend devuelve un error de validación sobre un campo que el formulario no muestra en pantalla, o un error que no identifica ningún campo
- **THEN** el mensaje se muestra como aviso general en la parte superior del formulario

#### Scenario: Fallo de conexión con el backend
- **WHEN** el formulario de registro o de inicio de sesión no puede contactar con el backend
- **THEN** se muestra un aviso general indicando que no se ha podido conectar con el servidor

--------

## Parte B · Contraste de la spec con el código

### 1. Requisitos escritos y comprobados

- Requisitos escritos por el agente: 14.
- Requisitos comprobados por mí abriendo el código: 7.

### 2. Incoherencias encontradas

- La spec afirma que cerrar sesión revoca el token. Sin embargo, la interfaz elimina primero la sesión local y descarta cualquier error de la petición al servidor. Si la petición no llega, la interfaz muestra la sesión como cerrada aunque el token podría seguir siendo válido (`frontend/src/auth/auth-provider.tsx`, función `logout`).
- El requisito de protección de rutas omite el estado de carga: mientras se valida un token guardado, ambas protecciones muestran una pantalla de espera antes de decidir si redirigen o muestran la página (`frontend/src/routes/protected-route.tsx` y `frontend/src/routes/public-only-route.tsx`).
- El requisito de duración afirma que el token sigue válido «indefinidamente» y «hasta que se cierre sesión explícitamente». El modelo no configura caducidad automática, pero eso no demuestra que el cierre de sesión sea la única forma de invalidarlo (`backend/app/models/user.ts`).

### 3. Comportamientos que no supe decidir si eran un bug o el contrato

- No supe decidir si «cerrar sesión» significa salir de este navegador aunque falle la red, o garantizar que el token ya no pueda reutilizarse en el servidor. El código permite que ambos resultados difieran.
- No supe decidir si la ausencia de caducidad automática de los tokens es una decisión de producto o el efecto de dejar la configuración predeterminada del proveedor.


