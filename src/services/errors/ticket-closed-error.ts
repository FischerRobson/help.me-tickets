export class TicketClosedError extends Error {
  constructor () {
    super('Ticket closed')
  }
}
