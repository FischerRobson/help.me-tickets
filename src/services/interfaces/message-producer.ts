export interface MessageProducer {
  produce: (queueName: string, message: string) => Promise<void>
}
