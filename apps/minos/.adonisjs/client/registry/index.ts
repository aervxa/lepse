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
  'day.tasks.index': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/day/:date/tasks',
    tokens: [{"old":"/api/v1/day/:date/tasks","type":0,"val":"api","end":""},{"old":"/api/v1/day/:date/tasks","type":0,"val":"v1","end":""},{"old":"/api/v1/day/:date/tasks","type":0,"val":"day","end":""},{"old":"/api/v1/day/:date/tasks","type":1,"val":"date","end":""},{"old":"/api/v1/day/:date/tasks","type":0,"val":"tasks","end":""}],
    types: placeholder as Registry['day.tasks.index']['types'],
  },
  'day.tasks.store': {
    methods: ["POST"],
    pattern: '/api/v1/day/:date/tasks',
    tokens: [{"old":"/api/v1/day/:date/tasks","type":0,"val":"api","end":""},{"old":"/api/v1/day/:date/tasks","type":0,"val":"v1","end":""},{"old":"/api/v1/day/:date/tasks","type":0,"val":"day","end":""},{"old":"/api/v1/day/:date/tasks","type":1,"val":"date","end":""},{"old":"/api/v1/day/:date/tasks","type":0,"val":"tasks","end":""}],
    types: placeholder as Registry['day.tasks.store']['types'],
  },
  'day.tasks.destroy': {
    methods: ["DELETE"],
    pattern: '/api/v1/day/:date/tasks/:id',
    tokens: [{"old":"/api/v1/day/:date/tasks/:id","type":0,"val":"api","end":""},{"old":"/api/v1/day/:date/tasks/:id","type":0,"val":"v1","end":""},{"old":"/api/v1/day/:date/tasks/:id","type":0,"val":"day","end":""},{"old":"/api/v1/day/:date/tasks/:id","type":1,"val":"date","end":""},{"old":"/api/v1/day/:date/tasks/:id","type":0,"val":"tasks","end":""},{"old":"/api/v1/day/:date/tasks/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['day.tasks.destroy']['types'],
  },
  'day.session.show': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/day/:date/session',
    tokens: [{"old":"/api/v1/day/:date/session","type":0,"val":"api","end":""},{"old":"/api/v1/day/:date/session","type":0,"val":"v1","end":""},{"old":"/api/v1/day/:date/session","type":0,"val":"day","end":""},{"old":"/api/v1/day/:date/session","type":1,"val":"date","end":""},{"old":"/api/v1/day/:date/session","type":0,"val":"session","end":""}],
    types: placeholder as Registry['day.session.show']['types'],
  },
  'day.session.update': {
    methods: ["PATCH"],
    pattern: '/api/v1/day/:date/session',
    tokens: [{"old":"/api/v1/day/:date/session","type":0,"val":"api","end":""},{"old":"/api/v1/day/:date/session","type":0,"val":"v1","end":""},{"old":"/api/v1/day/:date/session","type":0,"val":"day","end":""},{"old":"/api/v1/day/:date/session","type":1,"val":"date","end":""},{"old":"/api/v1/day/:date/session","type":0,"val":"session","end":""}],
    types: placeholder as Registry['day.session.update']['types'],
  },
  'day.session.destroy': {
    methods: ["DELETE"],
    pattern: '/api/v1/day/:date/session',
    tokens: [{"old":"/api/v1/day/:date/session","type":0,"val":"api","end":""},{"old":"/api/v1/day/:date/session","type":0,"val":"v1","end":""},{"old":"/api/v1/day/:date/session","type":0,"val":"day","end":""},{"old":"/api/v1/day/:date/session","type":1,"val":"date","end":""},{"old":"/api/v1/day/:date/session","type":0,"val":"session","end":""}],
    types: placeholder as Registry['day.session.destroy']['types'],
  },
  'day.journal.show': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/day/:date/journal',
    tokens: [{"old":"/api/v1/day/:date/journal","type":0,"val":"api","end":""},{"old":"/api/v1/day/:date/journal","type":0,"val":"v1","end":""},{"old":"/api/v1/day/:date/journal","type":0,"val":"day","end":""},{"old":"/api/v1/day/:date/journal","type":1,"val":"date","end":""},{"old":"/api/v1/day/:date/journal","type":0,"val":"journal","end":""}],
    types: placeholder as Registry['day.journal.show']['types'],
  },
  'day.journal.update': {
    methods: ["PATCH"],
    pattern: '/api/v1/day/:date/journal',
    tokens: [{"old":"/api/v1/day/:date/journal","type":0,"val":"api","end":""},{"old":"/api/v1/day/:date/journal","type":0,"val":"v1","end":""},{"old":"/api/v1/day/:date/journal","type":0,"val":"day","end":""},{"old":"/api/v1/day/:date/journal","type":1,"val":"date","end":""},{"old":"/api/v1/day/:date/journal","type":0,"val":"journal","end":""}],
    types: placeholder as Registry['day.journal.update']['types'],
  },
  'tasks.index': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/tasks',
    tokens: [{"old":"/api/v1/tasks","type":0,"val":"api","end":""},{"old":"/api/v1/tasks","type":0,"val":"v1","end":""},{"old":"/api/v1/tasks","type":0,"val":"tasks","end":""}],
    types: placeholder as Registry['tasks.index']['types'],
  },
  'tasks.create': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/tasks/create',
    tokens: [{"old":"/api/v1/tasks/create","type":0,"val":"api","end":""},{"old":"/api/v1/tasks/create","type":0,"val":"v1","end":""},{"old":"/api/v1/tasks/create","type":0,"val":"tasks","end":""},{"old":"/api/v1/tasks/create","type":0,"val":"create","end":""}],
    types: placeholder as Registry['tasks.create']['types'],
  },
  'tasks.store': {
    methods: ["POST"],
    pattern: '/api/v1/tasks',
    tokens: [{"old":"/api/v1/tasks","type":0,"val":"api","end":""},{"old":"/api/v1/tasks","type":0,"val":"v1","end":""},{"old":"/api/v1/tasks","type":0,"val":"tasks","end":""}],
    types: placeholder as Registry['tasks.store']['types'],
  },
  'tasks.show': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/tasks/:id',
    tokens: [{"old":"/api/v1/tasks/:id","type":0,"val":"api","end":""},{"old":"/api/v1/tasks/:id","type":0,"val":"v1","end":""},{"old":"/api/v1/tasks/:id","type":0,"val":"tasks","end":""},{"old":"/api/v1/tasks/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['tasks.show']['types'],
  },
  'tasks.edit': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/tasks/:id/edit',
    tokens: [{"old":"/api/v1/tasks/:id/edit","type":0,"val":"api","end":""},{"old":"/api/v1/tasks/:id/edit","type":0,"val":"v1","end":""},{"old":"/api/v1/tasks/:id/edit","type":0,"val":"tasks","end":""},{"old":"/api/v1/tasks/:id/edit","type":1,"val":"id","end":""},{"old":"/api/v1/tasks/:id/edit","type":0,"val":"edit","end":""}],
    types: placeholder as Registry['tasks.edit']['types'],
  },
  'tasks.update': {
    methods: ["PUT","PATCH"],
    pattern: '/api/v1/tasks/:id',
    tokens: [{"old":"/api/v1/tasks/:id","type":0,"val":"api","end":""},{"old":"/api/v1/tasks/:id","type":0,"val":"v1","end":""},{"old":"/api/v1/tasks/:id","type":0,"val":"tasks","end":""},{"old":"/api/v1/tasks/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['tasks.update']['types'],
  },
  'tasks.destroy': {
    methods: ["DELETE"],
    pattern: '/api/v1/tasks/:id',
    tokens: [{"old":"/api/v1/tasks/:id","type":0,"val":"api","end":""},{"old":"/api/v1/tasks/:id","type":0,"val":"v1","end":""},{"old":"/api/v1/tasks/:id","type":0,"val":"tasks","end":""},{"old":"/api/v1/tasks/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['tasks.destroy']['types'],
  },
  'goals.index': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/goals',
    tokens: [{"old":"/api/v1/goals","type":0,"val":"api","end":""},{"old":"/api/v1/goals","type":0,"val":"v1","end":""},{"old":"/api/v1/goals","type":0,"val":"goals","end":""}],
    types: placeholder as Registry['goals.index']['types'],
  },
  'goals.create': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/goals/create',
    tokens: [{"old":"/api/v1/goals/create","type":0,"val":"api","end":""},{"old":"/api/v1/goals/create","type":0,"val":"v1","end":""},{"old":"/api/v1/goals/create","type":0,"val":"goals","end":""},{"old":"/api/v1/goals/create","type":0,"val":"create","end":""}],
    types: placeholder as Registry['goals.create']['types'],
  },
  'goals.store': {
    methods: ["POST"],
    pattern: '/api/v1/goals',
    tokens: [{"old":"/api/v1/goals","type":0,"val":"api","end":""},{"old":"/api/v1/goals","type":0,"val":"v1","end":""},{"old":"/api/v1/goals","type":0,"val":"goals","end":""}],
    types: placeholder as Registry['goals.store']['types'],
  },
  'goals.show': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/goals/:id',
    tokens: [{"old":"/api/v1/goals/:id","type":0,"val":"api","end":""},{"old":"/api/v1/goals/:id","type":0,"val":"v1","end":""},{"old":"/api/v1/goals/:id","type":0,"val":"goals","end":""},{"old":"/api/v1/goals/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['goals.show']['types'],
  },
  'goals.edit': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/goals/:id/edit',
    tokens: [{"old":"/api/v1/goals/:id/edit","type":0,"val":"api","end":""},{"old":"/api/v1/goals/:id/edit","type":0,"val":"v1","end":""},{"old":"/api/v1/goals/:id/edit","type":0,"val":"goals","end":""},{"old":"/api/v1/goals/:id/edit","type":1,"val":"id","end":""},{"old":"/api/v1/goals/:id/edit","type":0,"val":"edit","end":""}],
    types: placeholder as Registry['goals.edit']['types'],
  },
  'goals.update': {
    methods: ["PUT","PATCH"],
    pattern: '/api/v1/goals/:id',
    tokens: [{"old":"/api/v1/goals/:id","type":0,"val":"api","end":""},{"old":"/api/v1/goals/:id","type":0,"val":"v1","end":""},{"old":"/api/v1/goals/:id","type":0,"val":"goals","end":""},{"old":"/api/v1/goals/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['goals.update']['types'],
  },
  'goals.destroy': {
    methods: ["DELETE"],
    pattern: '/api/v1/goals/:id',
    tokens: [{"old":"/api/v1/goals/:id","type":0,"val":"api","end":""},{"old":"/api/v1/goals/:id","type":0,"val":"v1","end":""},{"old":"/api/v1/goals/:id","type":0,"val":"goals","end":""},{"old":"/api/v1/goals/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['goals.destroy']['types'],
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
