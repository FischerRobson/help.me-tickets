import { type FastifyInstance, type FastifyRequest, type FastifyReply } from 'fastify'
import fp from 'fastify-plugin'
import fastifyJwt from '@fastify/jwt'
import { HttpStatusCode } from '@/constants/HttpStatusCode'
import { env } from '@/env'
import fastifyCookie from '@fastify/cookie'

// const isDevEnv = env.NODE_ENV === 'dev'

// export default fp(async (server: FastifyInstance, options: { secret: string }) => {
//   void server.register(fastifyJwt, {
//     secret: options.secret
//   })

//   if (!server.hasDecorator('authenticate')) {
//     server.decorate('authenticate', async (request: FastifyRequest, reply: FastifyReply) => {
//       try {
//         if (isDevEnv) {
//           await request.jwtVerify({
//             ignoreExpiration: true
//           })
//         } else {
//           await request.jwtVerify()
//         }
//       } catch (err) {
//         void reply.status(HttpStatusCode.Unauthorized).send(err)
//       }
//     })
//   }
// })

const isDevEnv = env.NODE_ENV === 'dev'

export default fp(async (server: FastifyInstance, options: { secret: string }) => {
  void server.register(fastifyJwt, {
    secret: options.secret,
    cookie: { cookieName: 'jwt' } // prevent Authorization to be checked
  })

  void server.register(fastifyCookie) // Register the cookie plugin

  if (!server.hasDecorator('authenticate')) {
    server.decorate('authenticate', async (request: FastifyRequest, reply: FastifyReply) => {
      console.log('Received cookies:', request.cookies)
      try {
        const token = request.cookies.jwt

        if (!token) {
          return await reply.status(HttpStatusCode.Unauthorized).send({ message: 'Missing token' })
        }

        if (isDevEnv) {
          await request.jwtVerify({
            token,
            ignoreExpiration: true // Allow expired tokens in dev environment
          })
        } else {
          await request.jwtVerify({ token })
        }
      } catch (err) {
        console.error('JWT verification failed:', err)
        return await reply.status(HttpStatusCode.Unauthorized).send({ message: 'Invalid or expired token' })
      }
    })
  }
})
