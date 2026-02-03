# Code Standardization & Best Practices Audit
Date: 2026-02-03
Scope: Repo-wide review for Tailwind, Next.js, TypeScript, SQL, and SWR usage.

**Summary**
The repo shows strong structure and good tooling choices (App Router, server actions, strict TS, Biome, pgtyped, Tailwind v4, and a reusable UI layer). The biggest standardization risks are inconsistent user tables (`users` vs `"user"`), mixed SQL styles (pgtyped vs raw), middleware doing auth lookups in Edge, and Tailwind tokens not consistently used in UI classes. The findings below prioritize correctness, consistency, and maintainability.

**Tailwind**
1. Finding: Design tokens are defined but many components bypass them with hardcoded colors like `text-white`, `bg-white/5`, `border-white/10`.
Evidence: `src/app/(auth)/login/page.tsx`, `src/app/(dashboard)/admin/branches/branches-table.tsx`.
Fix: Standardize on token classes (`bg-background`, `text-foreground`, `border-border`, `bg-accent`) and update `tailwind.config.ts` to align with the CSS variables. This makes theming and future design changes much easier.

2. Finding: `:root` is defined twice and custom utility classes are not namespaced in a Tailwind layer.
Evidence: `src/app/globals.css`.
Fix: Merge `:root` blocks into one and wrap custom utilities in `@layer utilities { ... }` to keep precedence predictable and consistent with Tailwind’s build pipeline.

3. Finding: UI component variants are standardized in some places (`cva`) but not consistently reused for page-level patterns.
Evidence: `src/components/ui/button.tsx`, `src/app/(auth)/login/page.tsx`.
Fix: Extract repeated layout/box patterns into reusable components or `cva` variants to reduce Tailwind string duplication and enforce style consistency.

**Next.js**
1. Finding: Middleware reads headers via `next/headers` and calls `auth` (which uses `pg`) inside middleware.
Evidence: `middleware.ts`, `src/lib/auth.ts`, `src/lib/db.ts`.
Fix: Middleware runs in the Edge runtime. Avoid DB-backed session checks there. Instead, read `request.cookies` or `request.headers` directly in middleware for lightweight gating, and perform full session validation in server components/actions. Use `request.headers` rather than `headers()` inside middleware.

2. Finding: Server Actions `allowedOrigins` does not include explicit schemes for production.
Evidence: `next.config.mjs`.
Fix: Add explicit origins (e.g., `https://biciantro.pages.dev`) to reduce ambiguity and prevent CORS misconfigurations.

3. Finding: Some auth routing depends on client-side redirects after sign-in, which can cause brief flashes or hydration mismatch during role routing.
Evidence: `src/app/(auth)/login/page.tsx`.
Fix: After auth, consider a server-side redirect using a server action or a route handler so role-based redirects happen before render.

**TypeScript**
1. Finding: `SessionUser.role` is typed as `string`, losing type safety for role checks.
Evidence: `src/actions/auth.ts`.
Fix: Use a shared union type like `UserRole` and propagate it to `SessionUser` so role checks are typed and exhaustive.

2. Finding: SWR mutation helpers use `mutate: () => void`, losing type safety and common SWR options.
Evidence: `src/hooks/use-packages.ts`, `src/hooks/use-branches.ts`, `src/hooks/use-payments.ts`.
Fix: Type `mutate` as `KeyedMutator<T>` from `swr` for better inference and for options like optimistic updates.

3. Finding: `auth-client` bypasses types with `Record<string, unknown>` to access methods.
Evidence: `src/lib/auth-client.ts`.
Fix: Add a module augmentation for better-auth’s client types or define a typed wrapper interface so `forgetPassword` and `resetPassword` are typed without casts.

4. Finding: `metadata` is typed as `Record<string, any>` in audit logging.
Evidence: `src/lib/audit.ts`.
Fix: Prefer `Record<string, unknown>` or a typed metadata interface and validate/serialize when writing to the DB.

**SQL**
1. Finding: Inconsistent user table usage (`users` vs `"user"`) across actions and migrations.
Evidence: `db/schema.sql`, `db/migrations/012_better_auth.sql`, `src/actions/branches.ts`, `src/actions/auth.ts`, `src/db/queries/admin.sql`.
Fix: Standardize on one canonical table. If `better-auth` is the source of truth, update raw SQL and migrations to reference `"user"` and remove/retire `users`. If legacy `users` is still required, create a view or migration to keep them in sync and update code to avoid splitting data sources.

2. Finding: Some tables are missing foreign keys for relational integrity in the base schema.
Evidence: `db/schema.sql` (`package_class_usage.booking_id`, `package_class_usage.class_id`, `user_class_packages.payment_id`, `gift_package_codes.payment_id`).
Fix: Add FKs where possible to prevent orphan records and make joins safer. If there’s a reason to omit FKs (e.g., external payment provider), document it.

3. Finding: `SELECT *` is used in multiple SQL queries and functions.
Evidence: `src/db/queries/equipment.sql`, `src/db/queries/health-profiles.sql`, `src/db/queries/instructors.sql`, `src/db/queries/recurring-classes.sql`, `src/db/queries/class-packages.sql`.
Fix: Enumerate columns explicitly to prevent accidental API shape changes when schema evolves and to reduce over-fetching.

4. Finding: Raw SQL and pgtyped are mixed in the same domain, reducing consistency.
Evidence: `src/actions/admin.ts` (pgtyped) vs `src/actions/branches.ts` (raw SQL).
Fix: Pick one strategy per domain. Prefer pgtyped for type safety, or move to a dedicated DB layer for raw SQL and keep it consistent.

5. Finding: pgtyped is configured with `failOnError: false`.
Evidence: `pgtyped.config.json`.
Fix: Set `failOnError: true` to avoid silently broken SQL at build time.

**SWR**
1. Finding: Global SWR configuration is absent, so caching and error handling are inconsistent across hooks.
Evidence: No `SWRConfig` in `src/app/layout.tsx` and hooks in `src/hooks/*`.
Fix: Add a top-level `SWRConfig` with a shared fetcher, retry policy, and dedupe interval for consistent behavior.

2. Finding: Some SWR keys are not scoped by user, which can cause stale data after account switching in the same browser session.
Evidence: `src/hooks/use-session.ts`, `src/hooks/use-package.ts`, `src/hooks/use-bookings.ts`.
Fix: Incorporate `userId` (or session hash) into keys or reset the SWR cache on sign-out.

3. Finding: Mutations call `mutate()` without optimistic updates or error rollback.
Evidence: `src/hooks/use-packages.ts`, `src/hooks/use-branches.ts`, `src/hooks/use-payments.ts`.
Fix: Consider `mutate` with `optimisticData` and `rollbackOnError` for better UX and consistency, especially for admin actions.

**Strengths Noted**
1. Good use of App Router, server actions, and `revalidatePath` for data freshness.
Evidence: `src/actions/*`.

2. Strict TypeScript, Biome formatting, and shared Tailwind utilities (`cn`, `cva`) are in place.
Evidence: `tsconfig.json`, `biome.json`, `src/lib/utils.ts`, `src/components/ui/*`.

3. SQL schema shows strong use of constraints, enums, indexes, and timestamps.
Evidence: `db/schema.sql`.

**Recommended Standardization Plan (Short)**
1. Decide the canonical user table and align all SQL/actions to it.
2. Standardize DB access (pgtyped or raw SQL) per domain.
3. Fix middleware to avoid DB access and use request headers/cookies only.
4. Replace hardcoded colors with Tailwind token classes and consolidate CSS utilities.
5. Add `SWRConfig` and scope keys by user/session.

