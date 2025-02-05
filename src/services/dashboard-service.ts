import { type TicketsRepository } from '@/repositories/tickets-repository'

export class DashboardService {
  private readonly ticketsRepository: TicketsRepository

  constructor (ticketsRepository: TicketsRepository) {
    this.ticketsRepository = ticketsRepository
  }

  async getDashboardData () {
    const [openedToday, categorized, ticketsPerDay] = await Promise.all([
      this.ticketsRepository.ticketsOpenedToday(),
      this.ticketsRepository.categorizedTickets(),
      this.ticketsRepository.ticketsPerDayForLast7Days()
    ])

    return {
      openedToday,
      categorized,
      ticketsPerDay
    }
  }
}
