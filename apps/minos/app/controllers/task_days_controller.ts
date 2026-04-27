import Task from '#models/task'
import TaskDay from '#models/task_day'
import TaskDayPolicy from '#policies/task_day_policy'
import TaskDayTransformer from '#transformers/task_day_transformer'
import { createTaskDayValidator } from '#validators/task_day'
import type { HttpContext } from '@adonisjs/core/http'

export default class TaskDaysController {
  async index({ auth, params, serialize }: HttpContext) {
    const user = auth.getUserOrFail()
    const dayTasks = await TaskDay.query()
      .where('date', params.date)
      .whereHas('task', (q) => q.where('user_id', user.id))

    return serialize(TaskDayTransformer.transform(dayTasks))
  }

  async store({ params, request, bouncer, response, serialize }: HttpContext) {
    const payload = await request.validateUsing(createTaskDayValidator)
    const task = await Task.findOrFail(payload.taskId)
    await bouncer.with(TaskDayPolicy).authorize('store', task)

    const dayTask = await TaskDay.firstOrCreate({
      taskId: task.id,
      date: params.date,
      status: task.status,
    })
    await dayTask.refresh()

    return response.created(await serialize(TaskDayTransformer.transform(dayTask)))
  }

  async destroy({ params, bouncer, response }: HttpContext) {
    const dayTask = await TaskDay.findOrFail(params.id)
    await bouncer.with(TaskDayPolicy).authorize('delete', dayTask)

    await dayTask.delete()

    return response.noContent()
  }
}
