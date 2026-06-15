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
