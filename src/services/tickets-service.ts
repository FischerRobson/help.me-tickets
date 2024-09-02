import { type UpdateTicketParams, type TicketsRepository } from '../repositories/tickets-repository'
import { type Ticket, TicketStatus } from '@prisma/client'
import { TicketNotFound } from './errors/ticket-not-found'

interface CreateTicketParams {
  title: string
  description: string
  userId: string
  categoryId: string
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

  constructor (ticketsRepository: TicketsRepository) {
    this.ticketsRepository = ticketsRepository
  }

  async create (data: CreateTicketParams): Promise<CreateTicketResponse> {
    const { title, description, userId, categoryId } = data

    const ticket = await this.ticketsRepository.create({
      title,
      description,
      userId,
      ticketStatus: TicketStatus.OPEN,
      categoryId
    })

    return { ticket }
  }

  async findAll ({ userId, userRole, page = 1, pageSize = 10 }: FindAllParams) {
    if (userRole === 'USER') {
      const tickets = await this.ticketsRepository.findAllByUserId(userId, page, pageSize)
      return { tickets, totalTickets: tickets?.length }
    }
    const tickets = await this.ticketsRepository.findAll(page, pageSize)
    const totalTickets = await this.ticketsRepository.count()
    return { tickets, totalTickets }
  }

  async update (data: UpdateTicketParams, id: string) {
    const ticket = await this.ticketsRepository.findOneById(id)

    if (!ticket) {
      throw new TicketNotFound()
    }

    await this.ticketsRepository.update(data, id)
  }

  async findOneById (id: string) {
    const ticket = await this.ticketsRepository.findOneById(id)
    return { ticket }
  }
}
