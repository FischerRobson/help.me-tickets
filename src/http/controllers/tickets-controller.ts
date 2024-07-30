import { type FastifyReply, type FastifyRequest } from 'fastify'
import { z } from 'zod'
import { makeTicketsService } from '@/services/factories/make-tickets-service'
import { HttpStatusCode } from '@/constants/HttpStatusCode'
import { TicketNotFound } from '@/services/errors/ticket-not-found'

class TicketsController {
  async create (req: FastifyRequest, res: FastifyReply): Promise<never> {
    const bodySchema = z.object({
      title: z.string(),
      description: z.string(),
      // userId: z.string(),
      categoryId: z.string()
    })

    const { title, description, categoryId } = bodySchema.parse(req.body)

    const userId = req.user.sub

    try {
      const service = makeTicketsService()
      const { ticket } = await service.create({ title, description, userId, categoryId })

      return await res.status(HttpStatusCode.Created).send({ ticket })
    } catch (err) {
      console.error(err)
      throw err
    }
  }

  async findAll (req: FastifyRequest, res: FastifyReply) {
    const querySchema = z.object({
      page: z.coerce.number().optional(),
      pageSize: z.coerce.number().optional()
    })

    const { page, pageSize } = querySchema.parse(req.query)

    try {
      const service = makeTicketsService()
      const { tickets, totalTickets } = await service.findAll(page, pageSize)

      return await res.status(HttpStatusCode.OK).send({ tickets, totalTickets })
    } catch (err) {
      console.error(err)
      throw err
    }
  }

  async update (req: FastifyRequest, res: FastifyReply) {
    const paramsSchema = z.object({
      id: z.string().uuid()
    })

    const bodySchema = z.object({
      ticketStatus: z.enum(['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED']).optional(),
      supportId: z.string().uuid().optional(),
      categoryId: z.string().uuid().optional()
    })

    const { id } = paramsSchema.parse(req.params)
    const { ticketStatus, categoryId, supportId } = bodySchema.parse(req.body)

    try {
      const service = makeTicketsService()
      await service.update({ ticketStatus, categoryId, supportId }, id)
      return await res.status(HttpStatusCode.OK).send()
    } catch (err) {
      if (err instanceof TicketNotFound) {
        return await res.status(HttpStatusCode.NotFound).send(err.message)
      }
      throw err
    }
  }
}

export const ticketsController = new TicketsController()
