import { type MessageProducer } from '@/services/interfaces/message-producer'

export class RabbitMQService implements MessageProducer {
  async sendToQueue (queueName: string, message: string) {
    console.log('message sent to queue ', queueName)
  }
}
