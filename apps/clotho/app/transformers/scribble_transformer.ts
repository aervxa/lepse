import { BaseTransformer } from '@adonisjs/core/transformers'
import type Scribble from '#models/scribble'

export default class ScribbleTransformer extends BaseTransformer<Scribble> {
  toObject() {
    return this.pick(this.resource, ['id', 'title', 'body', 'createdAt', 'updatedAt'])
  }
}
