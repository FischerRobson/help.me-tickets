import { RabbitMQService } from '@/services/rabbitmq-service'
import { EmailEventBuilder } from '../email-event-builder'

export function makeEmailEventBuilder (): EmailEventBuilder {
  const emailEventBuilder = new EmailEventBuilder(new RabbitMQService())
  return emailEventBuilder
}
