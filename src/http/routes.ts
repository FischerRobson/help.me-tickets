/* eslint-disable @typescript-eslint/unbound-method */
import { type FastifyInstance } from 'fastify'
import { ticketsController } from './controllers/tickets-controller'
import { categoriesController } from './controllers/categories-controller'

export async function routes (app: FastifyInstance) {
  app.post('/tickets', ticketsController.create)
  app.get('/tickets', ticketsController.findAll)

  app.post('/categories', categoriesController.create)
}
