export const GREETINGS = [
  // Period 9pm - 3am
  [
    'Cooking something up so late, {name}?',
    'Good night, {name}',
    "Isn't it time to sleep, {name}?",
    "Isn't it too late, {name}?",
    'Much of a night owl, {name}?',
    'Locking in at night, {name}?',
    'Sleep for tomorrow, {name}',
  ],
  // Period 3am - 9am
  [
    'Cooking something up so early, {name}?',
    'Rise and shine, {name}!',
    'Good early morning, {name}',
    'Good morning, {name}',
    'Awake at sunrise hours, {name}?',
    "You've got a great day ahead, {name}!",
    'A new day, a new {name}!',
  ],
  // Period 9am - 3pm
  [
    'Getting things done, {name}?',
    'May I suggest a break, {name}?',
    'The sun is still up, {name}. You can do it too!',
    "It's not too late to start, {name}!",
    'Good afternoon, {name}',
    'This is the high point, {name}',
    'The night is approaching, {name}',
  ],
  // Period 3pm - 9pm
  [
    "It's time to wrap up, {name}",
    'Good evening, {name}',
    'The sun is going down, {name}. Maybe you should too?',
    'Ease things down, {name}. You can continue tomorrow!',
    "It's time for the night to come, {name}",
    'Accept the night, {name}',
    'You did well today, {name}!',
  ],
] satisfies [string[], string[], string[], string[]] // for indexing via 0 | 1 | 2 | 3
