# Database Setup

## Quick Start

### 1. Start PostgreSQL locally
```bash
# Using Docker
docker run --name biciantro-postgres -e POSTGRES_PASSWORD=postgres -p 5432:5432 -d postgres:16

# Or use your local PostgreSQL installation
```

### 2. Create database and run schema
```bash
# Create database
psql -U postgres -h localhost -c "CREATE DATABASE biciantro;"

# Run schema
psql -U postgres -h localhost -d biciantro -f schema.sql

# Run seed data
psql -U postgres -h localhost -d biciantro -f seed.sql
```

### 3. Configure environment variables
Create `.env` file in project root:
```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/biciantro
JWT_SECRET=your-secret-key-here-at-least-32-characters-long
RESEND_API_KEY=re_your_resend_api_key
```

### 4. Generate PgTyped types
```bash
pnpm pgtyped
```

## Seed Data

The seed script creates:
- **Branch**: Biciantro Norte (Quito)
- **Users**:
  - Superuser: `admin@biciantro.ec` / `password123`
  - Admin: `branch.admin@biciantro.ec` / `password123`
  - Client 1: `juan.perez@example.com` / `password123` (active membership, 5 classes remaining)
  - Client 2: `ana.torres@example.com` / `password123` (active membership, 3 classes remaining)
  - Client 3: `carlos.ruiz@example.com` / `password123` (expired membership)
- **Plans**: 4 membership plans (1, 2, 3 classes/week, unlimited)
- **Classes**: 6 scheduled classes over 3 days
- **Bookings**: 3 confirmed bookings
- **Payments**: 2 payment records
- **Invite Link**: Token `test_invite_token_2026` (valid for 24h)

## Reset Database

```bash
# Drop and recreate
psql -U postgres -h localhost -c "DROP DATABASE IF EXISTS biciantro;"
psql -U postgres -h localhost -c "CREATE DATABASE biciantro;"
psql -U postgres -h localhost -d biciantro -f schema.sql
psql -U postgres -h localhost -d biciantro -f seed.sql
```
