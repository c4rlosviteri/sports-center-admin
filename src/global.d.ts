// Path alias declarations for module resolution

// CSS modules declaration
declare module '*.css' {
  const content: { [className: string]: string }
  export default content
}

declare module '~/lib/auth' {
  export * from '@/lib/auth'
}

declare module '~/lib/db' {
  export * from '@/lib/db'
}

declare module '~/lib/schemas' {
  export * from '@/lib/schemas'
}

declare module '~/lib/booking-service' {
  export * from '@/lib/booking-service'
}

declare module '~/lib/email' {
  export * from '@/lib/email'
}

declare module '~/types/database' {
  export * from '@/types/database'
}

declare module '~/hooks/use-payments' {
  export * from '@/hooks/use-payments'
}

declare module '~/hooks/use-users' {
  export * from '@/hooks/use-users'
}

declare module '~/hooks/use-classes' {
  export * from '@/hooks/use-classes'
}

declare module '~/hooks/use-membership' {
  export * from '@/hooks/use-membership'
}

declare module '~/hooks/use-session' {
  export * from '@/hooks/use-session'
}
