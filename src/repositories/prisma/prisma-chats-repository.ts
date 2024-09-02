import { prisma } from '@/lib/prisma'
import { type CreateChatParams, type ChatsRepository } from '../chats-repository'

export class PrismaChatsRepository implements ChatsRepository {
  async create (data: CreateChatParams) {
    const chat = await prisma.chat.create({
      data: {
        author_id: data.authorId,
        description: data.description,
        ticketId: data.ticketId
      }
    })
    return chat
  }
}
