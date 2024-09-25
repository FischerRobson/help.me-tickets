function handleEvent (eventType: string, user: any) {
  let message: BaseMessage

  switch (eventType) {
    case 'USER_SIGNUP':
      message = {
        emailReceiver: user.email,
        title: 'Welcome to Our Service!',
        body: `Hi ${user.name}, thank you for signing up!`,
        type: eventType
      }
      break

    case 'TICKET_CREATED':
      message = {
        emailReceiver: user.email,
        title: 'New Ticket Created',
        body: `Hi ${user.name}, your support ticket has been created. We will get back to you shortly.`,
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
