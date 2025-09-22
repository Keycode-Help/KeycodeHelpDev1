# Trial Expiration Test Plan

## Backend Changes Made

### 1. TrialService Improvements

- ✅ Fixed `checkAndHandleExpiredTrials()` method to properly find and handle expired trials
- ✅ Added repository method `findByTrialTrueAndActivatedTrue()` to find active trial subscriptions
- ✅ Added automatic trial expiration handling in `getTrialStatus()` method

### 2. Scheduled Task

- ✅ Created `TrialExpirationScheduler` service that runs every hour
- ✅ Automatically checks and handles expired trials across all users

### 3. API Endpoint Updates

- ✅ Updated `/trial/status` endpoint to automatically handle expired trials
- ✅ Updated `/trial/premium-access` endpoint to check trial expiration
- ✅ Updated ChatController to properly validate trial expiration before allowing chat access

### 4. Frontend Improvements

- ✅ Created `StartTrialBanner` component for users without premium access
- ✅ Updated App.jsx to show appropriate banners based on user status
- ✅ TrialBanner shows for active trials
- ✅ StartTrialBanner shows for users without premium access
- ✅ TrialExpirationHandler shows when trial has expired

## Test Scenarios

### Scenario 1: User with Active Trial

1. User starts a 3-day trial
2. TrialBanner should show with countdown
3. User should have premium access (chat, member pricing, etc.)
4. TrialExpirationHandler should NOT show

### Scenario 2: User with Expired Trial

1. User's trial expires (either naturally or by setting trialEndsAt to past date)
2. TrialBanner should disappear
3. StartTrialBanner should appear
4. TrialExpirationHandler should show with upgrade option
5. User should lose premium access (no chat, standard pricing)

### Scenario 3: User with Paid Subscription

1. User has active paid subscription
2. No trial banners should show
3. User should have premium access
4. TrialExpirationHandler should NOT show

### Scenario 4: User with No Subscription

1. User is authenticated but has no subscription
2. StartTrialBanner should show
3. User should not have premium access
4. TrialExpirationHandler should NOT show

## Automatic Expiration Handling

The system now automatically handles trial expiration in multiple ways:

1. **Scheduled Task**: Runs every hour to check all active trials
2. **API Calls**: Every time trial status is checked, expiration is handled
3. **Premium Access Checks**: Every time premium access is validated, expiration is handled
4. **Chat Access**: Every time chat is accessed, trial expiration is checked

## Key Features

- ✅ Automatic trial expiration detection
- ✅ Proper premium access validation
- ✅ Appropriate UI banners for different user states
- ✅ Scheduled cleanup of expired trials
- ✅ Real-time trial status updates
- ✅ Proper error handling and logging

## Testing Commands

To test the trial expiration flow:

1. **Start a trial**:

   ```bash
   curl -X POST "http://localhost:8080/trial/start?tier=BASIC" \
     -H "Authorization: Bearer YOUR_JWT_TOKEN"
   ```

2. **Check trial status**:

   ```bash
   curl -X GET "http://localhost:8080/trial/status" \
     -H "Authorization: Bearer YOUR_JWT_TOKEN"
   ```

3. **Check premium access**:

   ```bash
   curl -X GET "http://localhost:8080/trial/premium-access" \
     -H "Authorization: Bearer YOUR_JWT_TOKEN"
   ```

4. **Test chat access** (should fail if trial expired):
   ```bash
   curl -X GET "http://localhost:8080/chat/history" \
     -H "Authorization: Bearer YOUR_JWT_TOKEN"
   ```

## Database Changes

- Added `findByTrialTrueAndActivatedTrue()` method to SubscriptionRepository
- No schema changes required - uses existing trial and activated fields

## Summary

The trial system now properly:

- Automatically detects when trials expire
- Removes premium access when trials expire
- Shows appropriate banners based on user status
- Handles trial expiration in real-time across all API endpoints
- Provides scheduled cleanup of expired trials
- Maintains proper access control for premium features
