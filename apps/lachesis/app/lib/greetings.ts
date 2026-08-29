type Periods = 0 | 1 | 2 | 3
const GREETINGS = [
  // Period 12am - 6am
  [
    'Good night, {name}',
    'Night, {name}',
    "It's late, {name}",
    'Quiet hours, {name}',
    'Still awake, {name}',
    'A calm night, {name}',
  ],
  // Period 6am - 12pm
  [
    'Good morning, {name}',
    'Morning, {name}',
    "It's early, {name}",
    'A new morning, {name}',
    'Sunrise hours, {name}',
    'Early light, {name}',
  ],
  // Period 12pm - 6pm
  [
    'Good afternoon, {name}',
    'Afternoon, {name}',
    'The sun’s still up, {name}',
    'Midday, {name}',
    'Daylight hours, {name}',
    'Hope today feels light, {name}',
  ],
  // Period 6pm - 12am
  [
    'Good evening, {name}',
    'Evening, {name}',
    'The sun’s low, {name}',
    'Night ahead, {name}',
    'A calm evening, {name}',
    'Soft hours, {name}',
  ],
] satisfies [string[], string[], string[], string[]] // for indexing from Periods

export function getRandomGreeting(period: Periods) {
  const g = GREETINGS[period]
  return pickRandom(GREETINGS[period])
}

export function getGreeting(date: Date) {
  const n = Math.floor(date.getHours() / 6) as Periods
  const period = new Date().toDateString() + ':' + n
  try {
    const storage = JSON.parse(localStorage.getItem('greeting') || 'null')
    if (!storage || storage.period !== period) {
      throw new Error('greeting not found or expired')
    }
    return storage.greeting as string
  } catch {
    const greeting = getRandomGreeting(n)
    localStorage.setItem('greeting', JSON.stringify({ greeting, period }))
    return greeting
  }
}
