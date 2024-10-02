export interface MessageConsumer {
  consume: (queueName: string, onMessage: (message: string) => void) => Promise<void>
}
