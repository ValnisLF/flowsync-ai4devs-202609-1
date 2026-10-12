import User from '#models/user'
import { test } from '@japa/runner'
import testUtils from '@adonisjs/core/services/test_utils'

/**
 * Lo que cada tarea muestra de su responsable. Cubre los tres scenarios del
 * requisito «Lo que cada tarea muestra de su responsable» de
 * `openspec/specs/tasks/spec.md`: el nombre y las iniciales identifican al
 * responsable, ningún otro dato de esa cuenta viaja junto a la tarea, y un
 * responsable sin nombre sigue llegando con iniciales.
 */
test.group('Tasks | responsable', (group) => {
  group.each.setup(() => testUtils.db().withGlobalTransaction())

  async function sesion(client: any, fullName: string | null, email: string) {
    await User.create({ fullName, email, password: 'secreto123' })

    const login = await client
      .post('/api/v1/auth/login')
      .json({ email, password: 'secreto123' })

    return login.body().data.token as string
  }

  async function crearTarea(client: any, token: string, title = 'Escribir la primera prueba') {
    const creada = await client
      .post('/api/v1/tasks')
      .header('Authorization', `Bearer ${token}`)
      .json({ title })

    return creada.body().data.id as number
  }

  test('el assignee de la tarea trae el nombre y las iniciales del responsable', async ({
    client,
    assert,
  }) => {
    const token = await sesion(client, 'Ada Lovelace', 'ada@example.com')
    const taskId = await crearTarea(client, token)

    const response = await client
      .get(`/api/v1/tasks/${taskId}`)
      .header('Authorization', `Bearer ${token}`)
      .qs({ today: '2026-01-01' })

    response.assertStatus(200)
    const { assignee } = response.body().data
    assert.equal(assignee.fullName, 'Ada Lovelace')
    assert.equal(assignee.initials, 'AL')
  })

  /**
   * El requisito dice «el nombre y las iniciales ... y NO ningún otro dato de
   * esa cuenta, en particular su email» — la lista de lo permitido es
   * `fullName` e `initials`, nada más; el email es solo el ejemplo que da el
   * texto, no el único dato prohibido. Por eso se comparan las claves exactas
   * (no solo la ausencia de `email`): un `id` de cuenta cuela tan poco como
   * el email si se lee el requisito al pie de la letra, así que se trata
   * aquí como el mismo incumplimiento en vez de permitirlo en silencio.
   *
   * El scenario pide comprobarlo «suelta o dentro de la lista», así que se
   * hacen ambas peticiones antes de afirmar nada, y la comparación es una
   * sola aserción sobre las dos a la vez: si falla, el mensaje muestra las
   * claves reales de las dos rutas en lugar de solo la primera que falle.
   */
  test('el assignee no incluye el email ni ningún otro dato de la cuenta, suelta o en la lista', async ({
    client,
    assert,
  }) => {
    const token = await sesion(client, 'Ada Lovelace', 'ada@example.com')
    const taskId = await crearTarea(client, token)

    const suelta = await client
      .get(`/api/v1/tasks/${taskId}`)
      .header('Authorization', `Bearer ${token}`)
      .qs({ today: '2026-01-01' })

    const lista = await client.get('/api/v1/tasks').header('Authorization', `Bearer ${token}`)

    suelta.assertStatus(200)
    lista.assertStatus(200)

    const tarea = lista.body().data.find((t: { id: number }) => t.id === taskId)

    const claves = {
      suelta: Object.keys(suelta.body().data.assignee).sort(),
      lista: Object.keys(tarea.assignee).sort(),
    }
    const esperadas = {
      suelta: ['fullName', 'initials'].sort(),
      lista: ['fullName', 'initials'].sort(),
    }
    assert.deepEqual(claves, esperadas)
  })

  test('el responsable sin nombre llega con iniciales igualmente', async ({ client, assert }) => {
    const token = await sesion(client, null, 'sin-nombre@example.com')
    const taskId = await crearTarea(client, token)

    const response = await client
      .get(`/api/v1/tasks/${taskId}`)
      .header('Authorization', `Bearer ${token}`)
      .qs({ today: '2026-01-01' })

    response.assertStatus(200)
    const { assignee } = response.body().data
    assert.isNull(assignee.fullName)
    assert.isString(assignee.initials)
    assert.isNotEmpty(assignee.initials)
  })
})
