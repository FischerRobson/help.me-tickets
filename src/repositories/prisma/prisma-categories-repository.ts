import { type CreateCategoryParams, type CategoriesRepository } from '../categories-repository'
import { prisma } from '@/lib/prisma'

export class PrismaCategoryRepository implements CategoriesRepository {
  async create (data: CreateCategoryParams) {
    return await prisma.category.create({ data })
  }

  async findAll () {
    return await prisma.category.findMany()
  }

  async findOneByName (name: string) {
    return await prisma.category.findFirst({ where: { name } })
  }
}
