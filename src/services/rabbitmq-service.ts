import { env } from '@/env'
import amqp from 'amqplib'
import { type MessageQueueService } from './interfaces/message-queue-service'

export class RabbitMQService implements MessageQueueService {
  async produce (queueName: string, message: string) {
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

  async consume (queueName: string, onMessage: (message: string) => void): Promise<void> {
    try {
      const connection = await amqp.connect(env.RABBITMQ_HOST)
      const channel = await connection.createChannel()

      await channel.assertQueue(queueName, { durable: false })

      console.log(`Waiting for messages in queue: ${queueName}`)

      await channel.consume(queueName, (msg) => {
        if (msg !== null) {
          const messageContent = msg.content.toString()
          onMessage(messageContent)
          channel.ack(msg)
        }
      }, { noAck: false })
    } catch (error) {
      console.error('Error consuming messages from queue:', error)
    }
  }
}
