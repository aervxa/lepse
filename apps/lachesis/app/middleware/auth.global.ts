export default defineNuxtRouteMiddleware((to) => {
  const token = useCookie('auth_token')

  const publicOnlyRoutes = ['/login', '/signup']
  const publicRoutes = [...publicOnlyRoutes, '/verify/email']

  if (!token.value && !publicRoutes.includes(to.path)) {
    return navigateTo('/login')
  }

  if (token.value && publicOnlyRoutes.includes(to.path)) {
    return navigateTo('/')
  }
})
