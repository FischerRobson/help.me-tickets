import { type Database, open } from 'sqlite'
import sqlite3 from 'sqlite3'
import {
  type Ticket,
  type TicketStatus,
  type CreateTicketParams,
  type FindAllTicketsResponse,
  type UpdateTicketParams,
  type TicketsRepository
} from '@/repositories/tickets-repository'

export class SQLiteTicketsRepository implements TicketsRepository {
  private readonly db: Database

  constructor (db: Database) {
    this.db = db
  }

  static async createInstance (db?: Database<sqlite3.Database, sqlite3.Statement>): Promise<SQLiteTicketsRepository> {
    if (!db) {
      db = await open({
        filename: ':memory:', // In-memory SQLite database for testing
        driver: sqlite3.Database
      })
    }

    await db.exec(`
      CREATE TABLE IF NOT EXISTS tickets (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        created_at TEXT NOT NULL,
        updated_at TEXT,
        ticket_status TEXT NOT NULL,
        user_id TEXT NOT NULL,
        support_id TEXT,
        categoryId TEXT NOT NULL,
        filesURL TEXT
      );
    `)

    await db.exec(`
      CREATE TABLE IF NOT EXISTS categories (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL
      );
    `)

    return new SQLiteTicketsRepository(db)
  }

  async create (data: CreateTicketParams): Promise<Ticket> {
    const id = crypto.randomUUID()
    const createdAt = new Date()
    const updatedAt = null

    await this.db.run(
      `INSERT INTO tickets 
        (id, title, description, created_at, updated_at, ticket_status, user_id, support_id, categoryId, filesURL) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        data.title,
        data.description,
        createdAt.toISOString(),
        updatedAt,
        data.ticketStatus,
        data.userId,
        null,
        data.categoryId,
        JSON.stringify(data.filesURL ?? [])
      ]
    )

    return {
      id,
      title: data.title,
      description: data.description,
      created_at: createdAt,
      updated_at: updatedAt,
      ticket_status: data.ticketStatus,
      user_id: data.userId,
      support_id: null,
      categoryId: data.categoryId,
      filesURL: data.filesURL ?? []
    }
  }

  async findAllByUserId (id: string, page: number, pageSize: number): Promise<FindAllTicketsResponse | null> {
    const offset = (page - 1) * pageSize

    const tickets = await this.db.all(
      `SELECT tickets.*, categories.name as category_name 
       FROM tickets
       LEFT JOIN categories ON tickets.categoryId = categories.id
       WHERE tickets.user_id = ? LIMIT ? OFFSET ?`,
      [id, pageSize, offset]
    )

    if (!tickets) return null

    return tickets.map((ticket: any) => ({
      id: ticket.id,
      title: ticket.title,
      created_at: new Date(ticket.created_at),
      updated_at: ticket.updated_at ? new Date(ticket.updated_at) : null,
      ticket_status: ticket.ticket_status as TicketStatus,
      user_id: ticket.user_id,
      support_id: ticket.support_id,
      category: {
        name: ticket.category_name
      }
    }))
  }

  async findAllBySupportId (id: string): Promise<Ticket[] | null> {
    const tickets = await this.db.all(
      'SELECT * FROM tickets WHERE support_id = ?',
      [id]
    )

    if (!tickets) return null

    return tickets.map((ticket: any) => ({
      id: ticket.id,
      title: ticket.title,
      description: ticket.description,
      created_at: new Date(ticket.created_at),
      updated_at: ticket.updated_at ? new Date(ticket.updated_at) : null,
      ticket_status: ticket.ticket_status as TicketStatus,
      user_id: ticket.user_id,
      support_id: ticket.support_id,
      categoryId: ticket.categoryId,
      filesURL: JSON.parse(ticket.filesURL)
    }))
  }

  async findAll (page: number, pageSize: number): Promise<FindAllTicketsResponse | null> {
    const offset = (page - 1) * pageSize

    // Log all tickets and categories in the DB for debugging
    const rawTickets = await this.db.all('SELECT * FROM tickets')
    const rawCategories = await this.db.all('SELECT * FROM categories')

    console.log('Tickets in DB:', rawTickets)
    console.log('Categories in DB:', rawCategories)

    const tickets = await this.db.all(
      `SELECT tickets.*, categories.name as category_name 
       FROM tickets
       LEFT JOIN categories ON tickets.categoryId = categories.id
       LIMIT ? OFFSET ?`,
      [pageSize, offset]
    )

    console.log('Tickets after LEFT JOIN:', tickets)

    // If no tickets are found, return null
    if (!tickets || tickets.length === 0) {
      return null
    }

    return tickets.map((ticket: any) => ({
      id: ticket.id,
      title: ticket.title,
      created_at: new Date(ticket.created_at),
      updated_at: ticket.updated_at ? new Date(ticket.updated_at) : null,
      ticket_status: ticket.ticket_status as TicketStatus,
      user_id: ticket.user_id,
      support_id: ticket.support_id,
      category: {
        name: ticket.category_name
      }
    }))
  }

  async findAllNotFinished (page: number, pageSize: number): Promise<FindAllTicketsResponse | null> {
    const offset = (page - 1) * pageSize

    const tickets = await this.db.all(
      `SELECT tickets.*, categories.name as category_name 
       FROM tickets
       JOIN categories ON tickets.categoryId = categories.id
       WHERE ticket_status != 'RESOLVED' AND ticket_status != 'CLOSED'
       LIMIT ? OFFSET ?`,
      [pageSize, offset]
    )

    if (!tickets) return null

    return tickets.map((ticket: any) => ({
      id: ticket.id,
      title: ticket.title,
      created_at: new Date(ticket.created_at),
      updated_at: ticket.updated_at ? new Date(ticket.updated_at) : null,
      ticket_status: ticket.ticket_status as TicketStatus,
      user_id: ticket.user_id,
      support_id: ticket.support_id,
      category: {
        name: ticket.category_name
      }
    }))
  }

  async findOneById (id: string): Promise<Ticket | null> {
    const ticket = await this.db.get(
      'SELECT * FROM tickets WHERE id = ?',
      [id]
    )

    return ticket
      ? {
          id: ticket.id,
          title: ticket.title,
          description: ticket.description,
          created_at: new Date(ticket.created_at),
          updated_at: ticket.updated_at ? new Date(ticket.updated_at) : null,
          ticket_status: ticket.ticket_status as TicketStatus,
          user_id: ticket.user_id,
          support_id: ticket.support_id,
          categoryId: ticket.categoryId,
          filesURL: JSON.parse(ticket.filesURL)
        }
      : null
  }

  async update (data: UpdateTicketParams, id: string): Promise<void> {
    const updatedAt = new Date()

    await this.db.run(
      `UPDATE tickets SET
        ticket_status = COALESCE(?, ticket_status),
        support_id = COALESCE(?, support_id),
        categoryId = COALESCE(?, categoryId),
        updated_at = ?
      WHERE id = ?`,
      [
        data.ticketStatus ?? null,
        data.supportId ?? null,
        data.categoryId ?? null,
        updatedAt.toISOString(),
        id
      ]
    )
  }

  async count (): Promise<number> {
    const result = await this.db.get('SELECT COUNT(*) as count FROM tickets')
    return result ? result.count : 0
  }

  async clearTable (): Promise<void> {
    await this.db.exec('DELETE FROM tickets')
  }

  async disconnect (): Promise<void> {
    await this.db.close()
  }
}
