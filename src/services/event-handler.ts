/* eslint-disable @typescript-eslint/no-misused-promises */
import { logger } from '@/logger'
import { type MessageQueueService } from './interfaces/message-queue-service'
import { type TicketsService } from './tickets-service'

// denifed on GO UploadAPI
interface FileUploadQueueMessage {
  uploadId: string
  filesUrls: string[]
}

export class EventHandler {
  private readonly messageQueueService: MessageQueueService
  private readonly ticketService: TicketsService

  constructor (messageQueueService: MessageQueueService, ticketService: TicketsService) {
    this.messageQueueService = messageQueueService
    this.ticketService = ticketService
  }

  async startListening (): Promise<void> {
    await this.messageQueueService.consume('fileUploadQueue', async (message) => {
      try {
        const parsedMessage: FileUploadQueueMessage = JSON.parse(message)
        logger.info(parsedMessage, 'Consuming message from uploadFileQueue')
        void this.ticketService.addFilesUpload(parsedMessage.filesUrls, parsedMessage.uploadId)
      } catch (err) {
        console.error('Failed to parse message from uploadFileQueue')
      }
    })
  }
}
