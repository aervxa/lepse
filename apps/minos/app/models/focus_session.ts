import { FocusSessionSchema } from '#database/schema'
import { compose } from '@adonisjs/core/helpers'
import { Day } from './mixins/day.ts'

export default class FocusSession extends compose(FocusSessionSchema, Day) {}
