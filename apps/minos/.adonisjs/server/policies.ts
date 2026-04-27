export const policies = {
  GoalPolicy: () => import('#policies/goal_policy'),
  TaskPolicy: () => import('#policies/task_policy'),
  TaskDayPolicy: () => import('#policies/task_day_policy'),
}

