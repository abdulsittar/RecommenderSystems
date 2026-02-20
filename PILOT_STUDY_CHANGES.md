# Pilot Study Changes - 2 Sessions

This document summarizes all changes made to configure the app for a **2-session pilot study** instead of the **3-session main study**.

## Overview

The pilot study will run with 2 weekly sessions to:
- Test the Prolific implementation
- Measure dropout rates
- Validate the study design

After the pilot, these changes can be easily reverted to restore the 3-session main study configuration.

## Modified Files

### 1. `/client/src/pages/register/Register.js`

**Location:** Lines 662-680 (Procedure section)

**Changes:**
- Changed "four weeks" to "two weeks"
- Updated study period description to reflect 2 sessions
- Added "Participation Tasks" section with 5 clear steps
- Simplified consent requirements section

**To Revert to 3 Sessions:**
- Uncomment the section marked `/* MAIN STUDY - 3 sessions version */`
- Comment out the section marked `/* PILOT STUDY - 2 sessions version */`

```javascript
// Search for: "PILOT STUDY" and "MAIN STUDY" comments
// Line ~662-680 in the Procedure section
```

### 2. `/client/src/constants_STA.js`

**Location:** Lines 43-62 (CONSENT_QUESTIONS)

**Changes:**
- Reduced consent questions from 8 to 1 checkbox
- Only text: "I have read all sections in this information sheet."
- Original 8 questions preserved in comments

**To Revert to 3 Sessions:**
- Comment out the single-question array
- Uncomment the 8-question array marked `/* MAIN STUDY */`

### 3. `/server/models/ConsentResponse.js`

**Location:** Lines 10-26 (validator)

**Changes:**
- Changed validator from requiring 8 boolean values to 1 boolean value
- Updated error message accordingly

**To Revert to 3 Sessions:**
- Comment out the pilot validator (checking for length === 1)
- Uncomment the main study validator (checking for length === 8)

```javascript
// Change from:
return v.length === 1; // We have 1 consent question for pilot

// To:
return v.length === 8; // We have 8 consent questions
```

### 4. `/server/routes/users.js`

**Location 1:** Lines 686-711 (`getUserActionsRefresh` endpoint)
**Location 2:** Lines 763-783 (`getUserActions` endpoint)

**Changes:**
- Changed post-survey completion check from `maxTreatment == 2` to `maxTreatment == 1`
- This triggers the post-survey after 2 completed sessions instead of 3

**To Revert to 3 Sessions:**
1. Find the `getUserActionsRefresh` endpoint (around line 639)
2. Find line: `if (readCount > 0 && maxTreatment == 1) {`
3. Change to: `if (readCount > 0 && maxTreatment == 2) {`

4. Find the `getUserActions` endpoint (around line 719)
5. Find line: `if (readCount > 0 && maxTreatment == 1) {`
6. Change to: `if (readCount > 0 && maxTreatment == 2) {`

**Or simply:**
- Uncomment the line marked `// MAIN STUDY: Uncomment line below for 3 sessions`
- Comment out the line marked `// PILOT STUDY: Check maxTreatment == 1 for 2 sessions`

## How Treatment Values Work

The `treatment` field in the Post model tracks which session a post belongs to:
- `treatment = 0` → Session 1 (initial/first visit)
- `treatment = 1` → Session 2 (second visit)
- `treatment = 2` → Session 3 (third visit)

The `maxTreatment` value represents the highest treatment/session a user has completed.

**Pilot Study (2 sessions):**
- User completes session 1 (treatment 0)
- User completes session 2 (treatment 1)
- When maxTreatment == 1, user sees post-survey

**Main Study (3 sessions):**
- User completes session 1 (treatment 0)
- User completes session 2 (treatment 1)
- User completes session 3 (treatment 2)
- When maxTreatment == 2, user sees post-survey

## Testing Checklist

Before running the pilot:
- [ ] Registration page shows "two weeks" in procedure text
- [ ] Consent form has single checkbox (not 8)
- [ ] Participation Tasks section displays correctly
- [ ] End session requires 5 articles (not 3)
- [ ] Post-survey appears after completing 2 sessions (test with treatment==1)
- [ ] Prolific completion code works correctly

## Additional Changes for Pilot Study

### Article Reading Requirement
- Changed from **3 articles** to **5 articles** per session
- Files modified:
  - `/client/src/components/topbar/Topbar.js` - End session validation
  - `/client/src/components/popover/SimplePopover.js` - Warning dialog
  - `/client/src/pages/register/Register.js` - Reward description
- Warning message now shows: "You need to read X more article(s)"

### Consent Form Simplification
- Reduced from **8 consent checkboxes** to **1 checkbox**
- Files modified:
  - `/client/src/constants_STA.js` - CONSENT_QUESTIONS array
  - `/server/models/ConsentResponse.js` - Validator changed from 8 to 1
  - `/client/src/pages/register/Register.js` - UI simplified

### New "Participation Tasks" Section
- Added blue-highlighted box on consent form page
- Lists 5 clear steps for participants:
  1. Fill out the initial questionnaire
  2. Choose a topic
  3. Read at least 5 articles and press the "End session" button
  4. Fill out a post questionnaire and receive the Prolific participation code
  5. In a few days you will be invited to re-take the study again

## Reverting to Main Study

Follow these steps to restore 3-session configuration:

1. **Update Register.js (Procedure text):**
   ```bash
   # Open: /client/src/pages/register/Register.js
   # Find lines ~662-680
   # Uncomment MAIN STUDY section (four weeks)
   # Comment out PILOT STUDY section (two weeks)
   ```

2. **Update users.js (Post-survey trigger):**
   ```bash
   # Open: /server/routes/users.js
   # Change maxTreatment == 1 to maxTreatment == 2 (in two places)
   # Lines ~689 and ~767
   ```

3. **Update constants_STA.js (Consent questions):**
   ```bash
   # Open: /client/src/constants_STA.js
   # Comment out single-question PILOT STUDY array
   # Uncomment 8-question MAIN STUDY array
   # Lines ~43-62
   ```

4. **Update ConsentResponse.js (Validator):**
   ```bash
   # Open: /server/models/ConsentResponse.js
   # Comment out pilot validator (v.length === 1)
   # Uncomment main study validator (v.length === 8)
   # Lines ~13-26
   ```

5. **Update article requirements (Optional - if planning to use 3 articles instead of 5):**
   ```bash
   # Open: /client/src/components/topbar/Topbar.js
   # Change articlesRead < 5 to articlesRead < 3 (two places)
   # Update dialog title and messages
   
   # Open: /client/src/components/popover/SimplePopover.js
   # Change "5 articles" to "3 articles"
   
   # Open: /client/src/pages/register/Register.js
   # Change "five news articles" to "three news articles"
   ```

6. **Rebuild client:**
   ```bash
   cd client
   npm run build
   ```

7. **Test thoroughly:**
   - Verify registration text shows "four weeks"
   - Verify consent form has 8 checkboxes
   - Verify post-survey appears after 3 sessions (maxTreatment==2)
   - Verify end session requires correct number of articles

## Notes

- All original code is preserved in comments
- No code was deleted, only commented out
- Client build needs to be regenerated after changes
- All modifications are clearly marked with "PILOT STUDY" and "MAIN STUDY" labels

## Contact

If you have questions about these changes, refer to the inline comments in the modified files.

---

**Last Updated:** February 19, 2026
**Status:** Ready for Pilot Study (2 sessions)
