import { render, route } from 'rwsdk/router'
import { defineApp } from 'rwsdk/worker'

import { Document } from '@/app/document'
import { setCommonHeaders } from '@/app/headers'
import { Button } from '@/app/components/ui/button'

export interface AppContext {
  theme: 'dark' | 'light' | 'system'
}

export default defineApp([
  setCommonHeaders(),
  ({ ctx, request }) => {
    // Read theme from cookie
    const cookie = request.headers.get('Cookie')
    const match = cookie?.match(/theme=([^;]+)/)
    ctx.theme = (match?.[1] as 'dark' | 'light' | 'system') || 'system'
  },
  render(Document, [
    route('/', () => (
      <div className="m-0 flex h-dvh flex-col items-center justify-center">
        <h2 className="text-center">A work in progress, please go to</h2>
        <Button asChild variant="link">
          <a href="https://os.lepse.app" className="underline">
            os.lepse.app
          </a>
        </Button>
      </div>
    )),
  ]),
])
