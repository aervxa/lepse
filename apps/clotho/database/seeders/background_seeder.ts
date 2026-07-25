import Background from '#models/background'
import logger from '@adonisjs/core/services/logger'
import { DriveFile } from '@adonisjs/drive'
import drive from '@adonisjs/drive/services/main'
import { BaseSeeder } from '@adonisjs/lucid/seeders'
import { type ModelAttributes } from '@adonisjs/lucid/types/model'

export default class extends BaseSeeder {
  async run() {
    // Get list of all backgrounds from drive
    const backgrounds = await drive.use().listAll('backgrounds', { recursive: true })
    // Append each accordingly into rows
    const rows: Pick<ModelAttributes<Background>, 'key' | 'name' | 'style'>[] = []
    for (const background of backgrounds.objects) {
      // Only the background images (S3-like folders come as files too)
      if (background instanceof DriveFile && background.key.includes('.webp')) {
        const splits = background.key.split('/')
        if (splits.length < 2) break // ensure indexes -1 and -2 are valid
        rows.push({
          key: background.key,
          name: splits.at(-1)?.split('.')[0] as string, // Get the last split and remove file ext
          style: splits.at(-2) as string, // subfolder basically
        })
      }
    }

    if (rows.length === 0) logger.warn('No backgrounds were retrieved!')
    else logger.info(`Seeded ${rows.length} backgrounds...`)
    logger.debug({ backgrounds: rows }, 'Retrieved backgrounds:')

    // updateOrCreate rows for each background
    await Background.updateOrCreateMany('key', rows)
  }
}
