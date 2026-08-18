/* eslint-disable prettier/prettier */
/// <reference path="../manifest.d.ts" />

import type { ExtractBody, ExtractErrorResponse, ExtractQuery, ExtractQueryForGet, ExtractResponse } from '@tuyau/core/types'
import type { InferInput, SimpleError } from '@vinejs/vine/types'

export type ParamValue = string | number | bigint | boolean

export interface Registry {
  'drive.fs.serve': {
    methods: ["GET","HEAD"]
    pattern: '/uploads/*'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { '*': ParamValue[] }
      query: {}
      response: unknown
      errorResponse: unknown
    }
  }
  'auth.new_account.store': {
    methods: ["POST"]
    pattern: '/api/v1/auth/signup'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/user').signupValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/user').signupValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/new_account_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/new_account_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'auth.access_token.store': {
    methods: ["POST"]
    pattern: '/api/v1/auth/login'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/user').loginValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/user').loginValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/access_token_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/access_token_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'auth.access_token.destroy': {
    methods: ["POST"]
    pattern: '/api/v1/auth/logout'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/access_token_controller').default['destroy']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/access_token_controller').default['destroy']>>>
    }
  }
  'verify.email.request': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/verify/email/request'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/verify_email_controller').default['request']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/verify_email_controller').default['request']>>>
    }
  }
  'verify.password-reset.request': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/verify/password-reset/request'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/password_reset_controller').default['request']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/password_reset_controller').default['request']>>>
    }
  }
  'backgrounds.index': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/backgrounds'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/backgrounds_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/backgrounds_controller').default['index']>>>
    }
  }
  'account.profile.show': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/account/profile'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/profile_controller').default['show']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/profile_controller').default['show']>>>
    }
  }
  'account.profile.update': {
    methods: ["PATCH"]
    pattern: '/api/v1/account/profile'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/profile').updateValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/profile').updateValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/profile_controller').default['update']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/profile_controller').default['update']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'backgrounds.select': {
    methods: ["PATCH"]
    pattern: '/api/v1/backgrounds/select'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/background').selectBackgroundValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/background').selectBackgroundValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/backgrounds_controller').default['select']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/backgrounds_controller').default['select']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'day.tasks.index': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/day/:date/tasks'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { date: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/task_days_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/task_days_controller').default['index']>>>
    }
  }
  'day.tasks.store': {
    methods: ["POST"]
    pattern: '/api/v1/day/:date/tasks'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/task_day').createTaskDayValidator)>>
      paramsTuple: [ParamValue]
      params: { date: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/task_day').createTaskDayValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/task_days_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/task_days_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'day.tasks.destroy': {
    methods: ["DELETE"]
    pattern: '/api/v1/day/:date/tasks/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue, ParamValue]
      params: { date: ParamValue; id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/task_days_controller').default['destroy']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/task_days_controller').default['destroy']>>>
    }
  }
  'day.session.show': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/day/:date/session'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { date: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/focus_sessions_controller').default['show']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/focus_sessions_controller').default['show']>>>
    }
  }
  'day.session.update': {
    methods: ["PATCH"]
    pattern: '/api/v1/day/:date/session'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/focus_session').focusSessionValidator)>>
      paramsTuple: [ParamValue]
      params: { date: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/focus_session').focusSessionValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/focus_sessions_controller').default['update']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/focus_sessions_controller').default['update']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'day.session.destroy': {
    methods: ["DELETE"]
    pattern: '/api/v1/day/:date/session'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { date: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/focus_sessions_controller').default['destroy']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/focus_sessions_controller').default['destroy']>>>
    }
  }
  'focus_sessions.index': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/focus-sessions'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: ExtractQueryForGet<InferInput<(typeof import('#validators/date_range').dateRangeValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/focus_sessions_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/focus_sessions_controller').default['index']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'tasks.index': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/tasks'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/tasks_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/tasks_controller').default['index']>>>
    }
  }
  'tasks.create': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/tasks/create'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/tasks_controller').default['create']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/tasks_controller').default['create']>>>
    }
  }
  'tasks.store': {
    methods: ["POST"]
    pattern: '/api/v1/tasks'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/task').createTaskValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/task').createTaskValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/tasks_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/tasks_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'tasks.show': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/tasks/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/tasks_controller').default['show']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/tasks_controller').default['show']>>>
    }
  }
  'tasks.edit': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/tasks/:id/edit'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/tasks_controller').default['edit']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/tasks_controller').default['edit']>>>
    }
  }
  'tasks.update': {
    methods: ["PUT","PATCH"]
    pattern: '/api/v1/tasks/:id'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/task').updateTaskValidator)>>
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/task').updateTaskValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/tasks_controller').default['update']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/tasks_controller').default['update']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'tasks.destroy': {
    methods: ["DELETE"]
    pattern: '/api/v1/tasks/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/tasks_controller').default['destroy']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/tasks_controller').default['destroy']>>>
    }
  }
  'goals.index': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/goals'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/goals_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/goals_controller').default['index']>>>
    }
  }
  'goals.create': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/goals/create'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/goals_controller').default['create']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/goals_controller').default['create']>>>
    }
  }
  'goals.store': {
    methods: ["POST"]
    pattern: '/api/v1/goals'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/goal').createGoalValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/goal').createGoalValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/goals_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/goals_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'goals.show': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/goals/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/goals_controller').default['show']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/goals_controller').default['show']>>>
    }
  }
  'goals.edit': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/goals/:id/edit'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/goals_controller').default['edit']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/goals_controller').default['edit']>>>
    }
  }
  'goals.update': {
    methods: ["PUT","PATCH"]
    pattern: '/api/v1/goals/:id'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/goal').updateGoalValidator)>>
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/goal').updateGoalValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/goals_controller').default['update']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/goals_controller').default['update']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'goals.destroy': {
    methods: ["DELETE"]
    pattern: '/api/v1/goals/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/goals_controller').default['destroy']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/goals_controller').default['destroy']>>>
    }
  }
}
