import { type ChatsRepository } from '@/repositories/chats-repository'

interface CreateChatParams {
  authorId: string
  description: string
  ticketId: string
}

export class ChatsService {
  private readonly chatsRepository: ChatsRepository

  constructor (chatsRepository: ChatsRepository) {
    this.chatsRepository = chatsRepository
  }

  async create (data: CreateChatParams) {
    // validations

    const chat = await this.chatsRepository.create(data)

    return { chat }
  }
}
