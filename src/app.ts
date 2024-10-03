import fastify from 'fastify'
import { env } from './env'
import { routes } from './http/routes'
import auth from './http/middlewares/verify-jwt'
import { errorHandler } from './error-handler'
import { logger } from './logger'
import { collectDefaultMetrics, register } from 'prom-client'
import { onStart } from './on-start'

collectDefaultMetrics()

export const app = fastify({
  logger
})

void app.register(auth, {
  secret: env.JWT_SECRET
})

void app.register(routes)

app.get('/metrics', async (req, res) => {
  void res.header('Content-Type', register.contentType)
  void res.send(await register.metrics())
})

app.setErrorHandler(errorHandler)

onStart()
