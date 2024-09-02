import { TicketStatus, type Ticket } from '@prisma/client'
import { type UpdateTicketParams, type CreateTicketParams, type TicketsRepository } from '../tickets-repository'
import { prisma } from '../../lib/prisma'

export class PrismaTicketsRepository implements TicketsRepository {
  async create (dataInput: CreateTicketParams): Promise<Ticket> {
    return await prisma.ticket.create({
      data: {
        title: dataInput.title,
        description: dataInput.description,
        categoryId: dataInput.categoryId,
        user_id: dataInput.userId,
        ticket_status: dataInput.ticketStatus
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
            author_id: true
          }
        }
      }
    })
  }

  async findAllByUserId (id: string, page: number, pageSize: number) {
    const skip = (page - 1) * pageSize
    return await prisma.ticket.findMany({
      skip,
      take: pageSize,
      select: {
        id: true,
        title: true,
        description: true,
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
      where: { user_id: id }
    })
  }

  async findAllBySupportId (id: string): Promise<Ticket[] | null> {
    return await prisma.ticket.findMany({ where: { support_id: id } })
  }

  async findAll (page: number, pageSize: number) {
    const skip = (page - 1) * pageSize // Calculate the number of records to skip
    const data = await prisma.ticket.findMany({
      skip,
      take: pageSize,
      select: {
        id: true,
        title: true,
        description: true,
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
        description: true,
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
          ticket_status: TicketStatus.CLOSED
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
}
