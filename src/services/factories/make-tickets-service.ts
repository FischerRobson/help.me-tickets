import { PrismaCategoryRepository } from '@/repositories/prisma/prisma-categories-repository'
import { PrismaTicketsRepository } from '../../repositories/prisma/prisma-tickets-repository'
import { TicketsService } from '../tickets-service'
import { MessageQueueServiceBuilder } from '../message-queue/message-queue-service-builder'

export function makeTicketsService (): TicketsService {
  const ticketsService = new TicketsService(
    new PrismaTicketsRepository(),
    new PrismaCategoryRepository(),
    new MessageQueueServiceBuilder().withRabbitMQ().build()
  )
  return ticketsService
}
