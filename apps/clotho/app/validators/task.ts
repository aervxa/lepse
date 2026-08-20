import vine from '@vinejs/vine'

export const createTaskValidator = vine.create(
  vine.object({
    name: vine.string().minLength(1).maxLength(255).trim(),
    description: vine.string().maxLength(2500).trim().nullable().optional(),
    priority: vine.enum(['none', 'low', 'medium', 'high', 'urgent']).optional(),
    status: vine.enum(['todo', 'in_progress', 'done', 'canceled']).optional(),
    pomoCount: vine.number().withoutDecimals().min(0).optional(),
    stopwatchMs: vine.number().withoutDecimals().min(0).optional(),
  })
)

export const updateTaskValidator = vine.create(createTaskValidator.schema.clone().partial())
