import vine from '@vinejs/vine'

export const createTaskDayValidator = vine.create(
  vine.object({
    taskId: vine.number().min(0),
  })
)
