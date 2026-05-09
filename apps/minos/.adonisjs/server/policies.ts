export const policies = {
  GoalPolicy: () => import('#policies/goal_policy'),
  ScribblePolicy: () => import('#policies/scribble_policy'),
  TaskDayPolicy: () => import('#policies/task_day_policy'),
  TaskPolicy: () => import('#policies/task_policy'),
}

