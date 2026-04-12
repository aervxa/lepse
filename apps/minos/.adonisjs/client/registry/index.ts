/* eslint-disable prettier/prettier */
import type { AdonisEndpoint } from '@tuyau/core/types'
import type { Registry } from './schema.d.ts'
import type { ApiDefinition } from './tree.d.ts'

const placeholder: any = {}

const routes = {
  'auth.new_account.store': {
    methods: ["POST"],
    pattern: '/api/v1/auth/signup',
    tokens: [{"old":"/api/v1/auth/signup","type":0,"val":"api","end":""},{"old":"/api/v1/auth/signup","type":0,"val":"v1","end":""},{"old":"/api/v1/auth/signup","type":0,"val":"auth","end":""},{"old":"/api/v1/auth/signup","type":0,"val":"signup","end":""}],
    types: placeholder as Registry['auth.new_account.store']['types'],
  },
  'auth.access_token.store': {
    methods: ["POST"],
    pattern: '/api/v1/auth/login',
    tokens: [{"old":"/api/v1/auth/login","type":0,"val":"api","end":""},{"old":"/api/v1/auth/login","type":0,"val":"v1","end":""},{"old":"/api/v1/auth/login","type":0,"val":"auth","end":""},{"old":"/api/v1/auth/login","type":0,"val":"login","end":""}],
    types: placeholder as Registry['auth.access_token.store']['types'],
  },
  'auth.access_token.destroy': {
    methods: ["POST"],
    pattern: '/api/v1/auth/logout',
    tokens: [{"old":"/api/v1/auth/logout","type":0,"val":"api","end":""},{"old":"/api/v1/auth/logout","type":0,"val":"v1","end":""},{"old":"/api/v1/auth/logout","type":0,"val":"auth","end":""},{"old":"/api/v1/auth/logout","type":0,"val":"logout","end":""}],
    types: placeholder as Registry['auth.access_token.destroy']['types'],
  },
  'account.profile.show': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/account/profile',
    tokens: [{"old":"/api/v1/account/profile","type":0,"val":"api","end":""},{"old":"/api/v1/account/profile","type":0,"val":"v1","end":""},{"old":"/api/v1/account/profile","type":0,"val":"account","end":""},{"old":"/api/v1/account/profile","type":0,"val":"profile","end":""}],
    types: placeholder as Registry['account.profile.show']['types'],
  },
  'focus_sessions.show': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/session/show',
    tokens: [{"old":"/api/v1/session/show","type":0,"val":"api","end":""},{"old":"/api/v1/session/show","type":0,"val":"v1","end":""},{"old":"/api/v1/session/show","type":0,"val":"session","end":""},{"old":"/api/v1/session/show","type":0,"val":"show","end":""}],
    types: placeholder as Registry['focus_sessions.show']['types'],
  },
  'focus_sessions.update': {
    methods: ["PATCH"],
    pattern: '/api/v1/session/update',
    tokens: [{"old":"/api/v1/session/update","type":0,"val":"api","end":""},{"old":"/api/v1/session/update","type":0,"val":"v1","end":""},{"old":"/api/v1/session/update","type":0,"val":"session","end":""},{"old":"/api/v1/session/update","type":0,"val":"update","end":""}],
    types: placeholder as Registry['focus_sessions.update']['types'],
  },
  'focus_sessions.destroy': {
    methods: ["DELETE"],
    pattern: '/api/v1/session/reset',
    tokens: [{"old":"/api/v1/session/reset","type":0,"val":"api","end":""},{"old":"/api/v1/session/reset","type":0,"val":"v1","end":""},{"old":"/api/v1/session/reset","type":0,"val":"session","end":""},{"old":"/api/v1/session/reset","type":0,"val":"reset","end":""}],
    types: placeholder as Registry['focus_sessions.destroy']['types'],
  },
} as const satisfies Record<string, AdonisEndpoint>

export { routes }

export const registry = {
  routes,
  $tree: {} as ApiDefinition,
}

declare module '@tuyau/core/types' {
  export interface UserRegistry {
    routes: typeof routes
    $tree: ApiDefinition
  }
}
