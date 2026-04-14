/* eslint-disable prettier/prettier */
import type { routes } from './index.ts'

export interface ApiDefinition {
  auth: {
    newAccount: {
      store: typeof routes['auth.new_account.store']
    }
    accessToken: {
      store: typeof routes['auth.access_token.store']
      destroy: typeof routes['auth.access_token.destroy']
    }
  }
  account: {
    profile: {
      show: typeof routes['account.profile.show']
    }
  }
  focusSessions: {
    show: typeof routes['focus_sessions.show']
    update: typeof routes['focus_sessions.update']
    destroy: typeof routes['focus_sessions.destroy']
  }
  tasks: {
    index: typeof routes['tasks.index']
    create: typeof routes['tasks.create']
    store: typeof routes['tasks.store']
    show: typeof routes['tasks.show']
    edit: typeof routes['tasks.edit']
    update: typeof routes['tasks.update']
    destroy: typeof routes['tasks.destroy']
  }
}
