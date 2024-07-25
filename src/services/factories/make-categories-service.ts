import { CategoriesService } from '../categories-service'
import { PrismaCategoryRepository } from '@/repositories/prisma/prisma-categories-repository'

export function makeCategoriesService (): CategoriesService {
  const categoriesService = new CategoriesService(new PrismaCategoryRepository())
  return categoriesService
}
