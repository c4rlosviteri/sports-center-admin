# OAuth Setup & Cloudflare Deployment Guide

## Table of Contents
1. [OAuth Setup](#oauth-setup)
2. [Cloudflare Deployment](#cloudflare-deployment)

---

## OAuth Setup

### 1. Google OAuth Configuration

#### Step 1: Create Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Navigate to **APIs & Services** > **Credentials**
4. Click **Create Credentials** > **OAuth 2.0 Client ID**
5. Configure the consent screen if prompted:
   - Select **External** (for public access) or **Internal** (for Google Workspace)
   - Fill in app name, user support email, and developer contact
   - Add required scopes: `openid`, `email`, `profile`
   - Add test user accounts if in testing mode

6. Create OAuth 2.0 Client ID:
   - Application type: **Web application**
   - Name: `Biciantro Web App`
   - **Authorized JavaScript origins**:
     - `http://localhost:3000` (development)
     - `https://your-domain.com` (production)
   - **Authorized redirect URIs**:
     - `http://localhost:3000/api/auth/callback/google`
     - `https://your-domain.com/api/auth/callback/google`

7. Copy the **Client ID** and **Client Secret**

#### Step 2: Configure Environment Variables

```bash
# .env.local (development)
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

For Cloudflare deployment, use Wrangler:
```bash
wrangler secret put GOOGLE_CLIENT_ID
wrangler secret put GOOGLE_CLIENT_SECRET
```

### 2. Apple OAuth Configuration (Optional)

#### Step 1: Configure Apple Developer Account

1. Go to [Apple Developer Portal](https://developer.apple.com/)
2. Navigate to **Certificates, Identifiers & Profiles**
3. Create an **App ID** with "Sign in with Apple" capability
4. Create a **Services ID** for your web app:
   - Identifier: `com.yourcompany.biciantro.web`
   - Enable "Sign in with Apple"
   - Configure domains and redirect URLs
5. Create a **Key** for Sign in with Apple:
   - Download the `.p8` private key file
   - Note the Key ID

#### Step 2: Required Environment Variables

```bash
APPLE_CLIENT_ID=com.yourcompany.biciantro.web
APPLE_CLIENT_SECRET=generated-client-secret  # See generation below
APPLE_TEAM_ID=your-team-id
APPLE_KEY_ID=your-key-id
```

#### Step 3: Generate Apple Client Secret

Apple requires a JWT-based client secret that expires every 6 months. Generate it using:

```typescript
// scripts/generate-apple-secret.ts
import jwt from 'jsonwebtoken'
import fs from 'fs'

const privateKey = fs.readFileSync('AuthKey_XXXXXXXXXX.p8')

const token = jwt.sign(
  {
    iss: 'YOUR_TEAM_ID',
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 15777000, // 6 months
    aud: 'https://appleid.apple.com',
    sub: 'com.yourcompany.biciantro.web',
  },
  privateKey,
  {
    algorithm: 'ES256',
    header: {
      alg: 'ES256',
      kid: 'YOUR_KEY_ID',
    },
  }
)

console.log(token)
```

### 3. Better-Auth Configuration

The project already has better-auth configured in `src/lib/auth.ts`:

```typescript
socialProviders: {
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID || '',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    mapProfileToUser: (profile: {
      given_name?: string
      family_name?: string
    }) => ({
      firstName: profile.given_name || '',
      lastName: profile.family_name || '',
    }),
  },
  apple: {
    clientId: process.env.APPLE_CLIENT_ID || '',
    clientSecret: process.env.APPLE_CLIENT_SECRET || '',
    mapProfileToUser: (profile) => {
      const nameParts = (profile.name || '').split(' ')
      return {
        firstName: nameParts[0] || '',
        lastName: nameParts.slice(1).join(' ') || '',
      }
    },
  },
}
```

### 4. Client-Side OAuth Implementation

In `src/app/(auth)/login/page.tsx`:

```typescript
const handleGoogleLogin = async () => {
  await authClient.signIn.social({
    provider: 'google',
    callbackURL: '/client',
  })
}
```

The API route is already configured at `src/app/api/auth/[...all]/route.ts`.

---

## Cloudflare Deployment

### 1. Prerequisites

1. Install Wrangler CLI:
```bash
npm install -g wrangler
```

2. Login to Cloudflare:
```bash
wrangler login
```

3. Create a new Pages project or Workers project in Cloudflare Dashboard

### 2. Database Setup for Cloudflare

Since this app uses PostgreSQL, you have several options for Cloudflare deployment:

#### Option A: Keep External PostgreSQL (Recommended)

Continue using your existing PostgreSQL database (AWS RDS, Supabase, Neon, etc.).

Update connection to use connection pooling for serverless:

```typescript
// src/lib/db.ts modifications for Cloudflare
import { Pool } from 'pg'

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 1, // Limit connections for serverless
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
})
```

#### Option B: Migrate to Cloudflare D1 (SQLite)

If you want to use Cloudflare's native D1 database:

1. Create D1 database:
```bash
wrangler d1 create biciantro-db
```

2. Update better-auth to use D1 adapter:
```bash
npm install @libra/better-auth-cloudflare
```

3. Modify auth configuration:
```typescript
// src/lib/auth.ts
import { withCloudflare } from '@libra/better-auth-cloudflare'
import { drizzle } from 'drizzle-orm/d1'

export const auth = betterAuth(
  withCloudflare(
    {
      d1: { db: drizzle(env.DB) },
    },
    {
      secret: env.BETTER_AUTH_SECRET,
      baseURL: env.BETTER_AUTH_URL,
      // ... other options
    }
  )
)
```

### 3. Environment Variables Setup

Create `wrangler.toml`:

```toml
name = "biciantro"
compatibility_date = "2024-01-30"
compatibility_flags = ["nodejs_compat"]

# For Pages
[env.production]
vars = { 
  NODE_ENV = "production",
  BETTER_AUTH_URL = "https://your-domain.com",
  NEXT_PUBLIC_BETTER_AUTH_URL = "https://your-domain.com"
}

# Secrets (set via wrangler secret put)
# - DATABASE_URL
# - BETTER_AUTH_SECRET
# - GOOGLE_CLIENT_ID
# - GOOGLE_CLIENT_SECRET
# - RESEND_API_KEY
# - APPLE_CLIENT_ID (optional)
# - APPLE_CLIENT_SECRET (optional)

# For D1 (if using Option B)
[[d1_databases]]
binding = "DB"
database_name = "biciantro-db"
database_id = "your-database-id"
```

Set secrets:
```bash
# Set all required secrets
wrangler secret put DATABASE_URL
wrangler secret put BETTER_AUTH_SECRET
wrangler secret put GOOGLE_CLIENT_ID
wrangler secret put GOOGLE_CLIENT_SECRET
wrangler secret put RESEND_API_KEY
```

### 4. Build Configuration

Update `next.config.mjs` for Cloudflare:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone', // Required for Cloudflare
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3000', 'your-domain.com'],
    },
  },
  reactStrictMode: true,
  webpack: (config) => {
    config.externals.push({
      'pg-native': 'commonjs pg-native',
    })
    return config
  },
}

export default nextConfig
```

### 5. Deployment Options

#### Option A: Cloudflare Pages (Static + Edge Functions)

Best for Next.js apps with static generation and API routes.

1. Build the project:
```bash
npm run build
```

2. Deploy with Wrangler:
```bash
wrangler pages deploy .next/static --project-name=biciantro
```

Or use Git integration:
- Connect your GitHub repo to Cloudflare Pages
- Build command: `npm run build`
- Build output directory: `.next/static`
- Root directory: `/`

#### Option B: Cloudflare Workers (Full Edge)

For complete edge deployment with better serverless support.

1. Install adapter:
```bash
npm install @cloudflare/next-on-pages
```

2. Update build script in `package.json`:
```json
{
  "scripts": {
    "build:worker": "next-on-pages"
  }
}
```

3. Create `functions/[[path]].ts`:
```typescript
// functions/[[path]].ts
export { default } from '@cloudflare/next-on-pages'
```

4. Deploy:
```bash
npm run build:worker
wrangler deploy
```

### 6. Post-Deployment Configuration

#### Update OAuth Redirect URIs

After deployment, update your OAuth providers:

**Google Cloud Console:**
- Add production redirect URI: `https://your-domain.com/api/auth/callback/google`

**Apple Developer:**
- Update return URLs in Services ID configuration

#### Update Better-Auth Base URL

Ensure `BETTER_AUTH_URL` matches your production domain.

### 7. Troubleshooting Common Issues

#### Issue: Database connection fails
- Check if DATABASE_URL is properly set as a secret
- Verify connection string format
- Ensure database allows connections from Cloudflare IP ranges

#### Issue: OAuth callback fails
- Verify redirect URIs match exactly (including https)
- Check that BETTER_AUTH_URL is set correctly
- Ensure cookies are properly configured for your domain

#### Issue: Server Actions fail
- Update `allowedOrigins` in next.config.mjs with your production domain
- Check CORS headers if making cross-origin requests

#### Issue: Node.js dependencies fail
- Enable `nodejs_compat` in wrangler.toml
- Use `compatibility_flags = ["nodejs_compat"]`
- Some packages may need polyfills

### 8. Monitoring & Logs

View logs:
```bash
wrangler tail
```

Monitor in Cloudflare Dashboard:
- Real-time logs
- Analytics
- Error tracking

### 9. Security Checklist

- [ ] All secrets stored in Cloudflare (not in code)
- [ ] HTTPS enforced
- [ ] CSP headers configured
- [ ] Rate limiting enabled
- [ ] CORS properly configured
- [ ] Database connections secured
- [ ] Session cookies secure & httpOnly

---

## Quick Deployment Commands

```bash
# Setup
npm install -g wrangler
wrangler login

# Set secrets
wrangler secret put DATABASE_URL
wrangler secret put BETTER_AUTH_SECRET
wrangler secret put GOOGLE_CLIENT_ID
wrangler secret put GOOGLE_CLIENT_SECRET
wrangler secret put RESEND_API_KEY

# Build & Deploy (Pages)
npm run build
wrangler pages deploy .next/static

# Build & Deploy (Workers)
npm run build:worker
wrangler deploy

# Monitor
wrangler tail
```

---

## Additional Resources

- [Better Auth Documentation](https://www.better-auth.com/docs)
- [Cloudflare Pages Documentation](https://developers.cloudflare.com/pages/)
- [Cloudflare Workers Documentation](https://developers.cloudflare.com/workers/)
- [Google OAuth 2.0 Guide](https://developers.google.com/identity/protocols/oauth2)
- [Apple Sign In Documentation](https://developer.apple.com/sign-in-with-apple/)
