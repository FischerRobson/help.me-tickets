import { PrismaTicketsRepository } from '@/repositories/prisma/prisma-tickets-repository'
import { DashboardService } from '../dashboard-service'

export function makeDashboardService (): DashboardService {
  const dashboardService = new DashboardService(
    new PrismaTicketsRepository()
  )
  return dashboardService
}
