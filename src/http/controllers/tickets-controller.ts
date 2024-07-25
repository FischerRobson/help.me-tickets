import { type FastifyReply, type FastifyRequest } from 'fastify'
import { z } from 'zod'
import { makeTicketsService } from '@/services/factories/make-tickets-service'
import { HttpStatusCode } from '@/constants/HttpStatusCode'

class TicketsController {
  async create (req: FastifyRequest, res: FastifyReply): Promise<never> {
    const bodySchema = z.object({
      title: z.string(),
      description: z.string(),
      userId: z.string(),
      categoryId: z.string()
    })

    const { title, description, userId, categoryId } = bodySchema.parse(req.body)

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
      const { tickets } = await service.findAll(page, pageSize)

      return await res.status(HttpStatusCode.OK).send({ tickets })
    } catch (err) {
      console.error(err)
      throw err
    }
  }
}

export const ticketsController = new TicketsController()
