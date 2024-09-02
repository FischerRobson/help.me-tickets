import 'fastify'

declare module 'fastify' {
  interface FastifyRequest {
    user: {
      sub: string
      role: 'USER' | 'ADMIN' | 'SUPPORT'
    }
  }
}

declare module '@fastify/jwt' {
  interface FastifyJWT {
    payload: {
      sub: string
    }
    user: {
      sub: string
      role: 'USER' | 'ADMIN' | 'SUPPORT'
    }
  }
}
