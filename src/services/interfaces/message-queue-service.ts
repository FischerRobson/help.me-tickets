export interface MessageQueueService {
  produce: (queueName: string, message: string) => Promise<void>
  consume: (queueName: string, onMessage: (message: string) => void) => Promise<void>
}
