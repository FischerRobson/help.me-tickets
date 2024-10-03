import { MessageQueueServiceBuilder } from '../message-queue/message-queue-service-builder'
import { EventHandler } from '../event-handler'
import { makeTicketsService } from './make-tickets-service'

export function makeEventHandler () {
  const eventHandler = new EventHandler(
    new MessageQueueServiceBuilder().withRabbitMQ().build(),
    makeTicketsService()
  )
  return eventHandler
}
