import { type FastifyInstance } from 'fastify'
import cors from '@fastify/cors'
import { env } from './env'

export async function corsConfig (fastify: FastifyInstance) {
  await fastify.register(cors, {
    origin: (origin, callback) => {
      const allowedOrigins = env.CORS_ALLOWED_ORIGINS
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true)
      } else {
        callback(new Error('Not allowed by CORS'), origin)
      }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
  })
}
