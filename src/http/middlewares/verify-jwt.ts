import { type FastifyInstance, type FastifyRequest, type FastifyReply } from 'fastify'
import fp from 'fastify-plugin'
import fastifyJwt from '@fastify/jwt'

export default fp(async (server: FastifyInstance, options: { secret: string }) => {
  void server.register(fastifyJwt, {
    secret: options.secret
  })

  if (!server.hasDecorator('authenticate')) {
    server.decorate('authenticate', async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        await request.jwtVerify()
      } catch (err) {
        void reply.send(err)
      }
    })
  }
})
