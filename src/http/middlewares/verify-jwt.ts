import { type FastifyInstance, type FastifyRequest, type FastifyReply } from 'fastify'
import fp from 'fastify-plugin'
import fastifyJwt from '@fastify/jwt'
import { HttpStatusCode } from '@/constants/HttpStatusCode'
import { env } from '@/env'

export default fp(async (server: FastifyInstance, options: { secret: string }) => {
  void server.register(fastifyJwt, {
    secret: options.secret
  })

  if (!server.hasDecorator('authenticate')) {
    server.decorate('authenticate', async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        if (env.NODE_ENV === 'dev') {
          await request.jwtVerify({
            ignoreExpiration: true
          })
        } else {
          await request.jwtVerify()
        }
      } catch (err) {
        void reply.status(HttpStatusCode.Unauthorized).send(err)
      }
    })
  }
})
