import { type UpdateTicketParams, type TicketsRepository } from '../repositories/tickets-repository'
import { Prisma, type Ticket, TicketStatus } from '@prisma/client'
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

  async findAll (page = 1, pageSize = 10) {
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
}
