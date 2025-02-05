export interface Ticket {
  id: string
  title: string
  description: string
  created_at: Date
  updated_at: Date | null
  ticket_status: TicketStatus
  user_id: string
  support_id: string | null
  categoryId: string
  filesURL: string[]
}

export interface FindTicketById {
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
  filesURL: string[]
}

export type TicketStatus = 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED'

export const TICKET_STATUS = {
  OPEN: 'OPEN' as TicketStatus,
  IN_PROGRESS: 'IN_PROGRESS' as TicketStatus,
  RESOLVED: 'RESOLVED' as TicketStatus,
  CLOSED: 'CLOSED' as TicketStatus
}

export interface CreateTicketParams {
  title: string
  description: string
  userId: string
  categoryId: string
  ticketStatus: TicketStatus
  filesURL?: string[]
  uploadId?: string
}

export interface FindAllTicketsResponse {
  tickets: Array<{
    id: string
    title: string
    created_at: Date
    updated_at: Date | null
    ticket_status: TicketStatus
    user_id: string
    support_id: string | null
    category: {
      name: string
    }
  }>
  totalItems: number
  totalPages: number
  currentPage: number
}

export interface UpdateTicketParams {
  ticketStatus?: TicketStatus
  supportId?: string
  categoryId?: string
}

type TicketsPerCategory = Array<{
  category: string
  count: number
}>

type TicketsPerDayForLast7Days = Array<{
  date: string
  count: number
}>

export interface TicketsRepository {
  create: (data: CreateTicketParams) => Promise<Ticket>
  findAllByUserId: (id: string, page: number, pageSize: number, status: TicketStatus[]) => Promise<FindAllTicketsResponse | null>
  findAllBySupportId: (id: string) => Promise<Ticket[] | null>
  findAll: (page: number, pageSize: number, status: TicketStatus[]) => Promise<FindAllTicketsResponse | null>
  findAllNotFinished: (page: number, pageSize: number) => Promise<FindAllTicketsResponse | null>
  findOneById: (id: string) => Promise<FindTicketById | null>
  update: (data: UpdateTicketParams, id: string) => Promise<void>
  updateFiles: (filesURL: string[], id: string) => Promise<void>
  findOneByUploadId: (uploadId: string) => Promise<Ticket | null>
  count: () => Promise<number>
  ticketsOpenedToday: () => Promise<number>
  categorizedTickets: () => Promise<TicketsPerCategory>
  ticketsPerDayForLast7Days: () => Promise<TicketsPerDayForLast7Days>
}
