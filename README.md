# Biciantro - Indoor Bike Booking System

Multi-branch bike studio management platform with role-based access control (superuser → branch admins → clients), featuring time-limited invite links, configurable booking policies, waitlist management, manual payment tracking, customizable email notifications, and Spanish (Ecuador) localization.

## Features

### User Roles
- **Superuser**: Manage all branches, admins, and perform all system actions
- **Branch Admin**: Manage clients, classes, bookings, plans, and payments for their branch
- **Client**: Book classes, view bookings, and manage their profile

### Key Functionality
- 🔐 Multi-provider authentication (Email, Google, Apple)
- 📧 Time-limited invite links with embedded plan details (24h expiration)
- 📅 Calendar-based class booking with real-time availability
- ⏰ Configurable cancellation policy (default: 2 hours before class)
- 📊 Admin dashboard with analytics (total clients, new clients, revenue)
- 🎫 Waitlist management (max 3 people, automatic promotion)
- 💳 Manual payment tracking and history
- 🔔 Customizable email notifications (Resend)
- 🌐 Spanish (Ecuador) UI with i18next
- 📝 Comprehensive admin action logging
- ⏱️ 30-day session persistence

### Membership Plans
- 1 class per week
- 2 classes per week
- 3 classes per week
- Unlimited classes
- Mid-period plan extensions and upgrades

## Tech Stack

### Frontend
- **Next.js 15** - React meta-framework with App Router
- **React 19** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS 4** - Styling (red/black/white theme)
- **shadcn/ui + Radix UI** - Component library
- **CVA** - Component variant management

### Backend
- **PostgreSQL** - Primary database
- **PgTyped** - Type-safe SQL queries
- **Zod** - Runtime validation
- **Resend** - Email notifications
- **JWT** - Signed tokens for invite links and auth

### Development
- **Vitest** - Unit testing
- **Biome** - Code linting and formatting
- **pnpm** - Package manager

## Project Structure

```
biciantro/
├── .github/              # GitHub configuration
├── db/                   # Database schemas and migrations
│   ├── schema.sql
│   └── migrations/
├── src/
│   ├── app/              # Next.js App Router pages
│   │   ├── (auth)/       # Auth routes (login, register)
│   │   ├── (dashboard)/  # Dashboard routes (admin, client)
│   │   └── api/          # API routes
│   ├── actions/          # Server actions
│   ├── components/       # React components
│   │   └── ui/           # shadcn/ui components
│   ├── db/
│   │   └── queries/      # PgTyped SQL queries
│   ├── lib/              # Utilities and config
│   │   ├── db.ts         # Database connection
│   │   └── utils.ts      # Helper functions
│   └── types/            # TypeScript type definitions
├── public/               # Static assets
├── vitest.config.ts      # Vitest configuration
├── tailwind.config.ts    # Tailwind configuration
├── pgtyped.config.json   # PgTyped configuration
└── package.json
```

## Getting Started

### Prerequisites
- Node.js 18+ 
- pnpm 9+
- PostgreSQL 14+

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd biciantro
```

2. Install dependencies:
```bash
pnpm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` and configure:
- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - Secret key for JWT tokens
- `RESEND_API_KEY` - Resend API key for emails
- OAuth credentials (optional)

4. Set up the database:
```bash
# Create the database
createdb biciantro

# Run migrations
psql biciantro < db/schema.sql
```

5. Generate PgTyped types (when queries are ready):
```bash
pnpm pgtyped -c pgtyped.config.json
```

6. Start the development server:
```bash
pnpm dev
```

The application will be available at [http://localhost:3000](http://localhost:3000)

## Development

### Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm preview` - Preview production build
- `pnpm test` - Run tests
- `pnpm test:watch` - Run tests in watch mode
- `pnpm lint` - Lint code with Biome
- `pnpm format` - Format code with Biome
- `pnpm check` - Run Biome check (lint + format)
- `pnpm db:generate` - Generate PgTyped types from SQL queries

### Code Style

- **Language**: Code and routes in English, UI in Spanish (Ecuador)
- **Components**: Separate, composable components with CVA variants
- **Documentation**: JSDoc comments without examples
- **Testing**: Vitest tests for complex features (booking logic, validation)
- **Code Quality**: Biome for linting and formatting

### Database Queries

Use PgTyped for type-safe SQL queries:

1. Create `.sql` files in `src/db/queries/`
2. Write queries with PgTyped annotations
3. Run `pnpm pgtyped -c pgtyped.config.json`
4. Import generated types in TypeScript

Example:
```sql
/* @name GetUserByEmail */
SELECT id, email, first_name, last_name
FROM users
WHERE email = :email!;
```

### Timezone

All times are handled in `America/Guayaquil` timezone by default.

## Database Schema

See [db/schema.sql](db/schema.sql) for the complete database schema.

Key tables:
- `branches` - Business branches
- `users` - All users (superuser, admin, client)
- `membership_plans` - Plan definitions
- `user_memberships` - Active user memberships
- `classes` - Scheduled classes
- `bookings` - Class bookings and waitlist
- `payments` - Manual payment records
- `invite_links` - Time-limited registration links
- `admin_action_logs` - Audit trail
- `notification_settings` - Email notification config

## Deployment

### Environment Variables

Ensure all environment variables are set in production:
- `DATABASE_URL`
- `JWT_SECRET` (strong secret key)
- `RESEND_API_KEY`
- OAuth credentials if enabled

## License

[Your License Here]

## Support

For support, contact [your-email@example.com]
