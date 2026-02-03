import type { BetterAuthClientOptions } from 'better-auth/client'
import type { createAuthClient as baseCreateAuthClient } from 'better-auth/react'

type BaseCreateAuthClient = typeof baseCreateAuthClient
type BaseReturn<Option extends BetterAuthClientOptions> =
  BaseCreateAuthClient extends <T extends Option>(options?: T) => infer R
    ? R
    : never

export interface PasswordResetActions {
  forgetPassword: (options: {
    email: string
    redirectTo?: string
  }) => Promise<{ error?: { message: string } }>
  resetPassword: (options: {
    newPassword: string
    token?: string
  }) => Promise<{ error?: { message: string } }>
}

declare module 'better-auth/react' {
  export function createAuthClient<Option extends BetterAuthClientOptions>(
    options?: Option
  ): BaseReturn<Option> & PasswordResetActions
}
