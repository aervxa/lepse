import { BaseTransformer } from '@adonisjs/core/transformers'
import type FocusSession from '#models/focus_session'

export default class FocusSessionTransformer extends BaseTransformer<FocusSession> {
  toObject() {
    return this.pick(this.resource, ['date', 'pomoCount', 'stopwatchMs'])
  }
}
