import { type FastifyReply, type FastifyRequest } from 'fastify'
import { HttpStatusCode } from '@/constants/HttpStatusCode'

export async function verifyJwt (req: FastifyRequest, res: FastifyReply) {
  try {
    // const { authorization } = req.headers
    await req.jwtVerify()
  } catch {
    res.status(HttpStatusCode.Unauthorized).send({ message: 'Unauthorized' })
  }
}
