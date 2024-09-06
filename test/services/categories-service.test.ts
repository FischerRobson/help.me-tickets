import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest'
import { CategoriesService } from '@/services/categories-service' // Adjust path as needed
import { SQLiteCategoriesRepository } from '@/repositories/sqlite/sqlite-categories-repository' // Adjust path as needed
import { CategoryAlreadyExistsError } from '@/services/errors/category-already-exists-error' // Adjust path as needed

let service: CategoriesService
let repository: SQLiteCategoriesRepository

beforeAll(async () => {
  repository = await SQLiteCategoriesRepository.createInstance()
  service = new CategoriesService(repository)
})

beforeEach(async () => {
  await repository.clearTable()
})

afterAll(async () => {
  await repository.disconnect()
})

describe('CategoriesService (with SQLite)', () => {
  it('should create a new category', async () => {
    const result = await service.create({ name: 'Electronics' })

    expect(result.category).toHaveProperty('id')
    expect(result.category.name).toBe('Electronics')
  })

  it('should throw an error if category already exists', async () => {
    await service.create({ name: 'Electronics' })
    await expect(service.create({ name: 'Electronics' })).rejects.toBeInstanceOf(CategoryAlreadyExistsError)
  })

  it('should not throw an error if different category names are created', async () => {
    const firstCategory = await service.create({ name: 'Electronics' })
    const secondCategory = await service.create({ name: 'Furniture' })

    expect(firstCategory.category.name).toBe('Electronics')
    expect(secondCategory.category.name).toBe('Furniture')
  })
})
