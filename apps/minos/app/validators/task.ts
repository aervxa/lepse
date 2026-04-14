import vine from '@vinejs/vine'

export const createTaskValidator = vine.create(
  vine.object({
    name: vine.string().minLength(1).maxLength(255).trim(),
    description: vine.string().maxLength(2500).trim().optional(),
    urgency: vine.enum(['none', 'low', 'medium', 'high']).optional(),
    status: vine.enum(['todo', 'in_progress', 'complete']).optional(),
    timeEstimateMin: vine.number().min(1).optional(),
    deadline: vine.date().optional(),
  })
)

export const updateTaskValidator = vine.create(createTaskValidator.schema.clone().partial())
