import { type ChatsRepository } from '@/repositories/chats-repository'
import { type TicketsService } from './tickets-service'
import { TicketNotFoundError } from './errors/ticket-not-found-error'
import { TicketStatus } from '@prisma/client'
import { TicketClosedError } from './errors/ticket-closed-error'

interface CreateChatParams {
  authorId: string
  description: string
  ticketId: string
  filesURL?: string[]
}

export class ChatsService {
  private readonly chatsRepository: ChatsRepository
  private readonly ticketsService: TicketsService

  constructor (chatsRepository: ChatsRepository, ticketsService: TicketsService) {
    this.chatsRepository = chatsRepository
    this.ticketsService = ticketsService
  }

  async create (data: CreateChatParams) {
    const { ticket } = await this.ticketsService.findOneById(data.ticketId)

    if (!ticket) {
      throw new TicketNotFoundError()
    }

    if (ticket.ticket_status === TicketStatus.CLOSED) {
      throw new TicketClosedError()
    }

    const chat = await this.chatsRepository.create(data)

    return { chat }
  }
}
