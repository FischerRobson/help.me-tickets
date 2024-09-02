import { PrismaChatsRepository } from '@/repositories/prisma/prisma-chats-repository'
import { ChatsService } from '../chats-service'

export function makeChatsService () {
  const service = new ChatsService(new PrismaChatsRepository())
  return service
}
