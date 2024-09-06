interface Chat {
  id: string
  created_at: Date
  author_id: string
  description: string
  ticketId: string
  filesURL: string[]
}

export interface CreateChatParams {
  authorId: string
  description: string
  ticketId: string
  filesURL?: string[]
}

export interface ChatsRepository {
  create: (data: CreateChatParams) => Promise<Chat>
}
