import { type FastifyError, type FastifyReply, type FastifyRequest } from 'fastify'
import { env } from './env'
import { HttpStatusCode } from './constants/HttpStatusCode'
import { ZodError } from 'zod'

export function errorHandler (error: FastifyError, request: FastifyRequest, res: FastifyReply) {
  if (env.NODE_ENV !== 'prod') console.error(error)

  if (error instanceof ZodError) {
    return res.status(HttpStatusCode.BadRequest).send({ error: formatZodError(error) })
  }

  if (error.code === 'FST_JWT_AUTHORIZATION_TOKEN_EXPIRED') {
    return res.status(HttpStatusCode.Forbidden).send(error.message)
  }

  return res.status(500).send({ error: error.message })
}

const formatZodError = (error: ZodError) => {
  const formattedErrors: Record<string, string> = {}

  error.errors.forEach((err) => {
    if (err.path.length > 0) {
      const key = err.path.join('.')
      formattedErrors[key] = err.message
    } else {
      formattedErrors.general = err.message
    }
  })

  return formattedErrors
}
