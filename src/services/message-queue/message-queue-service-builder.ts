import { RabbitMQService } from '@/services/message-queue/rabbitmq-service' // Assuming this is your RabbitMQ class
import { type MessageQueueService } from '@/services/interfaces/message-queue-service'

export class MessageQueueServiceBuilder {
  private messageQueueService!: MessageQueueService | null

  withRabbitMQ (): this {
    this.messageQueueService = new RabbitMQService()
    return this
  }

  build () {
    if (!this.messageQueueService) {
      throw new Error('Message Queue Service is not configured')
    }

    return this.messageQueueService
  }
}
