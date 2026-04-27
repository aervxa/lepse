import '@adonisjs/core/types/http'

type ParamValue = string | number | bigint | boolean

export type ScannedRoutes = {
  ALL: {
    'auth.new_account.store': { paramsTuple?: []; params?: {} }
    'auth.access_token.store': { paramsTuple?: []; params?: {} }
    'auth.access_token.destroy': { paramsTuple?: []; params?: {} }
    'account.profile.show': { paramsTuple?: []; params?: {} }
    'focus_sessions.show': { paramsTuple?: []; params?: {} }
    'focus_sessions.update': { paramsTuple?: []; params?: {} }
    'focus_sessions.destroy': { paramsTuple?: []; params?: {} }
    'day.tasks.index': { paramsTuple: [ParamValue]; params: {'date': ParamValue} }
    'day.tasks.store': { paramsTuple: [ParamValue]; params: {'date': ParamValue} }
    'day.tasks.destroy': { paramsTuple: [ParamValue,ParamValue]; params: {'date': ParamValue,'id': ParamValue} }
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
  }
  GET: {
    'account.profile.show': { paramsTuple?: []; params?: {} }
    'focus_sessions.show': { paramsTuple?: []; params?: {} }
    'day.tasks.index': { paramsTuple: [ParamValue]; params: {'date': ParamValue} }
    'tasks.index': { paramsTuple?: []; params?: {} }
    'tasks.create': { paramsTuple?: []; params?: {} }
    'tasks.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'tasks.edit': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'goals.index': { paramsTuple?: []; params?: {} }
    'goals.create': { paramsTuple?: []; params?: {} }
    'goals.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'goals.edit': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
  HEAD: {
    'account.profile.show': { paramsTuple?: []; params?: {} }
    'focus_sessions.show': { paramsTuple?: []; params?: {} }
    'day.tasks.index': { paramsTuple: [ParamValue]; params: {'date': ParamValue} }
    'tasks.index': { paramsTuple?: []; params?: {} }
    'tasks.create': { paramsTuple?: []; params?: {} }
    'tasks.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'tasks.edit': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'goals.index': { paramsTuple?: []; params?: {} }
    'goals.create': { paramsTuple?: []; params?: {} }
    'goals.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'goals.edit': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
  POST: {
    'auth.new_account.store': { paramsTuple?: []; params?: {} }
    'auth.access_token.store': { paramsTuple?: []; params?: {} }
    'auth.access_token.destroy': { paramsTuple?: []; params?: {} }
    'day.tasks.store': { paramsTuple: [ParamValue]; params: {'date': ParamValue} }
    'tasks.store': { paramsTuple?: []; params?: {} }
    'goals.store': { paramsTuple?: []; params?: {} }
  }
  PATCH: {
    'focus_sessions.update': { paramsTuple?: []; params?: {} }
    'tasks.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'goals.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
  DELETE: {
    'focus_sessions.destroy': { paramsTuple?: []; params?: {} }
    'day.tasks.destroy': { paramsTuple: [ParamValue,ParamValue]; params: {'date': ParamValue,'id': ParamValue} }
    'tasks.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'goals.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
  PUT: {
    'tasks.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'goals.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
}
declare module '@adonisjs/core/types/http' {
  export interface RoutesList extends ScannedRoutes {}
}