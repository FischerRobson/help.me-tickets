import { describe, it, expect, beforeEach, afterEach, afterAll } from 'vitest'
import { TicketsService } from '@/services/tickets-service' // Adjust path as needed
import { SQLiteTicketsRepository } from '@/repositories/sqlite/sqlite-tickets-repository'
import { TicketNotFoundError } from '@/services/errors/ticket-not-found-error'
import { TicketStatus } from '@prisma/client'
import { type Category, type CategoriesRepository } from '@/repositories/categories-repository'
import { SQLiteCategoriesRepository } from '@/repositories/sqlite/sqlite-categories-repository'

import { open } from 'sqlite'
import sqlite3 from 'sqlite3'

describe('TicketsService (using SQLite repository)', () => {
  let ticketsRepository: SQLiteTicketsRepository
  let ticketsService: TicketsService
  let categoriesRepository: SQLiteCategoriesRepository
  let category: Category

  beforeEach(async () => {
    const db = await open({
      filename: './test.db', // Use a file-based SQLite database
      driver: sqlite3.Database
    })

    ticketsRepository = await SQLiteTicketsRepository.createInstance(db)
    categoriesRepository = await SQLiteCategoriesRepository.createInstance(db)
    ticketsService = new TicketsService(ticketsRepository, categoriesRepository)

    category = await categoriesRepository.create({ name: 'mockedCategory' })
  })

  afterEach(async () => {
    await ticketsRepository.clearTable()
    await categoriesRepository.clearTable()
  })

  afterAll(async () => {
    await ticketsRepository.disconnect()
  })

  describe('create', () => {
    it('should create a ticket and return the response', async () => {
      const createParams = {
        title: 'Test Ticket',
        description: 'A test ticket',
        userId: 'user-123',
        categoryId: category.id,
        filesURL: []
      }

      const result = await ticketsService.create(createParams)

      expect(result.ticket).toMatchObject({
        title: createParams.title,
        description: createParams.description,
        user_id: createParams.userId,
        categoryId: createParams.categoryId,
        ticket_status: TicketStatus.OPEN
      })
    })
  })

  describe('findAll', () => {
    it('should return all tickets for a USER', async () => {
      const createParams = {
        title: 'Test Ticket',
        description: 'A test ticket',
        userId: 'user-123',
        categoryId: category.id,
        filesURL: []
      }

      await ticketsService.create(createParams)

      const result = await ticketsService.findAll({
        userId: 'user-123',
        userRole: 'USER'
      })

      console.log(result)

      expect(result.tickets?.length).toBe(1)
      expect(result.tickets?.[0]).toMatchObject({
        title: 'Test Ticket',
        user_id: 'user-123',
        ticket_status: TicketStatus.OPEN
      })
    })

    it('should return all tickets for an ADMIN', async () => {
      console.log('category', category)
      const createParams1 = {
        title: 'Ticket 1',
        description: 'First ticket',
        userId: 'user-123',
        categoryId: category.id,
        filesURL: []
      }
      const createParams2 = {
        title: 'Ticket 2',
        description: 'Second ticket',
        userId: 'user-124',
        categoryId: category.id,
        filesURL: []
      }

      await ticketsService.create(createParams1)
      await ticketsService.create(createParams2)

      const result = await ticketsService.findAll({
        userId: 'admin-123',
        userRole: 'ADMIN',
        page: 1,
        pageSize: 10
      })

      expect(result.tickets?.length).toBe(2)
    })
  })

  describe('update', () => {
    it('should update a ticket if it exists', async () => {
      const createParams = {
        title: 'Test Ticket',
        description: 'A test ticket',
        userId: 'user-123',
        categoryId: category.id,
        filesURL: []
      }

      // Create a ticket
      const { ticket } = await ticketsService.create(createParams)

      const updateParams = {
        ticketStatus: TicketStatus.RESOLVED
      }

      await ticketsService.update(updateParams, ticket.id)

      const updatedTicket = await ticketsRepository.findOneById(ticket.id)

      expect(updatedTicket?.ticket_status).toBe(TicketStatus.RESOLVED)
    })

    it('should throw an error if the ticket does not exist', async () => {
      await expect(
        ticketsService.update({ ticketStatus: TicketStatus.RESOLVED }, 'non-existent-id')
      ).rejects.toThrow(TicketNotFoundError)
    })
  })

  describe('findOneById', () => {
    it('should return the ticket by id', async () => {
      const createParams = {
        title: 'Test Ticket',
        description: 'A test ticket',
        userId: 'user-123',
        categoryId: category.id,
        filesURL: []
      }

      const { ticket } = await ticketsService.create(createParams)

      const result = await ticketsService.findOneById(ticket.id)

      expect(result.ticket).toMatchObject({
        title: 'Test Ticket',
        user_id: 'user-123',
        ticket_status: TicketStatus.OPEN
      })
    })

    it('should return null if the ticket is not found', async () => {
      const result = await ticketsService.findOneById('non-existent-id')

      expect(result.ticket).toBeNull()
    })
  })
})
