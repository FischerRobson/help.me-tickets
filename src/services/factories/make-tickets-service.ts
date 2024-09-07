import { PrismaCategoryRepository } from '@/repositories/prisma/prisma-categories-repository'
import { PrismaTicketsRepository } from '../../repositories/prisma/prisma-tickets-repository'
import { TicketsService } from '../tickets-service'

export function makeTicketsService (): TicketsService {
  const ticketsService = new TicketsService(new PrismaTicketsRepository(), new PrismaCategoryRepository())
  return ticketsService
}
