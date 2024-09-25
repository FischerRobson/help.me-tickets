import { type EventType } from '..'

export interface Notifier {
  setReceiver: (receiver: string) => this
  setEventType: (eventType: EventType) => this

  handleTicketCreated: () => this
  handleTicketUpdated: () => this
  handleTicketClosed: () => this
  handleChatAdd: () => this

  notify: () => Promise<void>
}
