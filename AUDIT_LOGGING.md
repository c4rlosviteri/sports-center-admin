# Audit Logging System

## Overview
Comprehensive audit logging system to track all administrative actions in the Biciantro platform. All actions are logged to the `admin_action_logs` table for compliance and debugging purposes.

## Database Schema
```sql
CREATE TABLE admin_action_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
  action_type VARCHAR(20) NOT NULL,  -- 'create', 'update', 'delete'
  entity_type VARCHAR(50) NOT NULL,  -- 'user', 'class', 'class_package_template', 'user_class_package', 'booking'
  entity_id UUID,  -- The ID of the affected entity
  description TEXT NOT NULL,
  metadata JSONB,  -- Additional context data
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);
```

## Implementation

### Core Function
Location: `/src/lib/audit.ts`

```typescript
export async function logAdminAction(
  adminId: string,
  actionType: 'create' | 'update' | 'delete',
  entityType: string,
  entityId: string | null,
  description: string,
  metadata?: Record<string, any>
)
```

### Logged Actions

#### User Management
- **updateUserRole**: Tracks role changes with previous and new role
- **deleteUser**: Records user deletion with deleted user's role
- **createAdminUser**: Logs creation of new admin user accounts

#### Package Templates
- **createPackageTemplate**: Records new package creation with name, rules, and price
- **updatePackageTemplate**: Tracks package modifications
- **togglePackageStatus**: Logs activation/deactivation of packages

#### Classes
- **createClass**: Records class creation with name, instructor, schedule, and capacity
- **updateClass**: Tracks class modifications
- **deleteClass**: Logs class deletion

#### User Packages
- **createUserPackage**: Records package assignment to user accounts
- **extendPackage**: Logs package extensions with additional days
- **updatePackageClasses**: Tracks changes to remaining class credits
- **deactivatePackage**: Records package deactivation

#### Bookings
- **adminRemoveBooking**: Logs admin removal of user accounts from classes

## Metadata Examples

### User Role Update
```json
{
  "newRole": "admin",
  "previousRole": "client"
}
```

### Package Creation
```json
{
  "name": "Paquete Mensual",
  "classCount": 12,
  "validityType": "months",
  "validityPeriod": 1,
  "price": 100
}
```

### Class Creation
```json
{
  "name": "Spinning Matutino",
  "instructor": "Juan Pérez",
  "scheduledAt": "2026-01-24T07:00:00Z",
  "capacity": 20
}
```

### Package Extension
```json
{
  "additionalDays": 30
}
```

## Querying Audit Logs

### Get all actions by a specific admin
```sql
SELECT * FROM admin_action_logs 
WHERE admin_id = '<admin_uuid>' 
ORDER BY created_at DESC;
```

### Get all actions for a specific entity
```sql
SELECT * FROM admin_action_logs 
WHERE entity_type = 'user' AND entity_id = '<user_uuid>'
ORDER BY created_at DESC;
```

### Get recent deletions
```sql
SELECT * FROM admin_action_logs 
WHERE action_type = 'delete' 
ORDER BY created_at DESC 
LIMIT 50;
```

### Get actions with specific metadata
```sql
SELECT * FROM admin_action_logs 
WHERE metadata @> '{"newRole": "admin"}'::jsonb
ORDER BY created_at DESC;
```

## Field Access Pattern (pgtyped)

**IMPORTANT**: Despite `pgtyped.config.json` having `camelCaseColumnNames: true`, actual query results return **snake_case** field names.

### Always use snake_case when accessing query results:
```typescript
// ✅ CORRECT
const name = row.first_name
const date = row.scheduled_at
const count = row.bookings_count

// ❌ INCORRECT
const name = row.firstName
const date = row.scheduledAt
const count = row.bookingsCount
```

### Verified Files
All database field access has been verified in:
- `/src/actions/admin.ts` - All snake_case ✅
- `/src/actions/classes.ts` - All snake_case ✅
- `/src/actions/auth.ts` - All snake_case ✅
- `/src/actions/bookings.ts` - All snake_case ✅
- `/src/actions/dashboard.ts` - All snake_case ✅ (Fixed in previous session)

## Testing Recommendations

1. **Create a test user and perform actions**: Verify logs are created
2. **Check metadata accuracy**: Ensure all relevant context is captured
3. **Test error scenarios**: Verify logging doesn't break on failures
4. **Performance testing**: Ensure logging doesn't significantly impact response times
5. **Query performance**: Add indexes if audit log queries are slow

## Future Enhancements

- [ ] Add admin dashboard page to view audit logs
- [ ] Implement log rotation/archiving for old entries
- [ ] Add filtering and search capabilities
- [ ] Export logs to CSV for compliance reports
- [ ] Add alerts for suspicious activity patterns
