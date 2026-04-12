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
  }
  GET: {
    'account.profile.show': { paramsTuple?: []; params?: {} }
    'focus_sessions.show': { paramsTuple?: []; params?: {} }
  }
  HEAD: {
    'account.profile.show': { paramsTuple?: []; params?: {} }
    'focus_sessions.show': { paramsTuple?: []; params?: {} }
  }
  POST: {
    'auth.new_account.store': { paramsTuple?: []; params?: {} }
    'auth.access_token.store': { paramsTuple?: []; params?: {} }
    'auth.access_token.destroy': { paramsTuple?: []; params?: {} }
  }
  PATCH: {
    'focus_sessions.update': { paramsTuple?: []; params?: {} }
  }
  DELETE: {
    'focus_sessions.destroy': { paramsTuple?: []; params?: {} }
  }
}
declare module '@adonisjs/core/types/http' {
  export interface RoutesList extends ScannedRoutes {}
}