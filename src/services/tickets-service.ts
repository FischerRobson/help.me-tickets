import { type UpdateTicketParams, type TicketsRepository } from '../repositories/tickets-repository'
import { type Ticket } from '@/repositories/tickets-repository'
import { TicketNotFoundError } from './errors/ticket-not-found-error'
import { TicketStatus } from '@prisma/client'
import { type CategoriesRepository } from '@/repositories/categories-repository'
import { CategoryNotFoundError } from './errors/category-not-found-error'
import { type MessageQueueService } from './interfaces/message-queue-service'

interface CreateTicketParams {
  title: string
  description: string
  userId: string
  categoryId: string
  filesURL?: string[]
  uploadId?: string
}

interface CreateTicketResponse {
  ticket: Ticket
}

interface FindAllParams {
  page?: number
  pageSize?: number
  userRole: 'USER' | 'SUPPORT' | 'ADMIN'
  userId: string
  status?: TicketStatus[]
}

const allPossibleStates: TicketStatus[] = [TicketStatus.CLOSED, TicketStatus.IN_PROGRESS, TicketStatus.OPEN, TicketStatus.RESOLVED]

export class TicketsService {
  private readonly ticketsRepository: TicketsRepository
  private readonly categoriesRepository: CategoriesRepository
  private readonly messageQueueService: MessageQueueService

  constructor (
    ticketsRepository: TicketsRepository,
    categoriesRepository: CategoriesRepository,
    messageQueueService: MessageQueueService
  ) {
    this.ticketsRepository = ticketsRepository
    this.categoriesRepository = categoriesRepository
    this.messageQueueService = messageQueueService
  }

  async create (data: CreateTicketParams): Promise<CreateTicketResponse> {
    const { title, description, userId, categoryId, filesURL, uploadId } = data

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
      filesURL,
      uploadId
    })

    return { ticket }
  }

  async findAll ({ userId, userRole, page = 1, pageSize = 10, status = allPossibleStates }: FindAllParams) {
    if (userRole === 'USER') {
      const tickets = await this.ticketsRepository.findAllByUserId(userId, page, pageSize, status)
      console.log('tickets', tickets)
      return { tickets, totalTickets: tickets?.length }
    }

    const tickets = await this.ticketsRepository.findAll(page, pageSize, status)
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

    // void this.messageQueueService.produce()
  }

  async findOneById (id: string) {
    const ticket = await this.ticketsRepository.findOneById(id)
    return { ticket }
  }

  async addFilesUpload (filesURL: string[], uploadId: string) {
    const ticket = await this.ticketsRepository.findOneByUploadId(uploadId)

    if (!ticket) {
      throw new TicketNotFoundError()
    }

    await this.ticketsRepository.updateFiles(filesURL, ticket.id)
  }
}
