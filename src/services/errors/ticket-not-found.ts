export class TicketNotFound extends Error {
  constructor () {
    super('Ticket not found')
  }
}
