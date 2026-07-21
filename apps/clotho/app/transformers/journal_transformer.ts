import { BaseTransformer } from '@adonisjs/core/transformers'
import type Journal from '#models/journal'

export default class JournalTransformer extends BaseTransformer<Journal> {
  toObject() {
    return this.pick(this.resource, ['id', 'date', 'body', 'mood'])
  }
}
