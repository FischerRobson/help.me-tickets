import fastify from 'fastify'
import { env } from './env'
import { ZodError } from 'zod'
import { routes } from './http/routes'
import auth from './http/middlewares/verify-jwt'

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

app.setErrorHandler((err, req, res) => {
  if (env.NODE_ENV !== 'prod') console.error(err)

  if (err instanceof ZodError) {
    return res.status(400).send({ error: err.format() })
  }

  return res.status(500).send({ error: 'Interal Server Error' })
})
