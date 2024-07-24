import { type TicketStatus, type Ticket } from '@prisma/client'

export interface CreateTicketParams {
  title: string
  description: string
  userId: string
  categoryId: string
  ticketStatus: TicketStatus
}

export interface TicketsRepository {
  create: (data: CreateTicketParams) => Promise<Ticket>
  findAllByUserId: (id: string) => Promise<Ticket[] | null>
  findAllBySupportId: (id: string) => Promise<Ticket[] | null>
  findOneById: (id: string) => Promise<Ticket | null>
}
