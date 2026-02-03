# Pre-Deployment Checklist

## OAuth Configuration

### Google OAuth
- [ ] Created Google Cloud project
- [ ] Configured OAuth consent screen
- [ ] Created OAuth 2.0 Client ID (Web application type)
- [ ] Added authorized JavaScript origins:
  - [ ] `http://localhost:3000` (development)
  - [ ] `https://your-domain.com` (production)
- [ ] Added authorized redirect URIs:
  - [ ] `http://localhost:3000/api/auth/callback/google`
  - [ ] `https://your-domain.com/api/auth/callback/google`
- [ ] Copied Client ID and Client Secret
- [ ] Set `GOOGLE_CLIENT_ID` in Cloudflare secrets
- [ ] Set `GOOGLE_CLIENT_SECRET` in Cloudflare secrets

### Apple OAuth (Optional)
- [ ] Created App ID with "Sign in with Apple" capability
- [ ] Created Services ID with web domain configured
- [ ] Generated private key (.p8 file)
- [ ] Generated client secret JWT
- [ ] Set all Apple environment variables in Cloudflare

## Environment Variables

### Required for Cloudflare
- [ ] `DATABASE_URL` - PostgreSQL connection string
- [ ] `BETTER_AUTH_SECRET` - Random 32+ character secret
- [ ] `BETTER_AUTH_URL` - Production domain (https://...)
- [ ] `NEXT_PUBLIC_BETTER_AUTH_URL` - Same as BETTER_AUTH_URL
- [ ] `GOOGLE_CLIENT_ID` - From Google Cloud Console
- [ ] `GOOGLE_CLIENT_SECRET` - From Google Cloud Console
- [ ] `RESEND_API_KEY` - For password reset emails

### Optional
- [ ] `APPLE_CLIENT_ID` - If using Apple Sign In
- [ ] `APPLE_CLIENT_SECRET` - Generated JWT secret
- [ ] `APPLE_TEAM_ID` - Apple Developer Team ID
- [ ] `APPLE_KEY_ID` - Apple private key ID

## Code Changes

- [ ] Updated `next.config.mjs` with:
  - [ ] `output: 'standalone'`
  - [ ] Production domain in `allowedOrigins`
- [ ] Created `wrangler.toml` with proper configuration
- [ ] Verified all secrets are set via Wrangler (not in code)

## Database Preparation

### Option A: External PostgreSQL (Keep Current)
- [ ] Database accessible from Cloudflare IP ranges
- [ ] Connection string uses connection pooling
- [ ] SSL/TLS enabled for database connections
- [ ] Tested connection from serverless environment

### Option B: Cloudflare D1 (Migration)
- [ ] Created D1 database
- [ ] Migrated schema from PostgreSQL to SQLite
- [ ] Updated auth configuration to use D1 adapter
- [ ] Tested all database operations

## Pre-Deployment Testing

- [ ] `npm run build` completes successfully locally
- [ ] All tests pass: `npm run test`
- [ ] E2E tests pass: `npm run test:e2e`
- [ ] OAuth login works in development
- [ ] Password reset emails work
- [ ] All API routes respond correctly

## Cloudflare Setup

- [ ] Installed Wrangler CLI: `npm install -g wrangler`
- [ ] Logged in: `wrangler login`
- [ ] Created Pages/Workers project in Cloudflare Dashboard
- [ ] Set all secrets using `wrangler secret put`
- [ ] Verified `wrangler.toml` configuration

## Deployment

- [ ] Built project: `npm run build`
- [ ] Deployed to Cloudflare: `wrangler pages deploy` or `wrangler deploy`
- [ ] Verified deployment URL is accessible
- [ ] Checked Cloudflare logs: `wrangler tail`

## Post-Deployment Verification

- [ ] Site loads at production URL
- [ ] OAuth login redirects work correctly
- [ ] Google OAuth callback succeeds
- [ ] Sessions persist correctly
- [ ] Database connections are stable
- [ ] Email functionality works (password reset)
- [ ] All images/assets load correctly
- [ ] SSL certificate is valid
- [ ] Mobile responsive design works

## Security Checks

- [ ] No secrets exposed in build output
- [ ] HTTPS enforced on all routes
- [ ] Cookies are secure and httpOnly
- [ ] CORS headers properly configured
- [ ] Rate limiting enabled (if applicable)
- [ ] Content Security Policy headers set
- [ ] Database connections use SSL

## Rollback Plan

- [ ] Documented previous working version
- [ ] Database backup created before deployment
- [ ] Can revert to previous deployment quickly
- [ ] Monitoring alerts configured

## Documentation

- [ ] Updated README with deployment instructions
- [ ] Documented environment variables
- [ ] Recorded OAuth configuration steps
- [ ] Saved Cloudflare Dashboard URLs
- [ ] Noted any custom domain configuration

---

## Quick Commands Reference

```bash
# Set all secrets
wrangler secret put DATABASE_URL
wrangler secret put BETTER_AUTH_SECRET
wrangler secret put BETTER_AUTH_URL
wrangler secret put NEXT_PUBLIC_BETTER_AUTH_URL
wrangler secret put GOOGLE_CLIENT_ID
wrangler secret put GOOGLE_CLIENT_SECRET
wrangler secret put RESEND_API_KEY

# Build and deploy
npm run build
wrangler pages deploy .next/static

# Monitor
wrangler tail
```

---

## Emergency Contacts

- Cloudflare Support: https://support.cloudflare.com
- Better Auth Discord: https://discord.gg/better-auth
- Google Cloud Support: https://cloud.google.com/support
