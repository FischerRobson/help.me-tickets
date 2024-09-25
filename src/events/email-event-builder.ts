import { type MessageProducer } from '@/services/interfaces/message-producer'
import { EventType } from '.'
import { env } from '@/env'
import { type Notifier } from './interfaces/notifier'

export interface Email {
  emailReceiver: string
  title: string
  body: string
  type: EventType
}

export class EmailEventBuilder implements Notifier {
  private emailReceiver!: string
  private title!: string
  private body!: string
  private type!: EventType
  private readonly messageProducer: MessageProducer

  constructor (messageProducer: MessageProducer) {
    this.messageProducer = messageProducer
  }

  setReceiver (emailReceiver: string): this {
    this.emailReceiver = emailReceiver
    return this
  }

  setTitle (title: string): this {
    this.title = title
    return this
  }

  setBody (body: string): this {
    this.body = body
    return this
  }

  setEventType (type: EventType): this {
    this.type = type
    return this
  }

  handleTicketCreated (): this {
    this.setTitle('Your Ticket is Created')
    this.setBody('We have received your ticket and are working on it.')
    this.setEventType(EventType.TICKET_CREATED)
    return this
  }

  handleTicketUpdated (): this {
    this.setTitle('Your Ticket is Updated')
    this.setBody('Your ticket has been updated with the latest information.')
    this.setEventType(EventType.TICKET_UPDATED)
    return this
  }

  handleTicketClosed (): this {
    this.setTitle('Your Ticket is Closed')
    this.setBody('Your ticket has been resolved and closed.')
    this.setEventType(EventType.TICKET_CLOSED)
    return this
  }

  handleChatAdd (): this {
    this.setTitle('New Chat Message Added')
    this.setBody('A new message has been added to the ticket chat.')
    this.setEventType(EventType.CHAT_ADD)
    return this
  }

  build (): Email {
    if (!this.emailReceiver || !this.title || !this.body || !this.type) {
      throw new Error('Missing required fields to build the event')
    }

    return {
      emailReceiver: this.emailReceiver,
      title: this.title,
      body: this.body,
      type: this.type
    }
  }

  async notify () {
    const event = this.build()
    console.log(`Notifying for event type: ${event.type}`)

    const { emailReceiver, title, body } = event
    const message = emailReceiver + '|' + title + '|' + body
    void this.messageProducer.sendToQueue(env.RABBITMQ_EMAIL_QUEUE, message)
  }
}
