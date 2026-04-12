import { ref } from 'vue'

export class Stopwatch {
  constructor({
    onStart,
    onStop,
    onReset,
  }: { onStart?: () => void; onStop?: () => void; onReset?: () => void } = {}) {
    this.#onStart = onStart
    this.#onStop = onStop
    this.#onReset = onReset
  }

  // Listeners
  #onStart?: () => void
  #onStop?: () => void
  #onReset?: () => void

  #running = ref(false) // track running state of stopwatch
  #elapsed = ref(0) // tracking of elapsed time
  #origin = 0 // tracking of start time
  #req = 0 // to cancel `requestAnimationFrame`

  #tick() {
    this.#elapsed.value = performance.now() - this.#origin
    this.#req = requestAnimationFrame(this.#tick.bind(this))
  }

  start() {
    this.#running.value = true
    // Recalibrate #origin
    this.#origin = performance.now() - this.#elapsed.value
    this.#req = requestAnimationFrame(this.#tick.bind(this))
    this.#onStart?.()
  }

  stop() {
    this.#running.value = false
    cancelAnimationFrame(this.#req)
    this.#onStop?.()
  }

  reset() {
    this.stop()
    this.#elapsed.value = 0
    this.#onReset?.()
  }

  toggle() {
    this.#running.value ? this.stop() : this.start()
  }

  get elapsed() {
    return this.#elapsed
  }
  get running() {
    return this.#running
  }
}

export const formatDuration = (duration: number, { format = 'hh:mm:ss.SSS', pad = true } = {}) => {
  const abs = Math.abs(duration) // to continue if duration is negative
  const date = new Date(abs)

  // Maps of placeholders to values
  const maps = {
    hh: date
      .getUTCHours()
      .toString()
      .padStart(pad ? 2 : 0, '0'),
    mm: date
      .getUTCMinutes()
      .toString()
      .padStart(pad ? 2 : 0, '0'),
    ss: date
      .getUTCSeconds()
      .toString()
      .padStart(pad ? 2 : 0, '0'),
    SSS: date
      .getUTCMilliseconds()
      .toString()
      .padStart(pad ? 3 : 0, '0'),
    get SS() {
      return this.SSS.slice(0, 2)
    },
  }

  // Replace all placeholders with it's respective values
  for (const [key, value] of Object.entries(maps)) {
    format = format.replaceAll(key, value)
  }

  return `${duration < 0 ? '-' : ''}${format}`
}
