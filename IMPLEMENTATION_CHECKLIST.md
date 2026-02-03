# Implementation Checklist

Quick checklist to implement the 4 new features.

## Prerequisites

- [ ] PostgreSQL database is running
- [ ] Previous migrations (000-002) have been applied
- [ ] PGTyped is installed (`@pgtyped/cli` in devDependencies)

## Step 1: Run Migrations

```bash
./db/run-migrations.sh
```

**Expected output:**
```
✓ Running migration: 003_add_attendance_tracking.sql
✓ Running migration: 004_add_recurring_classes.sql
✓ Running migration: 005_add_analytics_reports.sql
✓ Running migration: 006_add_waitlist_management.sql
```

**Verify migrations:**
```bash
psql postgres://localhost:5432/biciantro -c "
  SELECT version, name, success FROM schema_migrations
  WHERE version IN ('003', '004', '005', '006')
  ORDER BY version;
"
```

- [ ] Migrations 003-006 all show `success = true`

## Step 2: Generate TypeScript Types

```bash
npx pgtyped -c pgtyped.config.json
```

**Verify generated files:**
```bash
ls -l src/db/queries/*.queries.ts | grep -E "(attendance|recurring|analytics|waitlist)"
```

- [ ] `attendance.queries.ts` exists
- [ ] `recurring-classes.queries.ts` exists
- [ ] `analytics.queries.ts` exists
- [ ] `waitlist.queries.ts` exists

## Step 3: Implement Action Files

For each action file, uncomment imports and implement functions:

### Attendance Actions
- [ ] Open `src/actions/attendance.ts`
- [ ] Uncomment `import * as attendance from '~/db/queries/attendance.queries'`
- [ ] Replace `throw new Error(...)` with actual implementations
- [ ] Test with `markAttendance()` first
- [ ] Verify TypeScript has no errors: `npx tsc --noEmit`

### Recurring Classes Actions
- [ ] Open `src/actions/recurring-classes.ts`
- [ ] Uncomment import statement
- [ ] Implement `createRecurringTemplate()` first
- [ ] Test template creation
- [ ] Implement `generateClassesFromTemplate()`
- [ ] Test class generation

### Analytics Actions
- [ ] Open `src/actions/analytics.ts`
- [ ] Uncomment import statement
- [ ] Implement `getDailyRevenue()` first
- [ ] Test with date range
- [ ] Implement other metrics gradually

### Waitlist Actions
- [ ] Open `src/actions/waitlist.ts`
- [ ] Uncomment import statement
- [ ] Implement `offerWaitlistSpot()` first
- [ ] Set up notification service (see Step 5)
- [ ] Test offer creation and acceptance

## Step 4: Create UI Components

### Admin Attendance Interface
**Location:** `src/app/(dashboard)/admin/classes/[classId]/attendance/`

- [ ] Create `page.tsx` - Attendance marking page
- [ ] Create `attendance-table.tsx` - Table with checkboxes
- [ ] Add route in navigation

**Test:**
- [ ] Admin can view class bookings
- [ ] Admin can mark attendance (present/absent/late/excused)
- [ ] Attendance saves correctly
- [ ] No-show stats update

### Recurring Classes Management
**Location:** `src/app/(dashboard)/admin/recurring-classes/`

- [ ] Create `page.tsx` - List templates
- [ ] Create `create-template-dialog.tsx` - Create form
- [ ] Create `edit-template-dialog.tsx` - Edit form
- [ ] Create `generate-classes-dialog.tsx` - Generation form
- [ ] Add route in admin navigation

**Test:**
- [ ] Can create template
- [ ] Template saves with correct day/time
- [ ] Can generate classes for date range
- [ ] Generated classes appear in calendar
- [ ] Holiday exceptions prevent generation

### Analytics Dashboard
**Location:** `src/app/(dashboard)/admin/analytics/`

Install chart library:
```bash
npm install recharts
npm install -D @types/recharts
```

- [ ] Create `page.tsx` - Main dashboard
- [ ] Create `revenue-chart.tsx` - Line chart
- [ ] Create `utilization-heatmap.tsx` - Heatmap
- [ ] Create `instructor-performance-table.tsx` - Table
- [ ] Add route in admin navigation

**Test:**
- [ ] Revenue chart shows data
- [ ] Heatmap displays correctly
- [ ] Filters work (date range, period)
- [ ] Data refreshes properly

### Waitlist Management
**Location:** `src/app/(dashboard)/admin/classes/[classId]/waitlist/`

- [ ] Create `waitlist-queue.tsx` - Show queue
- [ ] Add to class details page
- [ ] Create offer button/functionality

**Location:** `src/app/(dashboard)/client/waitlist/`

- [ ] Create `page.tsx` - My offers
- [ ] Create `accept-offer-dialog.tsx` - Accept with countdown
- [ ] Add route in client navigation

**Location:** `src/app/(dashboard)/client/settings/`

- [ ] Add `notification-preferences-form.tsx`
- [ ] Integrate into settings page

**Test:**
- [ ] User receives waitlist offer
- [ ] Countdown timer shows correctly
- [ ] Accept promotes to confirmed
- [ ] Decline escalates to next person
- [ ] Preferences save correctly

## Step 5: Set Up Notification System

### Choose Email Provider

**Option A: Resend (Recommended)**
```bash
npm install resend
```

**Option B: SendGrid**
```bash
npm install @sendgrid/mail
```

### Create Notification Service
- [ ] Create `src/services/notifications.ts`
- [ ] Implement `sendWaitlistOfferEmail()`
- [ ] Implement `sendWaitlistOfferSMS()` (optional)
- [ ] Test sending notifications

### Add Environment Variables
Add to `.env.local`:
```env
# Email Service
RESEND_API_KEY=your_key_here
# or
SENDGRID_API_KEY=your_key_here

# SMS Service (optional)
TWILIO_ACCOUNT_SID=your_sid
TWILIO_AUTH_TOKEN=your_token
TWILIO_PHONE_NUMBER=+1234567890
```

- [ ] Environment variables added
- [ ] Test email sending
- [ ] Test SMS sending (if applicable)

## Step 6: Set Up Scheduled Jobs

### Using Vercel Cron

Create `vercel.json` in project root:
```json
{
  "crons": [
    {
      "path": "/api/cron/generate-classes",
      "schedule": "0 0 * * *"
    },
    {
      "path": "/api/cron/handle-waitlist",
      "schedule": "*/15 * * * *"
    },
    {
      "path": "/api/cron/refresh-analytics",
      "schedule": "0 2 * * *"
    }
  ]
}
```

### Create API Routes

**Daily Class Generation:**
- [ ] Create `src/app/api/cron/generate-classes/route.ts`
- [ ] Call `autoGenerateNextMonth()`
- [ ] Add authentication check

**Waitlist Handling (every 15 min):**
- [ ] Create `src/app/api/cron/handle-waitlist/route.ts`
- [ ] Call `handleExpiredOffers()`
- [ ] Add authentication check

**Analytics Refresh (daily at 2am):**
- [ ] Create `src/app/api/cron/refresh-analytics/route.ts`
- [ ] Call `refreshAnalyticsViews()`
- [ ] Add authentication check

**Test locally:**
```bash
# Test class generation
curl -X POST http://localhost:3000/api/cron/generate-classes

# Test waitlist handling
curl -X POST http://localhost:3000/api/cron/handle-waitlist

# Test analytics refresh
curl -X POST http://localhost:3000/api/cron/refresh-analytics
```

## Step 7: Testing

### Attendance Tracking
- [ ] Create a test class with bookings
- [ ] Mark some as present, some as absent
- [ ] Check attendance records in database
- [ ] Verify no-show stats calculate correctly
- [ ] Test penalty creation after threshold
- [ ] Test late cancellation fee

### Recurring Classes
- [ ] Create a template for Monday 6pm
- [ ] Generate classes for next month
- [ ] Verify classes created on correct dates
- [ ] Add a holiday exception
- [ ] Regenerate - verify holiday skipped
- [ ] Test bulk update

### Analytics
- [ ] Create some test payments
- [ ] Create test bookings
- [ ] Refresh materialized views
- [ ] Check revenue chart shows data
- [ ] Check utilization heatmap
- [ ] Verify instructor stats

### Waitlist
- [ ] Fill a class to capacity
- [ ] Add users to waitlist
- [ ] Cancel a confirmed booking
- [ ] Verify spot offered to first in line
- [ ] Accept offer - verify promotion
- [ ] Let offer expire - verify escalation

## Step 8: Production Deployment

### Database
- [ ] Backup production database
- [ ] Run migrations on production
- [ ] Verify no errors

### Application
- [ ] Deploy updated code
- [ ] Verify environment variables set
- [ ] Test cron jobs trigger correctly
- [ ] Monitor error logs

### Monitoring
- [ ] Set up alerts for failed cron jobs
- [ ] Monitor notification delivery rate
- [ ] Check analytics view refresh time
- [ ] Monitor waitlist acceptance rate

## Troubleshooting

### Migrations fail
```bash
# Check which migrations ran
psql postgres://localhost:5432/biciantro -c "SELECT * FROM schema_migrations ORDER BY version;"

# Check for errors
./db/run-migrations.sh 2>&1 | grep -i error
```

### PGTyped fails
```bash
# Check database connection
psql postgres://localhost:5432/biciantro -c "SELECT 1;"

# Verify tables exist
psql postgres://localhost:5432/biciantro -c "\dt"

# Re-run PGTyped with verbose output
npx pgtyped -c pgtyped.config.json 2>&1 | tee pgtyped.log
```

### TypeScript errors
```bash
# Check for errors
npx tsc --noEmit

# Regenerate types
npx pgtyped -c pgtyped.config.json
```

### Cron jobs not running
- Check Vercel logs for cron execution
- Verify API routes return 200 status
- Check authentication is working
- Ensure environment variables are set

## Quick Reference

### Useful Commands

```bash
# Run migrations
./db/run-migrations.sh

# Generate types
npx pgtyped -c pgtyped.config.json

# Check TypeScript
npx tsc --noEmit

# Run dev server
npm run dev

# Check migration status
psql postgres://localhost:5432/biciantro -c "SELECT version, name, success FROM schema_migrations ORDER BY version;"

# Manually refresh analytics
psql postgres://localhost:5432/biciantro -c "SELECT refresh_analytics_views();"

# Check waitlist offers
psql postgres://localhost:5432/biciantro -c "SELECT * FROM waitlist_offers WHERE status = 'pending';"
```

## Resources

- [Feature Implementation Guide](FEATURE_IMPLEMENTATION_GUIDE.md) - Detailed guide
- [New Features Summary](NEW_FEATURES_SUMMARY.md) - Overview of all changes
- [Database Migrations Guide](db/MIGRATIONS.md) - Migration best practices
- [Quick Start](QUICK_START_MIGRATIONS.md) - Migration quick reference

---

**When everything is checked off, all 4 features will be fully implemented! 🎉**
