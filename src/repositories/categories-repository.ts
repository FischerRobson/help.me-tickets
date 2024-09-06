export interface Category {
  id: string
  name: string
}

export interface CreateCategoryParams {
  name: string
}

export interface CategoriesRepository {
  create: (data: CreateCategoryParams) => Promise<Category>
  findAll: () => Promise<Category[] | null>
  findOneByName: (name: string) => Promise<Category | null>
}
