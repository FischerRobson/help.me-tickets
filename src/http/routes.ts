/* eslint-disable @typescript-eslint/unbound-method */
import { type FastifyInstance } from 'fastify'
import { ticketsController } from './controllers/tickets-controller'
import { categoriesController } from './controllers/categories-controller'

export async function routes (app: FastifyInstance) {
  app.post('/tickets', { preValidation: [app.authenticate] }, ticketsController.create)
  app.get('/tickets', { preValidation: [app.authenticate] }, ticketsController.findAll)

  app.post('/categories', { preValidation: [app.authenticate] }, categoriesController.create)
}
