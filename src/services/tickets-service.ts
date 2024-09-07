import { type UpdateTicketParams, type TicketsRepository } from '../repositories/tickets-repository'
import { type Ticket } from '@/repositories/tickets-repository'
import { TicketNotFoundError } from './errors/ticket-not-found-error'
import { TicketStatus } from '@prisma/client'
import { type CategoriesRepository } from '@/repositories/categories-repository'
import { CategoryNotFoundError } from './errors/category-not-found-error'

interface CreateTicketParams {
  title: string
  description: string
  userId: string
  categoryId: string
  filesURL?: string[]
}

interface CreateTicketResponse {
  ticket: Ticket
}

interface FindAllParams {
  page?: number
  pageSize?: number
  userRole: 'USER' | 'SUPPORT' | 'ADMIN'
  userId: string
}

export class TicketsService {
  private readonly ticketsRepository: TicketsRepository
  private readonly categoriesRepository: CategoriesRepository

  constructor (ticketsRepository: TicketsRepository, categoriesRepository: CategoriesRepository) {
    this.ticketsRepository = ticketsRepository
    this.categoriesRepository = categoriesRepository
  }

  async create (data: CreateTicketParams): Promise<CreateTicketResponse> {
    const { title, description, userId, categoryId, filesURL } = data

    const category = await this.categoriesRepository.findById(categoryId)

    if (!category) {
      throw new CategoryNotFoundError()
    }

    const ticket = await this.ticketsRepository.create({
      title,
      description,
      userId,
      ticketStatus: TicketStatus.OPEN,
      categoryId,
      filesURL
    })

    return { ticket }
  }

  async findAll ({ userId, userRole, page = 1, pageSize = 10 }: FindAllParams) {
    if (userRole === 'USER') {
      const tickets = await this.ticketsRepository.findAllByUserId(userId, page, pageSize)
      console.log('tickets', tickets)
      return { tickets, totalTickets: tickets?.length }
    }
    const tickets = await this.ticketsRepository.findAll(page, pageSize)
    const totalTickets = await this.ticketsRepository.count()
    console.log('tickets', tickets)
    return { tickets, totalTickets }
  }

  async update (data: UpdateTicketParams, id: string) {
    const ticket = await this.ticketsRepository.findOneById(id)

    if (!ticket) {
      throw new TicketNotFoundError()
    }

    await this.ticketsRepository.update(data, id)
  }

  async findOneById (id: string) {
    const ticket = await this.ticketsRepository.findOneById(id)
    return { ticket }
  }
}
