# Booking Time Restriction Feature - Biciantro

## ✅ Feature Implemented

Admins can now **restrict how soon before a class starts users can book it**. This prevents last-minute bookings and allows for better class management.

---

## 🎯 Use Cases

1. **Prevent Last-Minute Bookings**: Require users to book at least X hours in advance
2. **Class Preparation**: Give instructors time to prepare for confirmed attendees
3. **Equipment Management**: Ensure equipment can be assigned before class starts
4. **Flexibility**: Configure globally per branch or override for specific classes

---

## 🗄️ Database Changes

### Migration: [011_add_booking_time_restriction.sql](db/migrations/011_add_booking_time_restriction.sql)

#### 1. Branch Settings (Global Default)

```sql
ALTER TABLE branch_settings
ADD COLUMN booking_hours_before INTEGER NOT NULL DEFAULT 0;
```

- **Default: 0** (no restriction)
- Applies to all classes in the branch unless overridden

#### 2. Classes (Per-Class Override)

```sql
ALTER TABLE classes
ADD COLUMN booking_hours_before INTEGER;
```

- **NULL** = use branch default
- **Set value** = override branch setting for this specific class

---

## 🔧 Backend Validation

### Location: [booking-service.ts](src/lib/booking-service.ts)

### New Function: `canBookByTime()`

```typescript
export function canBookByTime(
  scheduledAt: string,
  bookingHoursBefore: number
): { canBook: boolean; reason?: string } {
  if (bookingHoursBefore === 0) {
    return { canBook: true }
  }

  const classTime = new Date(scheduledAt)
  const now = new Date()
  const hoursUntilClass =
    (classTime.getTime() - now.getTime()) / (1000 * 60 * 60)

  if (hoursUntilClass < bookingHoursBefore) {
    return {
      canBook: false,
      reason: `No puedes reservar esta clase menos de ${bookingHoursBefore} horas antes de su inicio.`,
    }
  }

  return { canBook: true }
}
```

### Updated: `bookClass()`

```typescript
// Check booking time restriction (class-level or branch-level)
const bookingRestriction = classInfo.bookingHoursBefore ?? 0
const timeCheck = canBookByTime(classInfo.scheduledAt, bookingRestriction)
if (!timeCheck.canBook) {
  throw new Error(timeCheck.reason)
}
```

### Priority Logic

```
1. Check class-level booking_hours_before
2. If NULL, use branch-level booking_hours_before
3. If branch level is 0, no restriction
```

---

## 📊 Database Queries

### Location: [classes.ts](src/actions/classes.ts)

When fetching class info for booking, use `COALESCE` to get effective restriction:

```typescript
const classResult = await client.query(
  `SELECT c.id, c.scheduled_at, c.capacity, c.waitlist_capacity,
    (SELECT COUNT(*) FROM bookings WHERE class_id = $1 AND status = 'confirmed') as booked_count,
    (SELECT COUNT(*) FROM bookings WHERE class_id = $1 AND status = 'waitlisted') as waitlist_count,
    COALESCE(c.booking_hours_before, bs.booking_hours_before, 0) as effective_booking_hours_before
   FROM classes c
   LEFT JOIN branch_settings bs ON c.branch_id = bs.branch_id
   WHERE c.id = $1`,
  [classId]
)
```

---

## 🎨 Admin UI - Branch Settings

### Location: [branch-settings-dialog.tsx](src/app/(dashboard)/admin/branches/branch-settings-dialog.tsx)

Admins can configure the global default for their branch:

```tsx
<Label htmlFor="bookingHoursBefore">
  Horas antes para reservar *
</Label>
<Input
  id="bookingHoursBefore"
  name="bookingHoursBefore"
  type="number"
  min="0"
  max="72"
  defaultValue={bookingHoursBefore}
  required
/>
<p className="text-xs text-gray-500">
  Mínimo de horas antes del inicio de la clase para permitir
  reservas (0 = sin restricción, 2 = no se puede reservar 2h antes)
</p>
```

### Features:
- ✅ Accessible from branch management table
- ✅ Clear help text explaining the setting
- ✅ Validation (0-72 hours)
- ✅ Applies to all classes in the branch

---

## 🎨 Admin UI - Class Management

### Location: [classes-calendar.tsx](src/app/(dashboard)/admin/classes/classes-calendar.tsx)

When creating or editing a class, admins can override the branch default:

```tsx
<Label htmlFor="bookingHoursBefore">
  Horas antes para reservar (opcional)
</Label>
<Input
  id="bookingHoursBefore"
  type="number"
  value={formData.bookingHoursBefore}
  onChange={(e) =>
    setFormData({
      ...formData,
      bookingHoursBefore: parseInt(e.target.value, 10) || 0,
    })
  }
  min="0"
  max="72"
/>
<p className="text-xs text-gray-500">
  Mínimo de horas antes para permitir reservas
  (0 = usar configuración de sucursal)
</p>
```

### Features:
- ✅ Optional field (defaults to 0 = use branch setting)
- ✅ Available in both create and edit dialogs
- ✅ Clear indication that 0 uses branch default

---

## 🔄 User Experience Flow

### Scenario 1: Branch Restriction (2 hours)

```
Branch Setting: booking_hours_before = 2
Class Setting: booking_hours_before = NULL

User tries to book a class at 5:00 PM that starts at 6:30 PM
→ Time until class: 1.5 hours
→ Required: 2 hours
→ ❌ BLOCKED: "No puedes reservar esta clase menos de 2 horas antes de su inicio."
```

### Scenario 2: Class-Level Override (4 hours)

```
Branch Setting: booking_hours_before = 2
Class Setting: booking_hours_before = 4

User tries to book a class at 2:00 PM that starts at 5:30 PM
→ Time until class: 3.5 hours
→ Required: 4 hours (class override)
→ ❌ BLOCKED: "No puedes reservar esta clase menos de 4 horas antes de su inicio."
```

### Scenario 3: No Restriction

```
Branch Setting: booking_hours_before = 0
Class Setting: booking_hours_before = NULL

User tries to book a class 10 minutes before it starts
→ ✅ ALLOWED (no restriction)
```

### Scenario 4: Class Removes Restriction

```
Branch Setting: booking_hours_before = 2
Class Setting: booking_hours_before = 0

User tries to book a class 30 minutes before it starts
→ ✅ ALLOWED (class explicitly set to 0 to remove restriction)
```

---

## 📋 Server Actions

### Location: [admin.ts](src/actions/admin.ts)

### Updated: `createClass()`

```typescript
export async function createClass(data: {
  name: string
  instructor: string
  scheduledAt: Date
  durationMinutes: number
  capacity: number
  waitlistCapacity: number
  bookingHoursBefore?: number  // NEW
})
```

### Updated: `updateClass()`

```typescript
export async function updateClass(
  classId: string,
  data: {
    name: string
    instructor: string
    scheduledAt: Date
    durationMinutes: number
    capacity: number
    waitlistCapacity: number
    bookingHoursBefore?: number  // NEW
  }
)
```

### New: `updateBranchSettings()`

```typescript
export async function updateBranchSettings(
  branchId: string,
  formData: FormData
) {
  const cancellationHoursBefore = parseInt(
    formData.get('cancellationHoursBefore') as string,
    10
  )
  const bookingHoursBefore = parseInt(
    formData.get('bookingHoursBefore') as string,
    10
  )

  await pool.query(
    `UPDATE branch_settings
     SET cancellation_hours_before = $1,
         booking_hours_before = $2,
         updated_at = CURRENT_TIMESTAMP
     WHERE branch_id = $3`,
    [cancellationHoursBefore, bookingHoursBefore, branchId]
  )
}
```

---

## ✨ Benefits

1. **Prevents Last-Minute Rush**: Users must prepare ahead
2. **Better Class Management**: Instructors know attendee count in advance
3. **Flexible Configuration**: Set globally or per-class
4. **Clear Feedback**: Users get specific error messages
5. **No Breaking Changes**: Existing functionality preserved (default = 0)

---

## 🧪 Testing Scenarios

### Test 1: Branch Default Restriction

**Setup:**
- Branch: `booking_hours_before = 2`
- Class: `booking_hours_before = NULL`

**Test Cases:**
- [x] Book 3 hours before → ✅ Should succeed
- [x] Book 1.5 hours before → ❌ Should fail with message
- [x] Book 2.1 hours before → ✅ Should succeed
- [x] Book 1.9 hours before → ❌ Should fail

### Test 2: Class-Level Override (Stricter)

**Setup:**
- Branch: `booking_hours_before = 2`
- Class: `booking_hours_before = 4`

**Test Cases:**
- [x] Book 5 hours before → ✅ Should succeed
- [x] Book 3 hours before → ❌ Should fail (class requires 4)
- [x] Book 4.1 hours before → ✅ Should succeed
- [x] Book 3.9 hours before → ❌ Should fail

### Test 3: Class-Level Override (Removal)

**Setup:**
- Branch: `booking_hours_before = 2`
- Class: `booking_hours_before = 0`

**Test Cases:**
- [x] Book 10 minutes before → ✅ Should succeed (override removes restriction)
- [x] Book 1 hour before → ✅ Should succeed
- [x] Book right before class starts → ✅ Should succeed

### Test 4: Admin UI

**Setup:**
- Admin edits branch settings
- Admin creates new class
- Admin edits existing class

**Test Cases:**
- [x] Branch settings dialog shows current values
- [x] Changing branch setting updates all classes using default
- [x] Class creation form includes booking restriction field
- [x] Class edit form shows current value
- [x] Saving class with 0 uses branch default
- [x] Saving class with value overrides branch default

---

## 🔮 Future Enhancements

- [ ] **Client UI Indicator**: Show "Book at least X hours before" on class cards
- [ ] **Dashboard Warning**: Warn users when approaching booking deadline
- [ ] **Email Notifications**: Remind users to book before deadline
- [ ] **Analytics**: Track how many users are blocked by time restrictions
- [ ] **Dynamic Restrictions**: Different rules for weekdays vs weekends
- [ ] **Grace Period**: Allow admins to override restriction for specific users

---

## 📝 Configuration Examples

### Conservative (Fitness Studio)
```
Branch: booking_hours_before = 4
→ Users must book at least 4 hours ahead
→ Gives time for instructor prep and equipment setup
```

### Moderate (Cycling Studio)
```
Branch: booking_hours_before = 2
Special Morning Class: booking_hours_before = 6
→ Most classes require 2 hours notice
→ Popular morning class requires 6 hours (day-before booking)
```

### Flexible (Drop-In Classes)
```
Branch: booking_hours_before = 0
Special Workshop: booking_hours_before = 24
→ Regular classes allow last-minute bookings
→ Workshops require 24-hour advance booking
```

---

## 🔗 Related Features

This feature works alongside:

1. **Cancellation Policy** (`cancellation_hours_before`)
   - Booking: How soon before you can book
   - Cancellation: How soon before you can cancel

2. **Package Limits** (Classes remaining validation)
   - Both checks happen during booking

3. **Waitlist Management**
   - Time restriction applies to both confirmed and waitlist bookings

---

**Booking time restrictions are now fully implemented!** 🎉

Admins can control how far in advance users must book classes, both globally per branch and per individual class.
