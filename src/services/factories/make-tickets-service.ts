import { PrismaTicketsRepository } from '../../repositories/prisma/prisma-tickets-repository'
import { TicketsService } from '../tickets-service'

export function makeTicketsService (): TicketsService {
  const ticketsService = new TicketsService(new PrismaTicketsRepository())
  return ticketsService
}
