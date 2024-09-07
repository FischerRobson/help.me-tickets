import { type Database, open } from 'sqlite'
import sqlite3 from 'sqlite3'
import { type CategoriesRepository, type CreateCategoryParams, type Category } from '@/repositories/categories-repository' // Adjust path as needed

export class SQLiteCategoriesRepository implements CategoriesRepository {
  private readonly db: Database // Make db private

  constructor (db: Database) {
    this.db = db
  }

  static async createInstance (db?: Database<sqlite3.Database, sqlite3.Statement>): Promise<SQLiteCategoriesRepository> {
    if (!db) {
      db = await open({
        filename: ':memory:', // In-memory SQLite database for testing
        driver: sqlite3.Database
      })
    }

    await db.exec(`
      CREATE TABLE IF NOT EXISTS Category (
        id TEXT PRIMARY KEY,
        name TEXT UNIQUE NOT NULL
      );
    `)

    return new SQLiteCategoriesRepository(db)
  }

  async create (data: CreateCategoryParams): Promise<Category> {
    const { name } = data

    await this.db.run('INSERT INTO Category (id, name) VALUES (?, ?)', [
      crypto.randomUUID(),
      name
    ])

    const category = await this.findOneByName(name)
    if (!category) throw new Error('Category not created')

    return category
  }

  async findAll (): Promise<Category[]> {
    const rows = await this.db.all('SELECT * FROM Category')
    return rows
  }

  async findOneByName (name: string): Promise<Category | null> {
    const row = await this.db.get('SELECT * FROM Category WHERE name = ?', [name])

    if (!row) return null
    return row as Category
  }

  async findById (id: string): Promise<Category | null> {
    const row = await this.db.get('SELECT * FROM Category WHERE id = ?', [id])

    if (!row) return null
    return row as Category
  }

  async clearTable (): Promise<void> {
    await this.db.exec('DELETE FROM Category')
  }

  async disconnect (): Promise<void> {
    await this.db.close()
  }
}
