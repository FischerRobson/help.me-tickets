import { type Category, type Prisma } from '@prisma/client'

export interface CategoriesRepository {
  create: (data: Prisma.CategoryCreateInput) => Promise<Category>
  findAll: () => Promise<Category[] | null>
  findOneByName: (name: string) => Promise<Category | null>
}
