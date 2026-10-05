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
Quiero realizar un anlálisis sobre el comportamiento que FlowSync tiene hoy en cuentas y acceso.

Explora el código existente de ese vertical completo: registro, inicio de sesión, sesión y perfil. Revisa tanto el backend (rutas, controladores, modelo de usuario, validadores y middlewares) como el frontend (pantallas de acceso, estado de sesión y protección de rutas). Lee las instrucciones del repositorio que correspondan antes de trabajar.

Escribe una primera versión de la spec en `docs/spec-viva/jaba.md`. Limítate al comportamiento que puedas inferir del código actual. No propongas mejoras ni describas cómo debería funcionar. Si un comportamiento no queda claro, no lo conviertas en una regla inventada.

Formato obligatorio, en castellano:
- `## Purpose`: una o dos frases.
- `## Requirements`.
- Cada requisito: `### Requirement: ...` y una afirmación con `SHALL`.
- Bajo cada requisito, al menos un `#### Scenario: ...` con exactamente dos viñetas: `- **WHEN** ...` y `- **THEN** ...`. Incluye las precondiciones en `WHEN`; no uses `GIVEN`.

La spec debe describir solo comportamiento observable: peticiones y respuestas de la API, y lo que una persona ve o puede hacer en la interfaz. No incluyas nombres de clases, archivos ni rutas del código dentro de la spec. No incluyas secciones `ADDED`, `MODIFIED` o `REMOVED`.

No modifiques código, configuración ni otros archivos. No inicialices OpenSpec en este repositorio. Luego yo contaré los requisitos y comprobaré personalmente una parte de ellos contra el código.

Al terminar, dime brevemente qué requisitos escribiste y señala en tu respuesta —fuera del archivo de spec— los archivos y fragmentos de código que conviene que abra para comprobar cada uno.
```

**Qué salió:** 
He escrito la primera versión de la spec en [docs/spec-viva/jaba.md](docs/spec-viva/jaba.md), con 14 requisitos:

1. Registro de una cuenta nueva
2. Unicidad del email en el registro
3. Reglas de validación de los datos de registro
4. Nombre completo opcional en el registro
5. Inicio de sesión con email y contraseña
6. Rechazo de credenciales inválidas en el inicio de sesión
7. Protección de los recursos de cuenta mediante token
8. Cierre de sesión revoca el token
9. Duración de la sesión del token (no caduca automáticamente)
10. Consulta del perfil propio
11. Los datos de la cuenta nunca incluyen la contraseña
12. Restauración de la sesión al cargar la aplicación (incluye el caso de fallo de red, donde el token no se borra de `localStorage` pero sí se trata como anónimo)
13. Protección de rutas según el estado de sesión (login/registro vs. perfil, y la ruta catch-all)
14. Mensajes de error en los formularios de acceso

Dónde comprobar cada uno (fuera del archivo de spec):

- **1–4 (registro)**: [new_account_controller.ts](backend/app/controllers/new_account_controller.ts), [validators/user.ts](backend/app/validators/user.ts) (reglas `email()`, `password()`, `.unique()`, `.sameAs('password')`), [user.ts (modelo)](backend/app/models/user.ts) (getter `initials`), [user_transformer.ts](backend/app/transformers/user_transformer.ts), y en frontend [register-page.tsx](frontend/src/pages/register-page.tsx) (comprobación local de `password !== passwordConfirmation`).
- **5–6 (login)**: [access_tokens_controller.ts](backend/app/controllers/access_tokens_controller.ts) (`store`, usa `User.verifyCredentials`), y la traducción a `400` en [lib/api.ts](frontend/src/lib/api.ts) (`toApiError`, caso `status === 400`).
- **7 (token requerido)**: [auth_middleware.ts](backend/app/middleware/auth_middleware.ts), grupo `.use(middleware.auth())` en [routes.ts](backend/start/routes.ts), y el guard `api` en [config/auth.ts](backend/config/auth.ts).
- **8 (logout revoca token)**: `destroy()` en [access_tokens_controller.ts](backend/app/controllers/access_tokens_controller.ts) (`User.accessTokens.delete`).
- **9 (sin caducidad)**: `User.accessTokens.create(user)` sin `expiresIn` en ambos controladores, y la columna `expires_at` nullable en [create_access_tokens_table.ts](backend/database/migrations/1768620764696_create_access_tokens_table.ts).
- **10–11 (perfil, sin password)**: [profile_controller.ts](backend/app/controllers/profile_controller.ts) y [user_transformer.ts](backend/app/transformers/user_transformer.ts) (solo incluye `id, fullName, email, createdAt, updatedAt, initials`).
- **12 (restauración de sesión)**: [auth-provider.tsx](frontend/src/auth/auth-provider.tsx), especialmente el `useEffect` con `getProfile` y la rama `catch` que distingue `error.status === 401` de cualquier otro error (ahí es donde el token *no* se borra de `localStorage`).
- **13 (rutas)**: [app-routes.tsx](frontend/src/routes/app-routes.tsx), [protected-route.tsx](frontend/src/routes/protected-route.tsx), [public-only-route.tsx](frontend/src/routes/public-only-route.tsx).
- **14 (errores en formularios)**: [lib/api.ts](frontend/src/lib/api.ts) (función `translate` y `toApiError`), [use-auth-form.ts](frontend/src/auth/use-auth-form.ts) (reparto entre `fieldErrors` y `formError`).

No he modificado ningún archivo de código ni inicializado OpenSpec; solo se creó el nuevo fichero de spec.
