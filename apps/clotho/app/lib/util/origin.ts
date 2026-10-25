import app from '@adonisjs/core/services/app'

export const allowedOrigins = app.inDev
  ? true
  : [
      'tauri://localhost', // tauri
      'http://tauri.localhost', // cuz windows and android can't do tauri:// ig
      'https://os.lepse.app', // for prod site
    ]
