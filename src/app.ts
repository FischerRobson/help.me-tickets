import fastify from 'fastify'
import { env } from './env'
import { ZodError } from 'zod'
import { routes } from './http/routes'

export const app = fastify()

app.register(routes)

app.setErrorHandler((err, req, res) => {
  if (env.NODE_ENV !== 'prod') console.error(err)

  if (err instanceof ZodError) {
    return res.status(400).send({ error: err.format() })
  }

  return res.status(500).send({ error: 'Interal Server Error' })
})
