import { BaseTransformer } from '@adonisjs/core/transformers'
import Lounge from '#models/lounge'

export default class LoungeTransformer extends BaseTransformer<Lounge> {
  toObject() {
    return this.pick(this.resource, ['id'])
  }
}