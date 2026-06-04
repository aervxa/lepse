const SKELETON_DELAY_MS = 200

export const skeletonLoad = async <T>(promise: Promise<T>, show: Ref<boolean>): Promise<T> => {
  const timer = setTimeout(() => {
    show.value = true
  }, SKELETON_DELAY_MS)

  try {
    return await promise
  } finally {
    clearTimeout(timer)
    show.value = false
  }
}
