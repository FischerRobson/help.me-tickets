export interface MessageProducer {
  sendToQueue: (queueName: string, message: string) => Promise<void>
}
