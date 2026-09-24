'use server'

import { requestInfo } from 'rwsdk/worker'

export async function setTheme(theme: 'dark' | 'light' | 'system') {
  // TODO: Do this on the client that calls setTheme
  // document.documentElement.setAttribute('data-theme', theme)

  requestInfo.response.headers.set(
    'Set-Cookie',
    `theme=${theme}; Path=/; Max-Age=31536000; SameSite=Lax`
  )
}
