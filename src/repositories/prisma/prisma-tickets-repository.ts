import { type UpdateTicketParams, type CreateTicketParams, type TicketsRepository, type Ticket, TICKET_STATUS, type TicketStatus } from '../tickets-repository'
import { prisma } from '../../lib/prisma'

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

  async findOneById (id: string): Promise<Ticket | null> {
    return await prisma.ticket.findUnique({
      where: { id },
      include: {
        chats: {
          select: {
            description: true,
            id: true,
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
    return await prisma.ticket.findMany({
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
  }

  async findAllBySupportId (id: string): Promise<Ticket[] | null> {
    return await prisma.ticket.findMany({ where: { support_id: id } })
  }

  async findAll (page: number, pageSize: number, status: TicketStatus[]) {
    const skip = (page - 1) * pageSize // Calculate the number of records to skip
    const data = await prisma.ticket.findMany({
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
    return data
  }

  async findAllNotFinished (page: number, pageSize: number) {
    const skip = (page - 1) * pageSize // Calculate the number of records to skip
    const data = await prisma.ticket.findMany({
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
    return data
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
}
