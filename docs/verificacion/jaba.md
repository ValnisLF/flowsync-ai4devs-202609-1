# Verificación — «Lo que cada tarea muestra de su responsable»

Scenarios en el requisito: 3 · Cubiertos: 0

Matriz antes de escribir los tests nuevos

| Scenario | Test que lo cubre | Veredicto | Qué falta |
|---|---|---|---|
| Responsable identificable: el `assignee` de una tarea trae `fullName` e `initials` | *(ninguno)* | No cubierto | — |
| La tarea no filtra datos de cuenta: el `assignee` no incluye `email` ni otro dato de acceso | *(ninguno)* | No cubierto | — |
| Responsable sin nombre: `fullName` llega `null` pero `initials` sigue llegando | *(ninguno)* | No cubierto | — |

Justificación: `backend/tests/` solo contenía `tests/functional/auth/{initials,login,session,signup}.spec.ts` — ningún fichero bajo `tests/` referenciaba `/tasks` ni `assignee`. `tests/functional/auth/initials.spec.ts` hace login y comprueba `response.body().data.user.initials`, que cubre el requisito "Iniciales de la cuenta" de `openspec/specs/auth/spec.md`, no el de tareas: nunca crea ni consulta una tarea, nunca lee `task.assignee`, y no comprueba la ausencia de `email` en ese objeto. El código que implementaría la regla sí existe (`app/transformers/task_assignee_transformer.ts` usa `pick(['id', 'fullName', 'initials'])`), pero su existencia no demuestra cobertura.

## Parte B

1. Antes de mirar creía que había 2 scenarios cubiertos; encontré 0.
2. En «La tarea no filtra datos de cuenta» dudé si faltaba un test que prohibiera `id` o una regla más explícita en la spec sobre si ese identificador puede mostrarse: el requisito dice «ningún otro dato», pero el transformer lo incluye.
3. Para «Responsable identificable» decidí que las iniciales esperadas de «Ada Lovelace» serían `AL`; el scenario pide iniciales, pero no fija ese valor concreto.
