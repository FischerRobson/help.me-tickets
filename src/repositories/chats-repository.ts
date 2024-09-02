import { type Chat } from '@prisma/client'

export interface CreateChatParams {
  authorId: string
  description: string
  ticketId: string
}

export interface ChatsRepository {
  create: (data: CreateChatParams) => Promise<Chat>
}
