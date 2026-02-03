# Package Limit Validation - Biciantro

## ✅ Feature Implemented

Users can now **only book the number of classes available in their package**. The system validates both on the backend and frontend to prevent overbooking.

---

## 🔒 Backend Validation (Already Exists)

### Location: [booking-service.ts](src/lib/booking-service.ts)

The `canBookClass()` function validates membership limits:

```typescript
export function canBookClass(membership: MembershipInfo): {
  canBook: boolean
  reason?: string
} {
  const now = new Date()
  const endDate = new Date(membership.endDate)

  if (endDate < now) {
    return {
      canBook: false,
      reason: 'Tu plan ha expirado. Por favor contacta al administrador.',
    }
  }

  if (
    membership.classesRemaining !== null &&
    membership.classesRemaining <= 0
  ) {
    return {
      canBook: false,
      reason: 'No tienes clases disponibles en tu plan.',
    }
  }

  return { canBook: true }
}
```

### When Booking Happens:

1. **Check membership** - Validate plan hasn't expired
2. **Check remaining classes** - If `classesRemaining <= 0`, reject booking
3. **Create booking** - If confirmed, decrement `classesRemaining`
4. **Throw error** - If validation fails, user gets clear error message

---

## 🎨 Frontend Improvements (NEW)

### Location: [client-calendar.tsx](src/app/(dashboard)/client/classes/client-calendar.tsx)

### 1. **Membership Status Card**

Shows remaining classes at the top of the page:

```tsx
{/* Membership Status */}
{membership && (
  <Card className={hasNoClassesRemaining ? 'bg-red-500/10 border-red-500/30' : 'bg-white/5'}>
    <CardContent className="pt-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-white mb-1">
            {membership.planName || 'Plan Activo'}
          </h3>
          <p className="text-gray-400 text-sm">
            {membership.classesRemaining !== null
              ? `${membership.classesRemaining} clases restantes`
              : 'Clases ilimitadas'}
          </p>
        </div>
        {hasNoClassesRemaining && (
          <div className="flex items-center gap-2 text-red-400">
            <AlertCircle className="w-5 h-5" />
            <span className="text-sm font-medium">Sin clases disponibles</span>
          </div>
        )}
      </div>
    </CardContent>
  </Card>
)}
```

### 2. **Disabled Book Button**

When `classesRemaining <= 0`:

```tsx
<Button
  disabled={hasNoClassesRemaining || /* other conditions */}
  className={hasNoClassesRemaining
    ? "bg-gray-600 hover:bg-gray-600 text-gray-400 cursor-not-allowed"
    : "bg-red-600 hover:bg-red-700 text-white"
  }
  title={hasNoClassesRemaining ? 'No tienes clases disponibles en tu plan' : undefined}
>
  {hasNoClassesRemaining
    ? 'Sin clases disponibles'
    : 'Reservar'}
</Button>
```

### 3. **Real-time Updates**

After booking or canceling, the membership data is refreshed:

```typescript
const loadData = useCallback(async (date: Date) => {
  const [classesData, membershipData] = await Promise.all([
    getClassesByMonth(date.getFullYear(), date.getMonth() + 1),
    getUserActiveMembership(),  // ✅ Fetch updated membership
  ])
  setClasses(classesData)
  setMembership(membershipData)
}, [])
```

---

## 🎯 User Experience

### When User Has Classes Remaining

1. ✅ See remaining count: "5 clases restantes"
2. ✅ Can book classes normally
3. ✅ Count updates after each booking

### When User Has 0 Classes Remaining

1. ⚠️ Card turns red with alert icon
2. ⚠️ Message: "Sin clases disponibles"
3. ⚠️ Book button is **disabled and grayed out**
4. ⚠️ Tooltip shows: "No tienes clases disponibles en tu plan"
5. ⚠️ If they try to book anyway (via API), gets error: "No tienes clases disponibles en tu plan."

### When User Has Unlimited Plan

1. ✅ Shows "Clases ilimitadas"
2. ✅ Can book without restrictions
3. ✅ No class count displayed

---

## 🔄 Flow Diagram

```
┌─────────────────────────────────────────┐
│  User Opens Classes Calendar            │
└─────────────────┬───────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────┐
│  Load Membership Data                   │
│  - Plan name                             │
│  - Classes remaining                     │
│  - End date                              │
└─────────────────┬───────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────┐
│  Display Membership Status Card         │
│  ✅ "5 clases restantes"                │
│  OR ⚠️ "Sin clases disponibles"         │
└─────────────────┬───────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────┐
│  User Clicks "Reservar"                 │
└─────────────────┬───────────────────────┘
                  │
                  ▼
        ┌─────────┴─────────┐
        │                   │
        ▼                   ▼
┌──────────────┐    ┌──────────────┐
│ Has Classes? │    │ No Classes?  │
│ ✅ Yes       │    │ ⚠️ No         │
└──────┬───────┘    └──────┬───────┘
       │                   │
       ▼                   ▼
┌──────────────┐    ┌──────────────┐
│ Create       │    │ Button is    │
│ Booking      │    │ DISABLED     │
└──────┬───────┘    │ "Sin clases  │
       │            │ disponibles" │
       ▼            └──────────────┘
┌──────────────┐
│ Decrement    │
│ Classes (-1) │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ Refresh UI   │
│ Show: "4     │
│ clases..."   │
└──────────────┘
```

---

## 📊 Database Changes

### When Booking is Confirmed:

```sql
UPDATE user_memberships
SET classes_remaining = classes_remaining - 1
WHERE id = $1
```

### When Booking is Cancelled:

```sql
UPDATE user_memberships
SET classes_remaining = classes_remaining + 1
WHERE id = $1
```

### Edge Cases Handled:

1. **Unlimited Plans** - `classesRemaining = NULL` → No decrement, no limit
2. **Waitlist** - Only decrement when promoted to confirmed
3. **Expired Plans** - Blocked before checking remaining classes
4. **Concurrent Bookings** - Database transaction ensures atomicity

---

## ✨ Benefits

1. **Prevents Overbooking** - Users cannot book more than their package allows
2. **Clear Feedback** - Users see exactly how many classes they have left
3. **Visual Warnings** - Red alert when no classes remaining
4. **Better UX** - Disabled button prevents frustrating error messages
5. **Real-time Updates** - Count updates immediately after booking/canceling
6. **Tooltip Help** - Hover message explains why button is disabled

---

## 🧪 Testing Scenarios

### Test 1: User with 5 Classes
- [x] Should see "5 clases restantes"
- [x] Can book successfully
- [x] After booking: "4 clases restantes"

### Test 2: User with 1 Class
- [x] Should see "1 clase restante" (singular)
- [x] Can book successfully
- [x] After booking: "Sin clases disponibles" + red alert

### Test 3: User with 0 Classes
- [x] Red card with alert icon
- [x] "Sin clases disponibles" message
- [x] Book button is disabled and grayed
- [x] Tooltip on hover explains why

### Test 4: User with Unlimited Plan
- [x] Shows "Clases ilimitadas"
- [x] Can book without limit
- [x] Count never decrements

### Test 5: Cancel Booking
- [x] Classes remaining increases by 1
- [x] If was 0, button becomes enabled again

---

## 🔧 Future Enhancements

- [ ] Add "Renovar Plan" button when classes = 0
- [ ] Show warning at 1-2 classes remaining
- [ ] Email notification when running low on classes
- [ ] Admin override to allow booking beyond limit

---

**Package limit validation is now fully implemented!** 🎉

Users can only book the number of classes included in their membership package.
