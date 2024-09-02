import fastify from 'fastify'
import { env } from './env'
import { routes } from './http/routes'
import auth from './http/middlewares/verify-jwt'
import { errorHandler } from './error-handler'
import { logger } from './logger'

export const app = fastify({
  logger
})

void app.register(auth, {
  secret: env.JWT_SECRET
})

void app.register(routes)

app.setErrorHandler(errorHandler)
