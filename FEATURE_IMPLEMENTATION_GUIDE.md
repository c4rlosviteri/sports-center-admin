# Feature Implementation Guide

This guide walks you through implementing the 4 new features added to Biciantro.

## Prerequisites

- PostgreSQL database running
- All previous migrations applied
- PGTyped installed: `npm install -D @pgtyped/cli`

## Implementation Steps

### Step 1: Run Database Migrations

The following migrations add all necessary tables, indexes, and PostgreSQL functions:

```bash
# Run migrations 003-006
./db/run-migrations.sh
```

Migrations applied:
- **003_add_attendance_tracking.sql** - Attendance records, no-show penalties, late cancellation fees
- **004_add_recurring_classes.sql** - Recurring class templates, holiday exceptions, auto-generation
- **005_add_analytics_reports.sql** - Analytics cache, materialized views, client activity log
- **006_add_waitlist_management.sql** - Waitlist notifications, offers, notification preferences

### Step 2: Generate PGTyped Types

After migrations are applied, regenerate TypeScript types from the SQL queries:

```bash
npx pgtyped -c pgtyped.config.json
```

This will generate:
- `src/db/queries/attendance.queries.ts`
- `src/db/queries/recurring-classes.queries.ts`
- `src/db/queries/analytics.queries.ts`
- `src/db/queries/waitlist.queries.ts`

### Step 3: Create Action Files

Create action files that use the generated PGTyped queries:

#### 3.1 Attendance Actions

**File:** `src/actions/attendance.ts`

Key functions to implement:
- `markAttendance(bookingId, userId, status, markedBy, notes)` - Mark user attendance
- `getClassAttendance(classId, branchId)` - Get all attendance for a class
- `getUserAttendanceHistory(userId, branchId, limit)` - Get user's attendance history
- `getNoShowStats(userId, branchId)` - Get user's no-show statistics
- `createNoShowPenalty(userId, branchId, noShowCount, penaltyType, days)` - Apply penalty
- `getActivePenalties(userId, branchId)` - Check if user has active penalties
- `createLateCancellationFee(bookingId, userId, classId, feeAmount)` - Record late fee
- `getOutstandingFees(userId, branchId)` - Get unpaid fees
- `markFeeAsPaid(feeId, branchId)` - Mark fee as paid

#### 3.2 Recurring Classes Actions

**File:** `src/actions/recurring-classes.ts`

Key functions to implement:
- `createRecurringTemplate(templateData)` - Create new template
- `getRecurringTemplates(branchId)` - List all templates
- `updateRecurringTemplate(templateId, templateData)` - Update template
- `generateClassesFromTemplate(templateId, startDate, endDate, generatedBy)` - Generate classes
- `autoGenerateNextMonth()` - Auto-generate next month's classes (cron job)
- `createHolidayException(branchId, date, name)` - Add holiday
- `getHolidayExceptions(branchId, startDate, endDate)` - List holidays
- `bulkUpdateTemplateClasses(templateId, instructor, capacity)` - Bulk edit
- `getTemplateStats(branchId)` - Get utilization stats

#### 3.3 Analytics Actions

**File:** `src/actions/analytics.ts`

Key functions to implement:
- `getRevenueTrend(branchId, period, daysBack)` - Revenue trends by day/week/month
- `getClassUtilizationHeatmap(branchId, daysBack)` - Heatmap by day/hour
- `getInstructorPerformance(branchId, daysBack)` - Instructor metrics
- `getClientRetentionAnalysis(branchId)` - Retention by cohort
- `getClientChurnAnalysis(branchId)` - Churn rates
- `getMembershipConversionMetrics(branchId, daysBack)` - Conversion funnel
- `getPeakHoursAnalysis(branchId, daysBack)` - Best times for classes
- `getClientLifetimeValue(branchId, limit)` - Top clients by LTV
- `refreshAnalyticsViews()` - Refresh materialized views (cron job)
- `logClientActivity(userId, branchId, activityType, metadata)` - Track user actions

#### 3.4 Waitlist Actions

**File:** `src/actions/waitlist.ts`

Key functions to implement:
- `offerWaitlistSpot(classId, branchId)` - Offer spot to next person (calls PostgreSQL function)
- `acceptWaitlistOffer(offerId, userId, branchId)` - User accepts offer
- `declineWaitlistOffer(offerId, userId, branchId)` - User declines offer
- `handleExpiredOffers()` - Auto-escalate expired offers (cron job)
- `getPendingOffers(branchId)` - List all pending offers
- `getUserOffers(userId, branchId)` - Get user's offer history
- `getWaitlistQueue(classId, branchId)` - See waitlist order
- `getWaitlistStats(branchId, startDate, endDate)` - Waitlist analytics
- `createNotification(bookingId, userId, type, sentVia)` - Send notification
- `getUserNotificationPreferences(userId)` - Get user's notification settings
- `updateNotificationPreferences(userId, preferences)` - Update settings

### Step 4: Create UI Components

#### 4.1 Attendance Tracking UI

**Location:** `src/app/(dashboard)/admin/classes/[classId]/attendance/`

Components needed:
- `attendance-page.tsx` - Main attendance marking interface
- `attendance-table.tsx` - Table showing all bookings with status checkboxes
- `no-show-penalty-dialog.tsx` - Dialog to apply penalties
- `late-cancellation-fee-dialog.tsx` - Dialog to record fees

**Location:** `src/app/(dashboard)/admin/reports/attendance/`

Components needed:
- `attendance-report.tsx` - Attendance statistics and trends
- `user-attendance-history.tsx` - Individual user attendance history

#### 4.2 Recurring Classes UI

**Location:** `src/app/(dashboard)/admin/recurring-classes/`

Components needed:
- `recurring-classes-page.tsx` - List all templates
- `create-template-dialog.tsx` - Create new template
- `edit-template-dialog.tsx` - Edit existing template
- `generate-classes-dialog.tsx` - Generate classes from template
- `holiday-exceptions-dialog.tsx` - Manage holidays
- `template-stats.tsx` - Show utilization stats per template

#### 4.3 Analytics Dashboard UI

**Location:** `src/app/(dashboard)/admin/analytics/`

Components needed:
- `analytics-dashboard.tsx` - Main dashboard with all charts
- `revenue-chart.tsx` - Line chart showing revenue trends
- `utilization-heatmap.tsx` - Heatmap showing class popularity by day/hour
- `instructor-performance-table.tsx` - Table with instructor metrics
- `retention-chart.tsx` - Cohort retention chart
- `conversion-funnel.tsx` - Membership conversion funnel
- `peak-hours-chart.tsx` - Bar chart showing peak hours
- `client-ltv-table.tsx` - Top clients by lifetime value

Charts library recommendation: [Recharts](https://recharts.org/) or [Chart.js](https://www.chartjs.org/)

#### 4.4 Waitlist Management UI

**Location:** `src/app/(dashboard)/admin/classes/[classId]/waitlist/`

Components needed:
- `waitlist-queue.tsx` - Show waitlist order
- `waitlist-offers-table.tsx` - Show pending/expired offers
- `offer-spot-button.tsx` - Manual offer trigger
- `waitlist-stats.tsx` - Waitlist acceptance stats

**Location:** `src/app/(dashboard)/client/waitlist/`

Components needed:
- `my-offers.tsx` - User's pending offers
- `accept-offer-dialog.tsx` - Accept offer with countdown timer
- `notification-preferences.tsx` - User notification settings

**Location:** `src/app/(dashboard)/client/settings/`

Component to add:
- `notification-preferences-form.tsx` - Edit email/SMS/push preferences

### Step 5: Set Up Scheduled Jobs

These functions should run on a schedule (use cron, Vercel Cron, or similar):

#### Daily Jobs

**Auto-generate next month's classes** (run daily at midnight):
```typescript
// In a cron handler or API route
import { autoGenerateNextMonth } from '~/actions/recurring-classes'

export async function dailyClassGeneration() {
  await autoGenerateNextMonth()
}
```

**Handle expired waitlist offers** (run every 15 minutes):
```typescript
import { handleExpiredOffers } from '~/actions/waitlist'

export async function handleExpiredWaitlistOffers() {
  const escalatedCount = await handleExpiredOffers()
  console.log(`Escalated ${escalatedCount} expired offers`)
}
```

**Refresh analytics materialized views** (run daily at 2am):
```typescript
import { refreshAnalyticsViews } from '~/actions/analytics'

export async function refreshAnalytics() {
  await refreshAnalyticsViews()
}
```

### Step 6: Set Up Notification System

Waitlist management requires email/SMS notifications. Options:

1. **Email:** Use [Resend](https://resend.com/) or [SendGrid](https://sendgrid.com/)
2. **SMS:** Use [Twilio](https://www.twilio.com/) or [Vonage](https://www.vonage.com/)

Create notification service:

**File:** `src/services/notifications.ts`

```typescript
export async function sendWaitlistOfferNotification(
  userId: string,
  classId: string,
  offerId: string,
  expiresAt: Date
) {
  // Get user contact info and preferences
  // Send email/SMS based on preferences
  // Include accept/decline links
}

export async function sendReminderNotification(
  userId: string,
  offerId: string,
  hoursRemaining: number
) {
  // Send reminder before offer expires
}

export async function sendOfferExpiredNotification(
  userId: string,
  classId: string
) {
  // Notify user that offer expired
}
```

### Step 7: Add API Routes

Create API routes for client-facing actions:

**File:** `src/app/api/waitlist/accept/route.ts`
```typescript
// POST /api/waitlist/accept
// Accept a waitlist offer
```

**File:** `src/app/api/waitlist/decline/route.ts`
```typescript
// POST /api/waitlist/decline
// Decline a waitlist offer
```

**File:** `src/app/api/analytics/refresh/route.ts`
```typescript
// POST /api/analytics/refresh
// Trigger analytics refresh (protected route)
```

## Testing Checklist

After implementation:

### Attendance Tracking
- [ ] Admin can mark attendance for a class
- [ ] No-show penalties are automatically applied after threshold
- [ ] Late cancellation fees are calculated correctly
- [ ] Users with active penalties cannot book classes
- [ ] Attendance stats show correct percentages

### Recurring Classes
- [ ] Templates can be created with all required fields
- [ ] Classes are generated for correct dates
- [ ] Holiday exceptions prevent class generation
- [ ] Bulk updates affect only future classes
- [ ] Template stats show accurate utilization

### Analytics Dashboard
- [ ] Revenue charts show correct trends
- [ ] Utilization heatmap displays properly
- [ ] Instructor metrics are accurate
- [ ] Retention cohorts calculate correctly
- [ ] Conversion funnel shows drop-off points
- [ ] Materialized views refresh successfully

### Waitlist Management
- [ ] Spot offers are sent to next person automatically
- [ ] Offers expire after configured time
- [ ] Accepting offer promotes booking to confirmed
- [ ] Declining offer escalates to next person
- [ ] Email/SMS notifications are sent
- [ ] User preferences are respected
- [ ] Countdown timer shows remaining time
- [ ] Stats show acceptance rates

## Performance Considerations

1. **Analytics Materialized Views** - Refresh during off-peak hours
2. **Waitlist Checks** - Index on `expires_at` for fast queries
3. **Activity Logging** - Consider archiving old logs (>6 months)
4. **Cron Jobs** - Monitor execution time and errors
5. **Notification Queue** - Use queue system for high volume

## Migration Notes

- All migrations are idempotent and can be re-run safely
- Existing data is preserved - no destructive changes
- Foreign keys ensure referential integrity
- Indexes are added for query performance
- PostgreSQL functions handle complex business logic

## Support

For questions or issues, refer to:
- [Database Migrations Guide](db/MIGRATIONS.md)
- [PGTyped Documentation](https://pgtyped.dev/)
- [Quick Start Guide](QUICK_START_MIGRATIONS.md)

---

**Last Updated:** 2026-01-24
**Status:** Ready for implementation
