import type { HttpContext } from '@adonisjs/core/http'
import Task from '#models/task'
import TaskPolicy from '#policies/task_policy'
import TaskTransformer from '#transformers/task_transformer'
import { createTaskValidator, updateTaskValidator } from '#validators/task'
import TaskDay from '#models/task_day'

export default class TasksController {
  /**
   * Display a list of resource
   */
  async index({ auth, serialize }: HttpContext) {
    const user = auth.getUserOrFail()
    const tasks = await Task.query()
      .where('user_id', user.id)
      .orderBy('priority', 'desc')
      .orderBy('created_at', 'asc')

    return serialize(TaskTransformer.transform(tasks))
  }

  /**
   * Display form to create a new record
   */
  async create({}: HttpContext) {}

  /**
   * Handle form submission for the create action
   */
  async store({ auth, request, response, serialize }: HttpContext) {
    const user = auth.getUserOrFail()
    const payload = await request.validateUsing(createTaskValidator)

    const task = await Task.create({
      userId: user.id,
      ...payload,
    })
    await task.refresh()

    return response.created(await serialize(TaskTransformer.transform(task)))
  }

  /**
   * Show individual record
   */
  async show({ params, bouncer, serialize }: HttpContext) {
    const task = await Task.findOrFail(params.id)
    await bouncer.with(TaskPolicy).authorize('show', task)

    return serialize(TaskTransformer.transform(task))
  }

  /**
   * Edit individual record
   */
  async edit({ params }: HttpContext) {}

  /**
   * Handle form submission for the edit action
   */
  async update({ params, request, bouncer, serialize }: HttpContext) {
    const task = await Task.findOrFail(params.id)
    await bouncer.with(TaskPolicy).authorize('update', task)

    const payload = await request.validateUsing(updateTaskValidator)
    task.merge(payload)
    await task.save()

    // Update the day task of the client's date if provided
    const clientDate = request.header('x-client-date')
    if (clientDate && task.$dirty.status) {
      await TaskDay.query()
        .where('taskId', task.id)
        .where('date', clientDate)
        .update({ status: task.status })
    }

    return serialize(TaskTransformer.transform(task))
  }

  /**
   * Delete record
   */
  async destroy({ params, bouncer, response }: HttpContext) {
    const task = await Task.findOrFail(params.id)
    await bouncer.with(TaskPolicy).authorize('destroy', task)

    await task.delete()

    return response.noContent()
  }
}
