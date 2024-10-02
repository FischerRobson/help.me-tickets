import { env } from '@/env'
import { type MessageQueueService } from './interfaces/message-queue-service'

class EventQueueService {
  private readonly messageQueueService: MessageQueueService

  constructor (messageQueueService: MessageQueueService) {
    this.messageQueueService = messageQueueService
  }

  produceOnEmailQueue (message: string) {
    const queueName = env.RABBITMQ_EMAIL_QUEUE
    void this.messageQueueService.produce(queueName, message)
  }

  consumeUploadQueue () {
    const queueName = 'uploadQueue'
    void this.messageQueueService.consume(queueName, (message) => {
      console.log('Received Ticket Created Message:', message)
    })
  }
}
