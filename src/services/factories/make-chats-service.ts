import { PrismaChatsRepository } from '@/repositories/prisma/prisma-chats-repository'
import { ChatsService } from '../chats-service'
import { makeTicketsService } from './make-tickets-service'

export function makeChatsService () {
  const service = new ChatsService(new PrismaChatsRepository(), makeTicketsService())
  return service
}
