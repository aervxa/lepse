import { render, route } from 'rwsdk/router'
import { defineApp } from 'rwsdk/worker'

import { Document } from '@/app/document'
import { setCommonHeaders } from '@/app/headers'

export type AppContext = {}

export default defineApp([
  setCommonHeaders(),
  ({ ctx }) => {
    // setup ctx here
    ctx
  },
  render(Document, [
    route('/', () => (
      <h2 style={{ textAlign: 'center' }}>
        A work in progress, please go to <a href="https://os.lepse.app">os.lepse.app</a>
      </h2>
    )),
  ]),
])
