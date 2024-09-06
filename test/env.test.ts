import { describe, it, expect, afterEach, vi } from 'vitest'

// Mock dotenv config to prevent loading environment variables from a .env file
vi.mock('dotenv/config')

describe('Environment Variables Validation', () => {
  const originalEnv = process.env

  const mockEnv = async (envVars: NodeJS.ProcessEnv) => {
    process.env = { ...originalEnv, ...envVars }

    return await import('../src/env')
  }

  afterEach(() => {
    vi.resetModules()
    process.env = { ...originalEnv }
  })

  it('should load environment variables successfully with defaults', async () => {
    const envVars = {
      NODE_ENV: 'prod',
      PORT: '5000',
      JWT_SECRET: 'supersecret'
    }

    const { env } = await mockEnv(envVars)

    expect(env.NODE_ENV).toBe('prod')
    expect(env.PORT).toBe(5000)
    expect(env.JWT_SECRET).toBe('supersecret')
  })

  it('should use default PORT when not provided', async () => {
    const envVars = {
      NODE_ENV: 'dev',
      JWT_SECRET: 'anothersecret'
    }

    const { env } = await mockEnv(envVars)

    expect(env.NODE_ENV).toBe('dev')
    expect(env.PORT).toBe(3333)
    expect(env.JWT_SECRET).toBe('anothersecret')
  })

  it('should throw an error if JWT_SECRET is missing', async () => {
    const envVars = {
      NODE_ENV: 'test',
      PORT: '4000'
    }

    try {
      await mockEnv(envVars)
    } catch (error) {
      expect(error).toBeInstanceOf(Error)
      expect((error as Error).message).toBe('Missing environment variables')
    }
  })

  it('should throw an error if NODE_ENV is invalid', async () => {
    // prevent ZOD validation error message
    const mockConsoleError = vi.spyOn(console, 'error').mockImplementation(() => {})

    const envVars = {
      NODE_ENV: 'invalid',
      PORT: '4000',
      JWT_SECRET: 'secret'
    }

    try {
      await mockEnv(envVars)
    } catch (error) {
      expect(error).toBeInstanceOf(Error)
      expect((error as Error).message).toBe('Missing environment variables')
    }
    mockConsoleError.mockRestore()
  })
})
