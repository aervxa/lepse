import { JournalSchema } from '#database/schema'
import { compose } from '@adonisjs/core/helpers'
import { Day } from './mixins/day.ts'

export default class Journal extends compose(JournalSchema, Day) {}
