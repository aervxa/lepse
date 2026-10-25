import type { AppSocket } from '@lepse/clotho/socket'
import { Socket } from '@rlanz/socket/client'
import { createSocketComposables } from '@rlanz/socket/client/vue'

export const socket = new Socket<AppSocket>({ url: 'http://localhost:3333' })
export const { provideSocket, useChannel, useChannelEvent, useSocketState } =
  createSocketComposables<AppSocket>()
