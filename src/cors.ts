import { type FastifyInstance } from 'fastify'
import cors from '@fastify/cors'

export async function corsConfig (fastify: FastifyInstance) {
  await fastify.register(cors, {
    origin: (origin, callback) => {
      const allowedOrigins = ['http://localhost:3000']
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
