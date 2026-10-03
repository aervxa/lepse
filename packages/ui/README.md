# Lepse UI

This is not zero config, a CSS including `@import "@lepse/ui/app/assets/css/tailwind.css";` is required.

TailwindCSS has to be imported on a css file for it to extend tailwind. If this is zero config, it will end up with two instances calling tailwindcss in this use case. (look at nuxt.config.ts)
