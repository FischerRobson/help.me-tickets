import fastify from 'fastify'
import { env } from './env'
import { routes } from './http/routes'
import auth from './http/middlewares/verify-jwt'
import { errorHandler } from './error-handler'

export const app = fastify()

void app.register(auth, {
  secret: env.JWT_SECRET
})

app.decorate('authenticate', async (request: any, reply: any) => {
  try {
    await request.jwtVerify()
  } catch (err) {
    reply.send(err)
  }
})

void app.register(routes)

app.setErrorHandler(errorHandler)
