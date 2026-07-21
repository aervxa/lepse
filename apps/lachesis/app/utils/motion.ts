import type { MotionProps } from 'motion-v'

export const popoverTransition = {
  before(): MotionProps['transition'] {
    return {
      layout: {
        type: 'spring',
        stiffness: 500,
        damping: 30,
        mass: 0.7,
      },
    }
  },
  after(): MotionProps['transition'] {
    return {
      layout: {
        type: 'spring',
        stiffness: 500,
        damping: 30,
      },
    }
  },
}

export const contentTransition = {
  out(): MotionProps['transition'] {
    return {
      type: 'spring',
      stiffness: 520,
      damping: 36,
      mass: 0.65,
    }
  },
  in(): MotionProps['transition'] {
    return {
      type: 'spring',
      stiffness: 420,
      damping: 34,
      mass: 0.75,
    }
  },
}
