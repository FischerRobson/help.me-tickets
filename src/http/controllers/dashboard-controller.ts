import { makeDashboardService } from '@/services/factories/make-dashboard-service'
import { type FastifyReply, type FastifyRequest } from 'fastify'

class DashboardController {
  async getDashboardData (req: FastifyRequest, res: FastifyReply) {
    try {
      const service = makeDashboardService()
      const response = service.getDashboardData()
      return await response
    } catch (err) {
      console.error(err)
      throw err
    }
  }
}

export const dashboardController = new DashboardController()
