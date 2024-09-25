import { EventType } from '@/events'
import { type MessageProducer } from './interfaces/message-producer'

class EventService {
  private readonly messageProducer: MessageProducer

  constructor (messageProducer: MessageProducer) {
    this.messageProducer = messageProducer
  }

  async handleEvent (eventType: EventType, user: string) {
    let message: BaseMessage

    switch (eventType) {
      case EventType.TICKET_CREATED:
        message = {
          emailReceiver: user,
          title: 'New Ticket Created',
          body: `Hi ${user}, your support ticket has been created. We will get back to you shortly.`,
          type: eventType,
          additionalData: {
            ticketId: user.ticketId
          }
        }
        break

      case EventType.TICKET_UPDATED:
        message = {
          emailReceiver: user,
          title: 'Ticket Updated',
          body: `Hi ${user}, your support ticket has been updated. Please check the latest status.`,
          type: eventType,
          additionalData: {
            ticketId: user.ticketId
          }
        }
        break

      case EventType.TICKET_CLOSED:
        message = {
          emailReceiver: user,
          title: 'Ticket Closed',
          body: `Hi ${user}, your support ticket has been closed. If you have any further issues, feel free to open a new ticket.`,
          type: eventType,
          additionalData: {
            ticketId: user.ticketId
          }
        }
        break

      case EventType.CHAT_ADD:
        message = {
          emailReceiver: user,
          title: 'New Chat Message',
          body: `Hi ${user}, you've received a new message in your support ticket.`,
          type: eventType,
          additionalData: {
            ticketId: user.ticketId
          }
        }
        break

      default:
        console.log('Unknown event type')
    }
  }
}
