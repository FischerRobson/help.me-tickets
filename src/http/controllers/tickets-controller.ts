import { type FastifyReply, type FastifyRequest } from 'fastify'
import { z } from 'zod'
import { makeTicketsService } from '@/services/factories/make-tickets-service'
import { HttpStatusCode } from '@/constants/HttpStatusCode'
import { TicketNotFoundError } from '@/services/errors/ticket-not-found-error'
import { makeChatsService } from '@/services/factories/make-chats-service'

class TicketsController {
  async create (req: FastifyRequest, res: FastifyReply): Promise<never> {
    const bodySchema = z.object({
      title: z.string(),
      description: z.string(),
      categoryId: z.string(),
      filesURL: z.string().array().optional()
    })

    const { title, description, categoryId, filesURL } = bodySchema.parse(req.body)

    const userId = req.user.sub

    try {
      const service = makeTicketsService()
      const { ticket } = await service.create({ title, description, userId, categoryId, filesURL })

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

    const userId = req.user.sub
    const userRole = req.user.role

    try {
      const service = makeTicketsService()
      const { tickets, totalTickets } = await service.findAll({ userId, userRole, page, pageSize })

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
      if (err instanceof TicketNotFoundError) {
        return await res.status(HttpStatusCode.NotFound).send(err.message)
      }
      throw err
    }
  }

  async findOneById (req: FastifyRequest, res: FastifyReply) {
    const paramsSchema = z.object({
      id: z.string().uuid()
    })

    const { id } = paramsSchema.parse(req.params)

    try {
      const service = makeTicketsService()
      const { ticket } = await service.findOneById(id)
      return await res.status(HttpStatusCode.OK).send({ ticket })
    } catch (err) {
      return await res.status(HttpStatusCode.NotFound).send(err)
    }
  }

  // CHATS MANAGEMENT

  async createChat (req: FastifyRequest, res: FastifyReply) {
    const paramsSchema = z.object({
      id: z.string().uuid()
    })

    const bodySchema = z.object({
      description: z.string()
    })

    const userId = req.user.sub

    const { description } = bodySchema.parse(req.body)
    const { id } = paramsSchema.parse(req.params)

    try {
      const service = makeChatsService()
      const { chat } = await service.create({ authorId: userId, description, ticketId: id })
      return await res.status(HttpStatusCode.Created).send(chat)
    } catch (err) {
      await res.status(HttpStatusCode.Conflict).send(err)
    }
  }
}

export const ticketsController = new TicketsController()
