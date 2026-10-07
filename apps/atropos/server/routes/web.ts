export default defineEventHandler((event) => {
  const config = useRuntimeConfig()

  return sendRedirect(event, config.public.webUrl, 302)
})
