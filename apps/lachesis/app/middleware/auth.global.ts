export default defineNuxtRouteMiddleware((to) => {
  const token = useCookie('auth_token')

  const publicRoutes = ['/login', '/signup']

  if (!token.value && !publicRoutes.includes(to.path)) {
    return navigateTo('/login')
  }

  if (token.value && publicRoutes.includes(to.path)) {
    return navigateTo('/')
  }
})
