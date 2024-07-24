import { type FastifyInstance } from 'fastify'
import { ticketsController } from './controllers/tickets-controller'

export async function routes (app: FastifyInstance) {
  app.post('/tickets', ticketsController.create)
}
