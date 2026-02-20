# Pilot Study Requirements - Implementation Summary

## Requirements Implemented (Feb 19, 2026)

### 5. Limited Topics (3 Topics Only)
**Requirement:** Only three topics for pilot study - Abortion, Military Armament, and Social Media Regulation

**Implementation:**
- **Feed.js** (lines 176-185): Reduced topic mapping to 3 options (option1, option5, option7)
- **Feed.js** (lines 1307-1332): Topic selection dialog shows only 3 radio buttons
- Other 4 topics are commented out with MAIN STUDY markers

**Files Modified:**
- `/client/src/components/feed/Feed.js`

---

### 6. Topic Locking (No Topic Changes)
**Requirement:** Once participant chooses a topic, they are locked in and cannot change it

**Implementation:**
- **Feed.js** (lines 150-170): `handleOpenNextDialog()` function disabled
- **Feed.js** (line 1172 & 1289): Both "Change Topic" buttons hidden/commented
- Dialog title changed from "Change Topic" to "Select Topic"
- Dialog description warns: "You will continue with this topic for all sessions"

**How it works:**
1. User sees topic selection dialog only on first login (when `currentUser.currentTopic` is null)
2. Selected topic is saved to `User.currentTopic` in database
3. "Change Topic" buttons are commented out and never shown
4. `handleOpenNextDialog()` function is disabled

**Files Modified:**
- `/client/src/components/feed/Feed.js`

---

### 7. Topic Persistence Across Sessions
**Requirement:** When returning for session 2, continue with same topic (no option to change)

**Implementation:**
- Already handled by requirement #6 above
- Backend `createRefreshData` endpoint (lines 546-552 in posts.js) uses `user.currentTopic`
- Topic is loaded from database on every login

**Files Modified:**
- `/server/routes/posts.js` (createRefreshData endpoint)

---

### 8. Post-Survey After End Button
**Requirement:** 
- Show 13 "Topic survey" questions (same as weekly survey)
- Store values separately from initial responses
- Add optional feedback question: "Would you like to provide any feedback on the study or the website?"
- Show Prolific code after submission

**Implementation:**

#### A. New Simplified Post-Survey Component
**File Created:** `/client/src/pages/postsurvey/PostSurveySimplified.js`

**Features:**
- 13 slider questions matching weekly survey format:
  - Q1: Overall attitude (0-100 scale)
  - Q2-Q7: Perceptions of "one side" advocates (6 questions, 0-10 scales)
  - Q8-Q13: Perceptions of "other side" advocates (6 questions, 0-10 scales)
- Optional feedback text field (multiline, not required)
- Thank you dialog with Prolific code displayed prominently
- Automatically detects user's topic and adapts question text
- Side labels adapt based on topic (e.g., "pro-choice" vs "pro-life" for abortion)

#### B. Backend Route for Post-Survey
**File:** `/server/routes/postsurvey.js`
- **Lines 115-178**: New `/postsurvey/simplified/:userId` endpoint
- Stores 13 responses in PostSurvey model (reusing existing q1-q13 fields)
- Stores feedback in `feedback` field
- Stores topic in `q21` field
- Returns Prolific code (currently "PILOT_TEST_CODE" - update when actual code available)
- Prevents duplicate submissions

#### C. Routing Updates
**Files Modified:**
- `/client/src/App.js` - Added route `/postsurvey-pilot`
- `/client/src/pages/home/Home.js` - Changed redirect to `/postsurvey-pilot`
- `/client/src/pages/progress/Progress.js` - Changed redirect to `/postsurvey-pilot`

**How it works:**
1. After completing session 2, user clicks "End Session"
2. Backend check (`getUserActions`) sees `maxTreatment == 1` and returns `showAlert: "third"`
3. User is redirected to `/postsurvey-pilot`
4. Simplified survey loads with 13 questions + feedback field
5. On submit, data is saved to PostSurvey collection
6. Thank you dialog shows Prolific code
7. User copies code and returns to Prolific

**Files Created:**
- `/client/src/pages/postsurvey/PostSurveySimplified.js`

**Files Modified:**
- `/server/routes/postsurvey.js`
- `/client/src/App.js`
- `/client/src/pages/home/Home.js`
- `/client/src/pages/progress/Progress.js`

---

## Summary of All Changes

### Frontend Changes
1. **Feed.js** - 3 topics only, topic selection locked, "Change Topic" buttons hidden
2. **PostSurveySimplified.js** - New simplified post-survey component (13 questions + feedback)
3. **App.js** - New route for simplified post-survey
4. **Home.js** - Redirect to simplified post-survey
5. **Progress.js** - Redirect to simplified post-survey
6. **Topbar.js** - "End Anyway" button removed (from previous requirement)

### Backend Changes
1. **posts.js** - `createRefreshData` endpoint (fixes session progression)
2. **postsurvey.js** - `/simplified/:userId` endpoint (handles new post-survey)

### Build Status
✅ Client built successfully with no errors
✅ All changes marked with PILOT STUDY / MAIN STUDY comments
✅ Easy to revert for main study

---

## Testing Instructions

### Test Topic Locking
1. Register new user
2. Select a topic (e.g., "Abortion")
3. Verify "Change Topic" buttons do not appear anywhere
4. Logout and login again
5. Verify same topic is active and cannot be changed

### Test Topic Options
1. Open topic selection dialog (only on first login)
2. Verify only 3 options appear:
   - Abortion
   - Military Armament  
   - Social Media Regulation
3. Select one and confirm it persists

### Test Post-Survey Flow
1. Complete session 1 (read 5 articles, end session)
2. Login again for session 2
3. Complete session 2 (read 5 articles, end session)
4. Verify redirect to `/postsurvey-pilot`
5. Verify 13 questions appear with sliders
6. Fill out survey (feedback optional)
7. Click Submit
8. Verify thank you dialog with Prolific code appears
9. Copy code and close dialog
10. Verify logout and redirect to login page

### Test Duplicate Submission Prevention
1. Try to access `/postsurvey-pilot` after already submitting
2. Should show existing Prolific code
3. Should not allow resubmission

---

## Important Notes for Prolific Setup

1. **Prolific Code Placeholder**: Currently returns "PILOT_TEST_CODE". Update line 136 in `/server/routes/postsurvey.js` when you have the actual Prolific completion code.

2. **Recommended Code Format**: Use a unique completion code provided by Prolific when setting up the study. The code will be retrieved from the user's PreSurvey record (stored during registration).

3. **Code Display**: The code is shown in a large, monospace font for easy copying. Users must manually copy and paste it into Prolific.

---

## Reverting to Main Study

To restore 7 topics and allow topic changes:

1. **Feed.js** - Uncomment all 7 topics in mapping and dialog
2. **Feed.js** - Uncomment `handleOpenNextDialog()` function body
3. **Feed.js** - Uncomment both "Change Topic" buttons
4. **App.js, Home.js, Progress.js** - Change routes from `/postsurvey-pilot` to `/postsurvey/${username}`
5. Rebuild client: `cd client && npm run build`

All changes are marked with `// PILOT STUDY` and `// MAIN STUDY` comments.

---

**Implementation Date:** February 19, 2026  
**Status:** ✅ Complete and Built  
**Next Step:** Test with actual users and update Prolific code
