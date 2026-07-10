/* eslint-disable prettier/prettier */
import type { AdonisEndpoint } from '@tuyau/core/types'
import type { Registry } from './schema.d.ts'
import type { ApiDefinition } from './tree.d.ts'

const placeholder: any = {}

const routes = {
  'drive.fs.serve': {
    methods: ["GET","HEAD"],
    pattern: '/uploads/*',
    tokens: [{"old":"/uploads/*","type":0,"val":"uploads","end":""},{"old":"/uploads/*","type":2,"val":"*","end":""}],
    types: placeholder as Registry['drive.fs.serve']['types'],
  },
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
  'account.profile.update': {
    methods: ["PATCH"],
    pattern: '/api/v1/account/profile',
    tokens: [{"old":"/api/v1/account/profile","type":0,"val":"api","end":""},{"old":"/api/v1/account/profile","type":0,"val":"v1","end":""},{"old":"/api/v1/account/profile","type":0,"val":"account","end":""},{"old":"/api/v1/account/profile","type":0,"val":"profile","end":""}],
    types: placeholder as Registry['account.profile.update']['types'],
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
  'journals.index': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/journals',
    tokens: [{"old":"/api/v1/journals","type":0,"val":"api","end":""},{"old":"/api/v1/journals","type":0,"val":"v1","end":""},{"old":"/api/v1/journals","type":0,"val":"journals","end":""}],
    types: placeholder as Registry['journals.index']['types'],
  },
  'focus_sessions.index': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/focus-sessions',
    tokens: [{"old":"/api/v1/focus-sessions","type":0,"val":"api","end":""},{"old":"/api/v1/focus-sessions","type":0,"val":"v1","end":""},{"old":"/api/v1/focus-sessions","type":0,"val":"focus-sessions","end":""}],
    types: placeholder as Registry['focus_sessions.index']['types'],
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
  'scribbles.index': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/scribbles',
    tokens: [{"old":"/api/v1/scribbles","type":0,"val":"api","end":""},{"old":"/api/v1/scribbles","type":0,"val":"v1","end":""},{"old":"/api/v1/scribbles","type":0,"val":"scribbles","end":""}],
    types: placeholder as Registry['scribbles.index']['types'],
  },
  'scribbles.create': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/scribbles/create',
    tokens: [{"old":"/api/v1/scribbles/create","type":0,"val":"api","end":""},{"old":"/api/v1/scribbles/create","type":0,"val":"v1","end":""},{"old":"/api/v1/scribbles/create","type":0,"val":"scribbles","end":""},{"old":"/api/v1/scribbles/create","type":0,"val":"create","end":""}],
    types: placeholder as Registry['scribbles.create']['types'],
  },
  'scribbles.store': {
    methods: ["POST"],
    pattern: '/api/v1/scribbles',
    tokens: [{"old":"/api/v1/scribbles","type":0,"val":"api","end":""},{"old":"/api/v1/scribbles","type":0,"val":"v1","end":""},{"old":"/api/v1/scribbles","type":0,"val":"scribbles","end":""}],
    types: placeholder as Registry['scribbles.store']['types'],
  },
  'scribbles.show': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/scribbles/:id',
    tokens: [{"old":"/api/v1/scribbles/:id","type":0,"val":"api","end":""},{"old":"/api/v1/scribbles/:id","type":0,"val":"v1","end":""},{"old":"/api/v1/scribbles/:id","type":0,"val":"scribbles","end":""},{"old":"/api/v1/scribbles/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['scribbles.show']['types'],
  },
  'scribbles.edit': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/scribbles/:id/edit',
    tokens: [{"old":"/api/v1/scribbles/:id/edit","type":0,"val":"api","end":""},{"old":"/api/v1/scribbles/:id/edit","type":0,"val":"v1","end":""},{"old":"/api/v1/scribbles/:id/edit","type":0,"val":"scribbles","end":""},{"old":"/api/v1/scribbles/:id/edit","type":1,"val":"id","end":""},{"old":"/api/v1/scribbles/:id/edit","type":0,"val":"edit","end":""}],
    types: placeholder as Registry['scribbles.edit']['types'],
  },
  'scribbles.update': {
    methods: ["PUT","PATCH"],
    pattern: '/api/v1/scribbles/:id',
    tokens: [{"old":"/api/v1/scribbles/:id","type":0,"val":"api","end":""},{"old":"/api/v1/scribbles/:id","type":0,"val":"v1","end":""},{"old":"/api/v1/scribbles/:id","type":0,"val":"scribbles","end":""},{"old":"/api/v1/scribbles/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['scribbles.update']['types'],
  },
  'scribbles.destroy': {
    methods: ["DELETE"],
    pattern: '/api/v1/scribbles/:id',
    tokens: [{"old":"/api/v1/scribbles/:id","type":0,"val":"api","end":""},{"old":"/api/v1/scribbles/:id","type":0,"val":"v1","end":""},{"old":"/api/v1/scribbles/:id","type":0,"val":"scribbles","end":""},{"old":"/api/v1/scribbles/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['scribbles.destroy']['types'],
  },
  'habits.index': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/habits',
    tokens: [{"old":"/api/v1/habits","type":0,"val":"api","end":""},{"old":"/api/v1/habits","type":0,"val":"v1","end":""},{"old":"/api/v1/habits","type":0,"val":"habits","end":""}],
    types: placeholder as Registry['habits.index']['types'],
  },
  'habits.create': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/habits/create',
    tokens: [{"old":"/api/v1/habits/create","type":0,"val":"api","end":""},{"old":"/api/v1/habits/create","type":0,"val":"v1","end":""},{"old":"/api/v1/habits/create","type":0,"val":"habits","end":""},{"old":"/api/v1/habits/create","type":0,"val":"create","end":""}],
    types: placeholder as Registry['habits.create']['types'],
  },
  'habits.store': {
    methods: ["POST"],
    pattern: '/api/v1/habits',
    tokens: [{"old":"/api/v1/habits","type":0,"val":"api","end":""},{"old":"/api/v1/habits","type":0,"val":"v1","end":""},{"old":"/api/v1/habits","type":0,"val":"habits","end":""}],
    types: placeholder as Registry['habits.store']['types'],
  },
  'habits.show': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/habits/:id',
    tokens: [{"old":"/api/v1/habits/:id","type":0,"val":"api","end":""},{"old":"/api/v1/habits/:id","type":0,"val":"v1","end":""},{"old":"/api/v1/habits/:id","type":0,"val":"habits","end":""},{"old":"/api/v1/habits/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['habits.show']['types'],
  },
  'habits.edit': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/habits/:id/edit',
    tokens: [{"old":"/api/v1/habits/:id/edit","type":0,"val":"api","end":""},{"old":"/api/v1/habits/:id/edit","type":0,"val":"v1","end":""},{"old":"/api/v1/habits/:id/edit","type":0,"val":"habits","end":""},{"old":"/api/v1/habits/:id/edit","type":1,"val":"id","end":""},{"old":"/api/v1/habits/:id/edit","type":0,"val":"edit","end":""}],
    types: placeholder as Registry['habits.edit']['types'],
  },
  'habits.update': {
    methods: ["PUT","PATCH"],
    pattern: '/api/v1/habits/:id',
    tokens: [{"old":"/api/v1/habits/:id","type":0,"val":"api","end":""},{"old":"/api/v1/habits/:id","type":0,"val":"v1","end":""},{"old":"/api/v1/habits/:id","type":0,"val":"habits","end":""},{"old":"/api/v1/habits/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['habits.update']['types'],
  },
  'habits.destroy': {
    methods: ["DELETE"],
    pattern: '/api/v1/habits/:id',
    tokens: [{"old":"/api/v1/habits/:id","type":0,"val":"api","end":""},{"old":"/api/v1/habits/:id","type":0,"val":"v1","end":""},{"old":"/api/v1/habits/:id","type":0,"val":"habits","end":""},{"old":"/api/v1/habits/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['habits.destroy']['types'],
  },
  'habits.increment': {
    methods: ["PATCH"],
    pattern: '/api/v1/habits/:id/increment',
    tokens: [{"old":"/api/v1/habits/:id/increment","type":0,"val":"api","end":""},{"old":"/api/v1/habits/:id/increment","type":0,"val":"v1","end":""},{"old":"/api/v1/habits/:id/increment","type":0,"val":"habits","end":""},{"old":"/api/v1/habits/:id/increment","type":1,"val":"id","end":""},{"old":"/api/v1/habits/:id/increment","type":0,"val":"increment","end":""}],
    types: placeholder as Registry['habits.increment']['types'],
  },
  'habits.decrement': {
    methods: ["PATCH"],
    pattern: '/api/v1/habits/:id/decrement',
    tokens: [{"old":"/api/v1/habits/:id/decrement","type":0,"val":"api","end":""},{"old":"/api/v1/habits/:id/decrement","type":0,"val":"v1","end":""},{"old":"/api/v1/habits/:id/decrement","type":0,"val":"habits","end":""},{"old":"/api/v1/habits/:id/decrement","type":1,"val":"id","end":""},{"old":"/api/v1/habits/:id/decrement","type":0,"val":"decrement","end":""}],
    types: placeholder as Registry['habits.decrement']['types'],
  },
  'habits.count': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/habits/:id/count',
    tokens: [{"old":"/api/v1/habits/:id/count","type":0,"val":"api","end":""},{"old":"/api/v1/habits/:id/count","type":0,"val":"v1","end":""},{"old":"/api/v1/habits/:id/count","type":0,"val":"habits","end":""},{"old":"/api/v1/habits/:id/count","type":1,"val":"id","end":""},{"old":"/api/v1/habits/:id/count","type":0,"val":"count","end":""}],
    types: placeholder as Registry['habits.count']['types'],
  },
  'backgrounds.index': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/backgrounds',
    tokens: [{"old":"/api/v1/backgrounds","type":0,"val":"api","end":""},{"old":"/api/v1/backgrounds","type":0,"val":"v1","end":""},{"old":"/api/v1/backgrounds","type":0,"val":"backgrounds","end":""}],
    types: placeholder as Registry['backgrounds.index']['types'],
  },
  'backgrounds.select': {
    methods: ["PATCH"],
    pattern: '/api/v1/backgrounds/select',
    tokens: [{"old":"/api/v1/backgrounds/select","type":0,"val":"api","end":""},{"old":"/api/v1/backgrounds/select","type":0,"val":"v1","end":""},{"old":"/api/v1/backgrounds/select","type":0,"val":"backgrounds","end":""},{"old":"/api/v1/backgrounds/select","type":0,"val":"select","end":""}],
    types: placeholder as Registry['backgrounds.select']['types'],
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
