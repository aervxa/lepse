import vine from '@vinejs/vine'

export const createGoalValidator = vine.create(
  vine.object({
    name: vine.string().minLength(1).maxLength(255).trim(),
    description: vine.string().maxLength(2500).trim().optional(),
    status: vine.enum(['active', 'completed', 'abandoned']).optional(),
  })
)

export const updateGoalValidator = vine.create(createGoalValidator.schema.clone().partial())
