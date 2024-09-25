import { env } from '@/env'
import amqp from 'amqplib'
import { type MessageProducer } from './interfaces/message-producer'

export class RabbitMQService implements MessageProducer {
  async sendToQueue (queueName: string, message: string) {
    try {
      const connection = await amqp.connect(env.RABBITMQ_HOST)
      const channel = await connection.createChannel()

      await channel.assertQueue(queueName, { durable: false })

      channel.sendToQueue(queueName, Buffer.from(message), { persistent: true })
      console.log(`Message sent to queue: ${queueName}`)

      setTimeout(() => {
        void connection.close()
      }, 500)
    } catch (error) {
      console.error('Error sending message to queue:', error)
    }
  }
}
