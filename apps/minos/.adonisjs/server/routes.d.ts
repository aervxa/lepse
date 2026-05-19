import '@adonisjs/core/types/http'

type ParamValue = string | number | bigint | boolean

export type ScannedRoutes = {
  ALL: {
    'auth.new_account.store': { paramsTuple?: []; params?: {} }
    'auth.access_token.store': { paramsTuple?: []; params?: {} }
    'auth.access_token.destroy': { paramsTuple?: []; params?: {} }
    'account.profile.show': { paramsTuple?: []; params?: {} }
    'day.tasks.index': { paramsTuple: [ParamValue]; params: {'date': ParamValue} }
    'day.tasks.store': { paramsTuple: [ParamValue]; params: {'date': ParamValue} }
    'day.tasks.destroy': { paramsTuple: [ParamValue,ParamValue]; params: {'date': ParamValue,'id': ParamValue} }
    'day.session.show': { paramsTuple: [ParamValue]; params: {'date': ParamValue} }
    'day.session.update': { paramsTuple: [ParamValue]; params: {'date': ParamValue} }
    'day.journal.show': { paramsTuple: [ParamValue]; params: {'date': ParamValue} }
    'day.journal.update': { paramsTuple: [ParamValue]; params: {'date': ParamValue} }
    'journals.index': { paramsTuple?: []; params?: {} }
    'focus_sessions.index': { paramsTuple?: []; params?: {} }
    'tasks.index': { paramsTuple?: []; params?: {} }
    'tasks.create': { paramsTuple?: []; params?: {} }
    'tasks.store': { paramsTuple?: []; params?: {} }
    'tasks.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'tasks.edit': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'tasks.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'tasks.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'goals.index': { paramsTuple?: []; params?: {} }
    'goals.create': { paramsTuple?: []; params?: {} }
    'goals.store': { paramsTuple?: []; params?: {} }
    'goals.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'goals.edit': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'goals.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'goals.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'scribbles.index': { paramsTuple?: []; params?: {} }
    'scribbles.create': { paramsTuple?: []; params?: {} }
    'scribbles.store': { paramsTuple?: []; params?: {} }
    'scribbles.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'scribbles.edit': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'scribbles.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'scribbles.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'habits.index': { paramsTuple?: []; params?: {} }
    'habits.create': { paramsTuple?: []; params?: {} }
    'habits.store': { paramsTuple?: []; params?: {} }
    'habits.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'habits.edit': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'habits.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'habits.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'habits.increment': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'habits.decrement': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'habits.count': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
  GET: {
    'account.profile.show': { paramsTuple?: []; params?: {} }
    'day.tasks.index': { paramsTuple: [ParamValue]; params: {'date': ParamValue} }
    'day.session.show': { paramsTuple: [ParamValue]; params: {'date': ParamValue} }
    'day.journal.show': { paramsTuple: [ParamValue]; params: {'date': ParamValue} }
    'journals.index': { paramsTuple?: []; params?: {} }
    'focus_sessions.index': { paramsTuple?: []; params?: {} }
    'tasks.index': { paramsTuple?: []; params?: {} }
    'tasks.create': { paramsTuple?: []; params?: {} }
    'tasks.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'tasks.edit': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'goals.index': { paramsTuple?: []; params?: {} }
    'goals.create': { paramsTuple?: []; params?: {} }
    'goals.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'goals.edit': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'scribbles.index': { paramsTuple?: []; params?: {} }
    'scribbles.create': { paramsTuple?: []; params?: {} }
    'scribbles.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'scribbles.edit': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'habits.index': { paramsTuple?: []; params?: {} }
    'habits.create': { paramsTuple?: []; params?: {} }
    'habits.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'habits.edit': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'habits.count': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
  HEAD: {
    'account.profile.show': { paramsTuple?: []; params?: {} }
    'day.tasks.index': { paramsTuple: [ParamValue]; params: {'date': ParamValue} }
    'day.session.show': { paramsTuple: [ParamValue]; params: {'date': ParamValue} }
    'day.journal.show': { paramsTuple: [ParamValue]; params: {'date': ParamValue} }
    'journals.index': { paramsTuple?: []; params?: {} }
    'focus_sessions.index': { paramsTuple?: []; params?: {} }
    'tasks.index': { paramsTuple?: []; params?: {} }
    'tasks.create': { paramsTuple?: []; params?: {} }
    'tasks.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'tasks.edit': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'goals.index': { paramsTuple?: []; params?: {} }
    'goals.create': { paramsTuple?: []; params?: {} }
    'goals.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'goals.edit': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'scribbles.index': { paramsTuple?: []; params?: {} }
    'scribbles.create': { paramsTuple?: []; params?: {} }
    'scribbles.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'scribbles.edit': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'habits.index': { paramsTuple?: []; params?: {} }
    'habits.create': { paramsTuple?: []; params?: {} }
    'habits.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'habits.edit': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'habits.count': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
  POST: {
    'auth.new_account.store': { paramsTuple?: []; params?: {} }
    'auth.access_token.store': { paramsTuple?: []; params?: {} }
    'auth.access_token.destroy': { paramsTuple?: []; params?: {} }
    'day.tasks.store': { paramsTuple: [ParamValue]; params: {'date': ParamValue} }
    'tasks.store': { paramsTuple?: []; params?: {} }
    'goals.store': { paramsTuple?: []; params?: {} }
    'scribbles.store': { paramsTuple?: []; params?: {} }
    'habits.store': { paramsTuple?: []; params?: {} }
  }
  DELETE: {
    'day.tasks.destroy': { paramsTuple: [ParamValue,ParamValue]; params: {'date': ParamValue,'id': ParamValue} }
    'tasks.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'goals.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'scribbles.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'habits.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
  PATCH: {
    'day.session.update': { paramsTuple: [ParamValue]; params: {'date': ParamValue} }
    'day.journal.update': { paramsTuple: [ParamValue]; params: {'date': ParamValue} }
    'tasks.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'goals.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'scribbles.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'habits.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'habits.increment': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'habits.decrement': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
  PUT: {
    'tasks.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'goals.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'scribbles.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'habits.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
}
declare module '@adonisjs/core/types/http' {
  export interface RoutesList extends ScannedRoutes {}
}