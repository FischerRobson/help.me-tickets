import { type TicketsRepository } from '../repositories/tickets-repository'
import { type Ticket, TicketStatus } from '@prisma/client'

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
}
