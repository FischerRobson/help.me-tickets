import { type UpdateTicketParams, type CreateTicketParams, type TicketsRepository, type Ticket, TICKET_STATUS, type TicketStatus, type FindTicketById } from '../tickets-repository'
import { prisma } from '../../lib/prisma'
import dayjs from 'dayjs'

export class PrismaTicketsRepository implements TicketsRepository {
  async create (dataInput: CreateTicketParams): Promise<Ticket> {
    return await prisma.ticket.create({
      data: {
        title: dataInput.title,
        description: dataInput.description,
        categoryId: dataInput.categoryId,
        user_id: dataInput.userId,
        ticket_status: dataInput.ticketStatus,
        filesURL: dataInput.filesURL,
        uploadId: dataInput.uploadId
      }
    })
  }

  async findOneById (id: string): Promise<FindTicketById | null> {
    return await prisma.ticket.findUnique({
      where: { id },
      select: {
        id: true,
        title: true,
        description: true,
        created_at: true,
        updated_at: true,
        ticket_status: true,
        user_id: true,
        support_id: true,
        filesURL: true,
        category: {
          select: {
            name: true
          }
        },
        chats: {
          select: {
            id: true,
            description: true,
            created_at: true,
            author_id: true,
            filesURL: true
          }
        }
      }
    })
  }

  async findAllByUserId (id: string, page: number, pageSize: number, status: TicketStatus[]) {
    const skip = (page - 1) * pageSize

    const totalItems = await prisma.ticket.count({
      where: {
        user_id: id,
        ticket_status: { in: status }
      }
    })

    const totalPages = Math.ceil(totalItems / pageSize)

    const tickets = await prisma.ticket.findMany({
      skip,
      take: pageSize,
      select: {
        id: true,
        title: true,
        created_at: true,
        updated_at: true,
        ticket_status: true,
        user_id: true,
        support_id: true,
        category: {
          select: {
            name: true
          }
        }
      },
      where: {
        user_id: id,
        ticket_status: {
          in: status
        }
      }
    })

    return {
      tickets,
      currentPage: page,
      totalItems,
      totalPages
    }
  }

  async findAllBySupportId (id: string): Promise<Ticket[] | null> {
    return await prisma.ticket.findMany({ where: { support_id: id } })
  }

  async findAll (page: number, pageSize: number, status: TicketStatus[]) {
    const skip = (page - 1) * pageSize

    const totalItems = await prisma.ticket.count({
      where: {
        ticket_status: { in: status }
      }
    })

    const totalPages = Math.ceil(totalItems / pageSize)

    const tickets = await prisma.ticket.findMany({
      skip,
      take: pageSize,
      select: {
        id: true,
        title: true,
        created_at: true,
        updated_at: true,
        ticket_status: true,
        user_id: true,
        support_id: true,
        category: {
          select: {
            name: true
          }
        }
      },
      where: {
        ticket_status: {
          in: status
        }
      }
    })

    return {
      tickets,
      currentPage: page,
      totalItems,
      totalPages
    }
  }

  async findAllNotFinished (page: number, pageSize: number) {
    const skip = (page - 1) * pageSize

    const totalItems = await prisma.ticket.count({
      where: {
        ticket_status: { equals: 'CLOSED' }
      }
    })

    const totalPages = Math.ceil(totalItems / pageSize)

    const tickets = await prisma.ticket.findMany({
      skip,
      take: pageSize,
      select: {
        id: true,
        title: true,
        created_at: true,
        updated_at: true,
        ticket_status: true,
        user_id: true,
        support_id: true,
        category: {
          select: {
            name: true
          }
        }
      },
      where: {
        NOT: {
          ticket_status: TICKET_STATUS.CLOSED
        }
      }
    })

    return {
      tickets,
      currentPage: page,
      totalItems,
      totalPages
    }
  }

  async update (data: UpdateTicketParams, id: string) {
    await prisma.ticket.update({
      data: {
        ticket_status: data.ticketStatus,
        categoryId: data.categoryId,
        support_id: data.supportId,
        updated_at: new Date()
      },
      where: { id }
    })
  }

  async count () {
    return await prisma.ticket.count()
  }

  async findOneByUploadId (uploadId: string) {
    const ticket = await prisma.ticket.findFirst({
      where: {
        uploadId
      }
    })

    return ticket
  }

  async updateFiles (filesURL: string[], id: string) {
    const ticket = await prisma.ticket.findFirst({
      where: { id },
      select: { filesURL: true, id: true }
    })

    // never should be thrown
    if (!ticket) {
      throw new Error('Prisma error: ticket not found')
    }

    const updatedFilesURL = [...ticket.filesURL, ...filesURL]

    await prisma.ticket.update({
      where: { id },
      data: {
        filesURL: updatedFilesURL
      }
    })
  }

  async ticketsOpenedToday () {
    const today = dayjs()

    const ticketsOpenedToday = await prisma.ticket.count({
      where: {
        created_at: {
          gte: today.startOf('day').toString(),
          lte: today.endOf('day').toString()
        }
      }
    })

    return ticketsOpenedToday
  }

  async categorizedTickets () {
    const ticketsByCategory = await prisma.ticket.groupBy({
      by: ['categoryId'],
      _count: { id: true }
    })

    const categoryNames = await prisma.category.findMany({
      select: { id: true, name: true }
    })

    const categorizedTickets = ticketsByCategory.map((group) => ({
      category: categoryNames.find((c) => c.id === group.categoryId)?.name ?? 'Unknown',
      count: group._count.id
    }))

    return categorizedTickets
  }

  async ticketsPerDayForLast7Days () {
    const today = dayjs()

    const ticketCounts = await Promise.all(
      Array.from({ length: 7 }, async (_, i) => {
        const date = today.subtract(i, 'day')

        const count = await prisma.ticket.count({
          where: {
            created_at: {
              gte: date.startOf('day').toDate(),
              lte: date.endOf('day').toDate()
            }
          }
        })

        return { date: date.format('YYYY-MM-DD'), count }
      })
    )

    return ticketCounts
  }
}
