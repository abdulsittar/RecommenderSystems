# Implementation Summary: New User Flow

## Overview
This document summarizes the changes made to implement the new user flow where:
1. Each user gets a unique registration link
2. First-time users complete: pre-survey → one weekly question → use platform
3. Returning users (after 7+ days) get the weekly survey before accessing content
4. Users use the first 10 characters of their unique ID as their password

## Changes Made

### 1. Server-Side Changes

#### A. User Model (`server/models/User.js`)
- **Added field**: `lastLoginDate` (Date) - Tracks when user last logged in
- **Purpose**: Used to determine if 7+ days have passed since last login

#### B. IDStorage Model (`server/models/IDStorage.js`)
- **Added field**: `defaultPassword` (String) - Stores first 10 chars of yourID
- **Purpose**: Provides a default password for users based on their unique ID

#### C. Auth Routes (`server/routes/auth.js`)

**Registration Endpoint (`/register/:uniqId`)**:
- Modified to use first 10 characters of uniqueId as default password if no password provided
- Code change:
  ```javascript
  const defaultPassword = req.params.uniqId.substring(0, 10);
  const inputPassword = req.body.password ? req.body.password.trim() : defaultPassword;
  ```

**Login Endpoint (`/login`)**:
- Added check for days since last login (7+ days)
- If 7+ days have passed, checks if weekly survey completed for current week
- Sets `needsWeeklySurvey` flag in response
- Updates `lastLoginDate` timestamp on each login
- Key logic:
  ```javascript
  const daysSinceLastLogin = Math.floor((now - new Date(lastLogin)) / (1000 * 60 * 60 * 24));
  if (daysSinceLastLogin >= 7) {
    // Check if weekly survey completed this week
    needsWeeklySurvey = !weeklyResponse;
  }
  await User.findByIdAndUpdate(user._id, { lastLoginDate: now });
  ```

#### D. Posts Routes (`server/routes/posts.js`)

**Random ID Endpoint (`/random_id`)**:
- Modified to save default password when generating unique ID
- Code change:
  ```javascript
  const defaultPassword = yourID.substring(0, 10);
  await IDStorage.updateOne(
    { _id: randomDoc[0]._id },
    { $set: { defaultPassword: defaultPassword } }
  );
  ```

### 2. Client-Side Changes

#### A. Register Component (`client/src/pages/register/Register.js`)

**User Status Check**:
- Simplified `checkUserSurveyStatus` function
- If `data.login === true`, immediately redirect to `/login/{uniqueId}`
- Removed daily survey check - now only does one weekly question on first registration
- Code change:
  ```javascript
  if (data.login === true) {
    toast.info('Welcome back! Please log in.');
    history.push(`/login/${uniqId}`);
    return;
  }
  ```

**Password Usage**:
- Changed from hardcoded password to first 10 characters of uniqueId
- Applied in both registration and auto-login
- Code changes:
  ```javascript
  // During registration
  password: uniqId.substring(0, 10)
  
  // During login after registration
  password: uniqId.substring(0, 10)
  ```

#### B. Login Component (`client/src/pages/login/Login.js`)
- Already had weekly survey redirect logic in place
- No changes needed - works with the new `needsWeeklySurvey` flag from server

## New User Flow

### First-Time User Journey
1. **Landing Page** → User gets unique link: `https://socialapp2.ijs.si/register/{uniqueId}`
2. **Registration Page** checks if user exists
   - If exists → redirect to login page
   - If new → proceed with surveys
3. **Consent Form** → User agrees to participate
4. **Demographics Survey** → User answers demographic questions
5. **Weekly Question** → User answers ONE weekly question
6. **User Selection** → User chooses from 4 profile options
7. **Auto-Create Account** → System creates account with:
   - Username from selected profile
   - Password = first 10 chars of uniqueId
   - All survey data saved
8. **Auto-Login** → User is logged in and redirected to feed

### Returning User Journey
1. User visits their unique registration link
2. System detects user exists → redirects to `/login/{uniqueId}`
3. User enters password (first 10 chars of uniqueId)
4. System checks:
   - If < 7 days since last login → direct to feed
   - If ≥ 7 days since last login → check weekly survey status
     - If weekly survey completed this week → direct to feed
     - If weekly survey NOT completed → redirect to `/weekly-survey`
5. After completing weekly survey (if needed) → access to feed

## Password System
- **Default Password**: First 10 characters of unique ID
- **Example**: If uniqueId is `abc123def456xyz`, password is `abc123def4`
- **Storage**: Hashed in User model, plain text reference in IDStorage model
- **Usage**: Automatically used during registration and login

## Weekly Survey Timing
- **First time**: ONE weekly question during initial registration
- **Subsequent times**: Only if 7+ days have passed since last login AND no survey completed in current week
- **Week definition**: Sunday to Saturday (start of week = Sunday at 00:00:00)

## Benefits of New Flow
1. **Simplified onboarding**: Users don't need to create passwords
2. **Consistent experience**: Same password always (first 10 chars of unique ID)
3. **Reduced survey fatigue**: Only ONE weekly question on first registration
4. **Time-based surveys**: Weekly surveys only trigger after actual usage gaps (7+ days)
5. **Proper returning user handling**: Existing users immediately redirected to login

## Testing Recommendations
1. Test first-time registration flow end-to-end
2. Test returning user detection and redirect to login
3. Test weekly survey trigger after 7+ days
4. Test weekly survey bypass if already completed this week
5. Test password creation and login with first 10 chars of uniqueId
6. Test user selection and account creation
7. Test auto-login after registration

## Files Modified
1. `server/models/User.js`
2. `server/models/IDStorage.js`
3. `server/routes/auth.js`
4. `server/routes/posts.js`
5. `client/src/pages/register/Register.js`

## Files Not Modified (Already Working Correctly)
1. `client/src/pages/login/Login.js` - Already handles weekly survey redirect
2. `client/src/pages/landingPage/landingPage.js` - Already generates unique links
3. `client/src/pages/weeklySurvey/WeeklySurvey.js` - Already handles weekly surveys
