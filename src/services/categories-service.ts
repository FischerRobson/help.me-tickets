import { type CategoriesRepository } from '@/repositories/categories-repository'
import { type Category } from '@prisma/client'
import { CategoryAlreadyExistsError } from './errors/category-already-exists-error'

interface CreateCategoryProps {
  name: string
}

interface CreateCategoryResponse {
  category: Category
}

interface FindAllCategories {
  categories: Category[] | null
}

export class CategoriesService {
  private readonly categoriesRepository: CategoriesRepository

  constructor (categoriesRepository: CategoriesRepository) {
    this.categoriesRepository = categoriesRepository
  }

  async create (data: CreateCategoryProps): Promise<CreateCategoryResponse> {
    const { name } = data

    const categoryAlreadyExists = await this.categoriesRepository.findOneByName(name)

    if (categoryAlreadyExists) {
      throw new CategoryAlreadyExistsError()
    }

    const category = await this.categoriesRepository.create({ name })
    return { category }
  }

  async findAll (): Promise<FindAllCategories> {
    const categories = await this.categoriesRepository.findAll()
    return { categories }
  }
}
