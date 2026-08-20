/* eslint-disable prettier/prettier */
import type { routes } from './index.ts'

export interface ApiDefinition {
  drive: {
    fs: {
      serve: typeof routes['drive.fs.serve']
    }
  }
  auth: {
    newAccount: {
      store: typeof routes['auth.new_account.store']
    }
    accessToken: {
      store: typeof routes['auth.access_token.store']
      destroy: typeof routes['auth.access_token.destroy']
    }
  }
  verify: {
    email: {
      request: typeof routes['verify.email.request']
    }
    passwordReset: {
      request: typeof routes['verify.password-reset.request']
    }
  }
  backgrounds: {
    index: typeof routes['backgrounds.index']
    select: typeof routes['backgrounds.select']
  }
  account: {
    profile: {
      show: typeof routes['account.profile.show']
      update: typeof routes['account.profile.update']
    }
  }
  day: {
    tasks: {
      index: typeof routes['day.tasks.index']
      store: typeof routes['day.tasks.store']
      destroy: typeof routes['day.tasks.destroy']
    }
    session: {
      show: typeof routes['day.session.show']
      update: typeof routes['day.session.update']
      destroy: typeof routes['day.session.destroy']
    }
  }
  focusSessions: {
    index: typeof routes['focus_sessions.index']
  }
  tasks: {
    index: typeof routes['tasks.index']
    create: typeof routes['tasks.create']
    store: typeof routes['tasks.store']
    show: typeof routes['tasks.show']
    edit: typeof routes['tasks.edit']
    update: typeof routes['tasks.update']
    destroy: typeof routes['tasks.destroy']
    attachGoal: typeof routes['tasks.attach_goal']
    detachGoal: typeof routes['tasks.detach_goal']
  }
  goals: {
    index: typeof routes['goals.index']
    create: typeof routes['goals.create']
    store: typeof routes['goals.store']
    show: typeof routes['goals.show']
    edit: typeof routes['goals.edit']
    update: typeof routes['goals.update']
    destroy: typeof routes['goals.destroy']
  }
}
