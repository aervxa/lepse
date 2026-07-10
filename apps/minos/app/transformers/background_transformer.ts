import { BaseTransformer } from '@adonisjs/core/transformers'
import Background from '#models/background'
import drive from '@adonisjs/drive/services/main'

export default class BackgroundTransformer extends BaseTransformer<Background> {
  async toObject() {
    return {
      ...this.pick(this.resource, ['id', 'name', 'style']),
      url: await drive.use().getUrl(this.resource.key),
    }
  }
}
