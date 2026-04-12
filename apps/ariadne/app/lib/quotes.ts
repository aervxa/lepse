const QUOTES = [
  'The obstacle is the way.',
  'Clarity comes from action, not thought.',
  'Do the hard thing first.',
  'Confine yourself to the present.',
  'Begin at once to live, and count each separate day as a separate life.',
  'You are what you repeatedly do.',
  'Small things done consistently create extraordinary results.',
  'Your future self is watching you right now through your memories.',
  'The impediment to action advances action. What stands in the way becomes the way.',
  'You have power over your mind, not outside events.',
  'It is not that we have a short time to live, but that we waste a good deal of it.',
  'He who fears death will never do anything worthy of a living man.',
  'First say to yourself what you would be, then do what you have to do.',
  'Make the most of yourself, for that is all there is of you.',
  'Do what you can, with what you have, where you are.',
  "It always seems impossible until it's done.",
  "A year from now you'll wish you had started today.",
  'Every action you take is a vote for the type of person you wish to become.',
  'Work hard in silence. Let success be the noise.',
  'You only live once, but if you do it right, once is enough.',
  'The cave you fear to enter holds the treasure you seek.',
  'Discipline is choosing between what you want now and what you want most.',
  'Energy flows where attention goes.',
  'Do something today that your future self will thank you for.',
  'Hard choices, easy life. Easy choices, hard life.',
  'The only person you should try to be better than is the person you were yesterday.',
  "Don't wish it were easier. Wish you were better.",
  'Fall in love with the process and the results will come.',
  "Show up even when you don't feel like it.",
  'Knowing is not enough. We must apply.',
  'The mind is everything. What you think you become.',
  'In the middle of difficulty lies opportunity.',
  'Get busy living or get busy dying.',
  'You only have one life. Live it.',
  'Never let the fear of striking out keep you from playing the game.',
  "You miss 100% of the shots you don't take.",
  "Don't count the days. Make the days count.",
  'Stop waiting for motivation. Start, and motivation will follow.',
  'Comparison is the thief of joy.',
  'Be yourself. Everyone else is already taken.',
]

export function getRandomQuote(): string {
  return QUOTES[Math.floor(Math.random() * QUOTES.length)] || ''
}

export function getDailyQuote(): string {
  try {
    const storage = JSON.parse(localStorage.getItem('daily_quote') || 'null')
    if (!storage || storage.date !== new Date().toDateString()) {
      throw new Error('daily quote not found or expired')
    }
    return storage.quote
  } catch {
    const quote = getRandomQuote()
    localStorage.setItem('daily_quote', JSON.stringify({ quote, date: new Date().toDateString() }))
    return quote
  }
}
