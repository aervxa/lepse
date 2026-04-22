import { BaseTransformer } from '@adonisjs/core/transformers'
import type Goal from '#models/goal'

export default class GoalTransformer extends BaseTransformer<Goal> {
  toObject() {
    return this.pick(this.resource, ['id', 'name', 'description', 'status', 'createdAt'])
  }
}
