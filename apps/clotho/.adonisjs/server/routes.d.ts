import '@adonisjs/core/types/http'

type ParamValue = string | number | bigint | boolean

export type ScannedRoutes = {
  ALL: {
    'drive.fs.serve': { paramsTuple: [...ParamValue[]]; params: {'*': ParamValue[]} }
    'auth.new_account.store': { paramsTuple?: []; params?: {} }
    'auth.access_token.store': { paramsTuple?: []; params?: {} }
    'auth.access_token.destroy': { paramsTuple?: []; params?: {} }
    'verify.email.request': { paramsTuple?: []; params?: {} }
    'verify.email': { paramsTuple: [ParamValue]; params: {'token': ParamValue} }
    'backgrounds.index': { paramsTuple?: []; params?: {} }
    'account.profile.show': { paramsTuple?: []; params?: {} }
    'account.profile.update': { paramsTuple?: []; params?: {} }
    'backgrounds.select': { paramsTuple?: []; params?: {} }
    'day.tasks.index': { paramsTuple: [ParamValue]; params: {'date': ParamValue} }
    'day.tasks.store': { paramsTuple: [ParamValue]; params: {'date': ParamValue} }
    'day.tasks.destroy': { paramsTuple: [ParamValue,ParamValue]; params: {'date': ParamValue,'id': ParamValue} }
    'day.session.show': { paramsTuple: [ParamValue]; params: {'date': ParamValue} }
    'day.session.update': { paramsTuple: [ParamValue]; params: {'date': ParamValue} }
    'day.session.destroy': { paramsTuple: [ParamValue]; params: {'date': ParamValue} }
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
  }
  GET: {
    'drive.fs.serve': { paramsTuple: [...ParamValue[]]; params: {'*': ParamValue[]} }
    'verify.email.request': { paramsTuple?: []; params?: {} }
    'verify.email': { paramsTuple: [ParamValue]; params: {'token': ParamValue} }
    'backgrounds.index': { paramsTuple?: []; params?: {} }
    'account.profile.show': { paramsTuple?: []; params?: {} }
    'day.tasks.index': { paramsTuple: [ParamValue]; params: {'date': ParamValue} }
    'day.session.show': { paramsTuple: [ParamValue]; params: {'date': ParamValue} }
    'focus_sessions.index': { paramsTuple?: []; params?: {} }
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
    'drive.fs.serve': { paramsTuple: [...ParamValue[]]; params: {'*': ParamValue[]} }
    'verify.email.request': { paramsTuple?: []; params?: {} }
    'verify.email': { paramsTuple: [ParamValue]; params: {'token': ParamValue} }
    'backgrounds.index': { paramsTuple?: []; params?: {} }
    'account.profile.show': { paramsTuple?: []; params?: {} }
    'day.tasks.index': { paramsTuple: [ParamValue]; params: {'date': ParamValue} }
    'day.session.show': { paramsTuple: [ParamValue]; params: {'date': ParamValue} }
    'focus_sessions.index': { paramsTuple?: []; params?: {} }
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
    'account.profile.update': { paramsTuple?: []; params?: {} }
    'backgrounds.select': { paramsTuple?: []; params?: {} }
    'day.session.update': { paramsTuple: [ParamValue]; params: {'date': ParamValue} }
    'tasks.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'goals.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
  DELETE: {
    'day.tasks.destroy': { paramsTuple: [ParamValue,ParamValue]; params: {'date': ParamValue,'id': ParamValue} }
    'day.session.destroy': { paramsTuple: [ParamValue]; params: {'date': ParamValue} }
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