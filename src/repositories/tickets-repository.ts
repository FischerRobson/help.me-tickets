import { type TicketStatus, type Ticket } from '@prisma/client'

export interface CreateTicketParams {
  title: string
  description: string
  userId: string
  categoryId: string
  ticketStatus: TicketStatus
}

export type FindAllTicketsResponse = Array<{
  id: string
  title: string
  description: string
  created_at: Date
  updated_at: Date | null
  ticket_status: TicketStatus
  user_id: string
  support_id: string | null
  category: {
    name: string
  }
}>

export interface TicketsRepository {
  create: (data: CreateTicketParams) => Promise<Ticket>
  findAllByUserId: (id: string) => Promise<Ticket[] | null>
  findAllBySupportId: (id: string) => Promise<Ticket[] | null>
  findAll: (page: number, pageSize: number) => Promise<FindAllTicketsResponse | null>
  findOneById: (id: string) => Promise<Ticket | null>
}
