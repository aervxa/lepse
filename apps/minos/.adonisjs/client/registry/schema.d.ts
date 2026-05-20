/* eslint-disable prettier/prettier */
/// <reference path="../manifest.d.ts" />

import type { ExtractBody, ExtractErrorResponse, ExtractQuery, ExtractQueryForGet, ExtractResponse } from '@tuyau/core/types'
import type { InferInput, SimpleError } from '@vinejs/vine/types'

export type ParamValue = string | number | bigint | boolean

export interface Registry {
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
  'day.journal.show': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/day/:date/journal'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { date: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/journals_controller').default['show']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/journals_controller').default['show']>>>
    }
  }
  'day.journal.update': {
    methods: ["PATCH"]
    pattern: '/api/v1/day/:date/journal'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/journal').updateJournalValidator)>>
      paramsTuple: [ParamValue]
      params: { date: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/journal').updateJournalValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/journals_controller').default['update']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/journals_controller').default['update']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'journals.index': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/journals'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/journals_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/journals_controller').default['index']>>>
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
  'scribbles.index': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/scribbles'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/scribbles_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/scribbles_controller').default['index']>>>
    }
  }
  'scribbles.create': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/scribbles/create'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/scribbles_controller').default['create']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/scribbles_controller').default['create']>>>
    }
  }
  'scribbles.store': {
    methods: ["POST"]
    pattern: '/api/v1/scribbles'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/scribble').createScribbleValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/scribble').createScribbleValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/scribbles_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/scribbles_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'scribbles.show': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/scribbles/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/scribbles_controller').default['show']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/scribbles_controller').default['show']>>>
    }
  }
  'scribbles.edit': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/scribbles/:id/edit'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/scribbles_controller').default['edit']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/scribbles_controller').default['edit']>>>
    }
  }
  'scribbles.update': {
    methods: ["PUT","PATCH"]
    pattern: '/api/v1/scribbles/:id'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/scribble').updateScribbleValidator)>>
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/scribble').updateScribbleValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/scribbles_controller').default['update']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/scribbles_controller').default['update']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'scribbles.destroy': {
    methods: ["DELETE"]
    pattern: '/api/v1/scribbles/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/scribbles_controller').default['destroy']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/scribbles_controller').default['destroy']>>>
    }
  }
  'habits.index': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/habits'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/habits_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/habits_controller').default['index']>>>
    }
  }
  'habits.create': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/habits/create'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/habits_controller').default['create']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/habits_controller').default['create']>>>
    }
  }
  'habits.store': {
    methods: ["POST"]
    pattern: '/api/v1/habits'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/habit').createHabitValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/habit').createHabitValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/habits_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/habits_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'habits.show': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/habits/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/habits_controller').default['show']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/habits_controller').default['show']>>>
    }
  }
  'habits.edit': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/habits/:id/edit'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/habits_controller').default['edit']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/habits_controller').default['edit']>>>
    }
  }
  'habits.update': {
    methods: ["PUT","PATCH"]
    pattern: '/api/v1/habits/:id'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/habit').updateHabitValidator)>>
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/habit').updateHabitValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/habits_controller').default['update']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/habits_controller').default['update']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'habits.destroy': {
    methods: ["DELETE"]
    pattern: '/api/v1/habits/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/habits_controller').default['destroy']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/habits_controller').default['destroy']>>>
    }
  }
  'habits.increment': {
    methods: ["PATCH"]
    pattern: '/api/v1/habits/:id/increment'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/habit_periods_controller').default['increment']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/habit_periods_controller').default['increment']>>>
    }
  }
  'habits.decrement': {
    methods: ["PATCH"]
    pattern: '/api/v1/habits/:id/decrement'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/habit_periods_controller').default['decrement']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/habit_periods_controller').default['decrement']>>>
    }
  }
  'habits.count': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/habits/:id/count'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: ExtractQueryForGet<InferInput<(typeof import('#validators/date_range').optionalDateRangeValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/habit_periods_controller').default['count']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/habit_periods_controller').default['count']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
}
