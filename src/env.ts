import 'dotenv/config'
import z from 'zod'

const envSchema = z.object({
  NODE_ENV: z.enum(['dev', 'prod', 'test']).default('dev'),
  PORT: z.coerce.number().default(3333),
  JWT_SECRET: z.string(),
  RABBITMQ_HOST: z.string(),
  RABBITMQ_NOTIFICATION_QUEUE: z.string(),
  CORS_ALLOWED_ORIGINS: z.union([z.string(), z.array(z.string())])
})

const _env = envSchema.safeParse(process.env)

if (!_env.success) {
  console.error(_env.error.format())
  throw new Error('Missing environment variables')
}

export const env = _env.data
