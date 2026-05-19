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
    journal: {
      show: typeof routes['day.journal.show']
      update: typeof routes['day.journal.update']
    }
  }
  journals: {
    index: typeof routes['journals.index']
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
  scribbles: {
    index: typeof routes['scribbles.index']
    create: typeof routes['scribbles.create']
    store: typeof routes['scribbles.store']
    show: typeof routes['scribbles.show']
    edit: typeof routes['scribbles.edit']
    update: typeof routes['scribbles.update']
    destroy: typeof routes['scribbles.destroy']
  }
  habits: {
    index: typeof routes['habits.index']
    create: typeof routes['habits.create']
    store: typeof routes['habits.store']
    show: typeof routes['habits.show']
    edit: typeof routes['habits.edit']
    update: typeof routes['habits.update']
    destroy: typeof routes['habits.destroy']
    increment: typeof routes['habits.increment']
    decrement: typeof routes['habits.decrement']
    count: typeof routes['habits.count']
  }
}
