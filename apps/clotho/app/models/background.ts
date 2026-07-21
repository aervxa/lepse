import { BackgroundSchema } from '#database/schema'

export default class Background extends BackgroundSchema {
  static async getRandomId() {
    const bgs = await this.query().select('id')
    const ids = bgs.map((bg) => bg.id)
    return ids[Math.floor(Math.random() * ids.length)]
  }
}
