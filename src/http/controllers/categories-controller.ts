import { HttpStatusCode } from '@/constants/HttpStatusCode'
import { CategoryAlreadyExistsError } from '@/services/errors/category-already-exists-error'
import { makeCategoriesService } from '@/services/factories/make-categories-service'
import { type FastifyReply, type FastifyRequest } from 'fastify'
import { z } from 'zod'

class CategoriesController {
  async create (req: FastifyRequest, res: FastifyReply) {
    const bodySchema = z.object({
      name: z.string().min(5).max(25)
    })

    const { name } = bodySchema.parse(req.body)

    try {
      const service = makeCategoriesService()
      const resp = await service.create({ name })
      return await res.status(HttpStatusCode.Created).send(resp)
    } catch (err) {
      if (err instanceof CategoryAlreadyExistsError) {
        return await res.status(HttpStatusCode.BadRequest).send(err.message)
      }
      throw err
    }
  }
}

export const categoriesController = new CategoriesController()
