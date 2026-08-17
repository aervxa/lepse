import vine from '@vinejs/vine'

export const createHabitValidator = vine.create(
  vine.object({
    name: vine.string().minLength(1).maxLength(255).trim(),
    description: vine.string().maxLength(2500).trim().optional(),
    frequency: vine.enum(['daily', 'weekly']).optional(),
    target: vine.number().withoutDecimals().min(1).optional(),
    reminders: vine
      .array(
        vine.object({
          day: vine.number().min(0).max(6).withoutDecimals().optional(),
          time: vine.string(),
        })
      )
      .optional(),
  })
)

export const updateHabitValidator = vine.create(createHabitValidator.schema.clone().partial())
