# Frontend UX & Structure Plan
## Habit Tracker Application

---

## Application Overview

The Habit Tracker is an AI-powered application for tracking personal habits with social features including parties (guilds), accountability partnerships, and collaborative goals. The application supports habit logging, analytics, Google Calendar integration, and AI-generated insights.

### Core Purpose
Enable users to create, track, and analyze habits while fostering community through parties and accountability partnerships.

### Key Capabilities
- User authentication and profile management
- Habit creation, tracking, and management
- Daily habit completion logging with mood tracking
- Analytics and statistics visualization
- Party/guild creation and management
- Collaborative party goals
- Accountability partnerships with commenting
- Google Calendar integration for reminders
- AI-powered habit suggestions and insights
- Achievement tracking

---

## User Roles & Access Levels

### Regular User
- Create and manage personal habits
- Log habit completions
- View personal analytics
- Join/create parties
- Request/accept accountability partnerships
- Use AI features
- Connect Google Calendar

### Premium User
- All Regular User capabilities
- Additional features (if implemented in future)

### Admin User
- All user capabilities
- System administration features (if implemented in future)

### Access Boundaries
- Users can only access their own habits and logs
- Party members can view party details and goals
- Accountability partners can view partner's habits (based on permissions)
- Public parties are visible to all authenticated users
- Private parties are only visible to members

---

## Core Entities & Concepts

### User
- Email, username, password
- User type (REGULAR, PREMIUM, ADMIN)
- Profile fields: avatar_url, bio, timezone
- Active/inactive status
- Created timestamp

### Habit
- Title, description
- Frequency: DAILY, WEEKLY, MONTHLY, CUSTOM
- Category: HEALTH, FITNESS, LEARNING, PRODUCTIVITY, SOCIAL, FINANCIAL, CREATIVE, OTHER
- Target days (for custom frequency)
- Reminder time (HH:MM format)
- Color and icon
- Active/inactive status
- Current streak and longest streak
- Associated party (optional)
- Created/updated timestamps

### Log
- Habit completion entry for a specific date
- Completion status (completed/missed)
- Notes (text)
- Mood (1-5 scale)
- Duration in minutes
- AI-analyzed mood fields (label, intensity, analyzed timestamp)
- Completion timestamp
- Unique constraint: one log per habit per date

### Party
- Name, description
- Invite code (unique, 8 characters)
- Public/private visibility
- Maximum members (1-100)
- Total points
- Creator (user)
- Active/inactive status
- Avatar URL
- Created/updated timestamps

### Party Member
- User-party association
- Role: LEADER, OFFICER, MEMBER
- Contribution points
- Joined timestamp
- Active/inactive status
- Last active timestamp

### Party Goal
- Title, description
- Target value (integer)
- Current value (integer)
- Status: ACTIVE, COMPLETED, FAILED, CANCELLED
- Start date, end date (optional deadline)
- Reward points
- Habit category filter (optional)
- Created by user
- Created timestamp

### Accountability Partnership
- Requester and partner (two users)
- Status: PENDING, ACTIVE, DECLINED, ENDED
- Message (optional request message)
- Permissions: can_view_all_habits, can_comment
- Created, accepted, ended timestamps
- Constraint: cannot partner with self
- Unique constraint: one partnership per user pair

### Comment
- Associated with habit (required) and optionally a log
- Author (user)
- Content (text)
- Created timestamp

### Achievement
- Achievement type (string identifier)
- Title, description
- Icon
- Points value
- Rarity: COMMON, RARE, EPIC, LEGENDARY
- Earned timestamp (null if not earned)
- Display flag

---

## Global Navigation Structure

### Primary Navigation
- Dashboard (home)
- Habits
- Analytics
- Parties
- Accountability
- Calendar
- AI Assistant
- Profile/Settings

### Secondary Navigation
- Notifications (partnership requests, party invites)
- Search (users, parties)
- Quick Actions (complete habit, create habit)

### Authentication States
- Unauthenticated: Login, Register
- Authenticated: Full navigation with user context

---

## Page-by-Page Breakdown

### 1. Authentication Pages

#### 1.1 Login Page
**Purpose**: Authenticate existing users

**Available Actions**:
- Enter email and password
- Submit login form
- Navigate to registration page
- Handle forgot password (if implemented)

**Data Shown**:
- Login form fields
- Error messages for invalid credentials
- Success redirect to dashboard

**Backend Functionality Mapped**:
- POST /api/auth/login
- Returns JWT access token
- Error handling: invalid credentials, inactive account

**User Flow**:
1. User enters email and password
2. Submit form
3. Backend validates credentials
4. On success: receive token, store in frontend, redirect to dashboard
5. On failure: display error message

**Error Handling**:
- Invalid email/password: generic error message (security)
- Inactive account: specific error message
- Network errors: retry option

#### 1.2 Registration Page
**Purpose**: Create new user account

**Available Actions**:
- Enter email, username, password, password confirmation
- Submit registration form
- Navigate to login page
- Validate form fields client-side

**Data Shown**:
- Registration form
- Password strength indicator
- Field validation errors
- Success message

**Backend Functionality Mapped**:
- POST /api/auth/register
- Validates: email uniqueness, username uniqueness, password match, password length (min 8)
- Creates user with REGULAR type

**User Flow**:
1. User fills registration form
2. Client-side validation
3. Submit to backend
4. Backend validates: email not taken, username not taken, passwords match
5. On success: account created, redirect to login
6. On failure: display specific error (email taken, username taken, passwords don't match)

**Error Handling**:
- Email already registered: specific error
- Username already taken: specific error
- Passwords don't match: specific error
- Password too short: validation error
- Network errors: retry option

---

### 2. Dashboard Page

**Purpose**: Overview of user's habit tracking activity

**Available Actions**:
- View today's habits summary
- Quick complete habits
- Navigate to habits list
- Navigate to analytics
- View recent achievements
- View active streaks
- Access AI motivation message
- View weekly summary

**Data Shown**:
- Today's completion rate
- Active habits count
- Current streaks summary
- Recent achievements
- Weekly completion rate
- Best day of week
- AI motivation message
- Quick stats cards

**Backend Functionality Mapped**:
- GET /api/analytics/overview
- GET /api/analytics/streaks
- GET /api/analytics/achievements
- GET /api/ai/motivation
- GET /api/logs/weekly
- GET /api/habits/ (filtered for active)

**User Flow**:
1. Page loads on login
2. Fetch overview stats, streaks, achievements, motivation
3. Display summary cards
4. User can quick-complete habits
5. Navigate to detailed views

**Error Handling**:
- Empty state: no habits yet, prompt to create first habit
- API errors: show cached data if available, retry option

---

### 3. Habits Pages

#### 3.1 Habits List Page
**Purpose**: View and manage all user habits

**Available Actions**:
- View all habits (active/inactive filter)
- Filter by category
- Create new habit
- Edit habit
- Delete habit (soft delete)
- View habit details
- Quick complete habit
- Navigate to habit logs

**Data Shown**:
- List of habits with:
  - Title, category, frequency
  - Current streak
  - Completed today indicator
  - Color/icon
  - Party association (if any)
- Filter options: category, active status
- Create habit button

**Backend Functionality Mapped**:
- GET /api/habits/ (with category and is_active filters)
- POST /api/habits/
- PUT /api/habits/{habit_id}
- DELETE /api/habits/{habit_id}
- POST /api/habits/{habit_id}/complete

**User Flow**:
1. Load habits list
2. Apply filters if selected
3. View habits with completion status
4. Click habit to view details
5. Quick complete from list
6. Create/edit/delete habits

**Error Handling**:
- No habits: empty state with create prompt
- Filter returns empty: show "no habits match" message
- Delete error: confirm dialog, handle soft delete

#### 3.2 Create Habit Page
**Purpose**: Create a new habit

**Available Actions**:
- Enter habit details:
  - Title (required)
  - Description (optional)
  - Category (required)
  - Frequency (required)
  - Target days (if custom frequency)
  - Reminder time (optional)
  - Color (optional)
  - Icon (optional)
  - Party association (optional)
- Submit form
- Cancel/back navigation
- Validate form fields

**Data Shown**:
- Habit creation form
- Category dropdown
- Frequency selector
- Custom days selector (conditional)
- Color picker
- Icon selector
- Party selector (if user is party member)
- Validation errors

**Backend Functionality Mapped**:
- POST /api/habits/
- Validates: user must be party member if party_id provided
- Creates habit with default values (streak=0, is_active=true)

**User Flow**:
1. Navigate to create habit page
2. Fill required fields
3. Select optional fields
4. If custom frequency: specify target days
5. If party selected: verify membership
6. Submit form
7. On success: redirect to habits list or habit details
8. On failure: display validation errors

**Error Handling**:
- Missing required fields: client-side validation
- Invalid party selection: error if not member
- Network error: retry option

#### 3.3 Habit Details Page
**Purpose**: View detailed information about a specific habit

**Available Actions**:
- View habit information
- Edit habit
- Delete habit
- View habit logs
- View habit statistics
- Complete habit for today
- Navigate to log creation
- View comments (if accountability partner)

**Data Shown**:
- Habit details: title, description, category, frequency
- Current streak and longest streak
- Completion status for today
- Recent logs (last 7-30 days)
- Statistics: total completions, completion rate, last completed date
- Comments section (if accountability partner)
- Edit/delete actions

**Backend Functionality Mapped**:
- GET /api/habits/{habit_id}
- GET /api/habits/{habit_id}/stats
- GET /api/logs/habit/{habit_id}
- GET /api/accountability/comments/{habit_id}
- PUT /api/habits/{habit_id}
- DELETE /api/habits/{habit_id}
- POST /api/habits/{habit_id}/complete

**User Flow**:
1. Navigate from habits list
2. Load habit details and stats
3. View completion history
4. Complete habit or log completion
5. Edit/delete if needed
6. View partner comments if applicable

**Error Handling**:
- Habit not found: 404 error, redirect to habits list
- Unauthorized access: 403 error, redirect
- No logs yet: show empty state

---

### 4. Logging Pages

#### 4.1 Daily Log View
**Purpose**: View and manage habit completions for a specific date

**Available Actions**:
- View all habits for selected date
- Log completion for a habit
- Update existing log
- Delete log entry
- Add notes to log
- Set mood (1-5 scale)
- Set duration
- Analyze mood from notes (AI)
- Navigate between dates
- View daily summary statistics

**Data Shown**:
- Selected date
- List of habits with completion status
- Completion percentage for the day
- Log entries with notes, mood, duration
- Daily summary: total habits, completed habits, completion percentage
- Date navigation controls

**Backend Functionality Mapped**:
- GET /api/logs/daily/{log_date}
- POST /api/logs/
- PUT /api/logs/{log_id}
- DELETE /api/logs/{log_id}
- POST /api/logs/{log_id}/analyze-mood

**User Flow**:
1. Select date (default: today)
2. Load daily summary and logs
3. Complete habits or update existing logs
4. Add notes, mood, duration
5. Optionally analyze mood from notes
6. Navigate to other dates

**Error Handling**:
- No habits: show empty state
- Log already exists: update instead of create
- Invalid date: validation error
- Mood analysis requires 10+ characters: show error

#### 4.2 Weekly Summary Page
**Purpose**: View week-over-week habit completion summary

**Available Actions**:
- View weekly summary for selected week
- Navigate between weeks
- View daily breakdowns
- See best day of week
- View weekly completion rate

**Data Shown**:
- Week start and end dates
- Daily summaries (7 days):
  - Date
  - Total habits
  - Completed habits
  - Completion percentage
  - Logs for that day
- Weekly statistics:
  - Total completions
  - Weekly completion rate
  - Best day and its rate
  - Total habits tracked

**Backend Functionality Mapped**:
- GET /api/logs/weekly (with optional week_start parameter)

**User Flow**:
1. Load current week summary
2. View daily breakdowns
3. Navigate to previous/next week
4. Click day to view daily log details

**Error Handling**:
- No data for week: show empty state
- Invalid week_start: default to current week

#### 4.3 Habit Logs History Page
**Purpose**: View historical logs for a specific habit

**Available Actions**:
- View all logs for a habit
- Filter by date range
- View log details
- Edit log
- Delete log
- Navigate to habit details

**Data Shown**:
- Habit information
- List of logs (chronological, newest first):
  - Date
  - Completion status
  - Notes
  - Mood
  - Duration
  - AI mood analysis (if available)
- Date range filter
- Statistics summary

**Backend Functionality Mapped**:
- GET /api/logs/habit/{habit_id} (with optional start_date and end_date)

**User Flow**:
1. Navigate from habit details
2. Load logs for habit
3. Apply date filters if needed
4. View/edit individual logs
5. Navigate back to habit details

**Error Handling**:
- No logs: show empty state with prompt to log
- Invalid date range: validation error
- Habit not found: 404 error

---

### 5. Analytics Pages

#### 5.1 Analytics Overview Page
**Purpose**: Comprehensive analytics dashboard

**Available Actions**:
- View overview statistics
- View streak information
- View completion heatmap
- View progress charts
- View category breakdown
- View trends
- View achievements progress
- Filter by date ranges
- Export data (if implemented)

**Data Shown**:
- Overview stats:
  - Total habits
  - Active habits
  - Today's completion rate
  - This week's completion rate
  - Total completions
  - Active streaks count
- Streak information:
  - Habits with active streaks
  - Overall streak statistics
- Completion heatmap (calendar view)
- Progress charts (week/month/year)
- Category breakdown (completion rates by category)
- Trends (week-over-week, month-over-month comparisons)
- Achievements progress

**Backend Functionality Mapped**:
- GET /api/analytics/overview
- GET /api/analytics/streaks
- GET /api/analytics/heatmap (requires start_date and end_date)
- GET /api/analytics/progress (period: week/month/year)
- GET /api/analytics/categories
- GET /api/analytics/trends
- GET /api/analytics/achievements

**User Flow**:
1. Navigate to analytics
2. Load all analytics data
3. View different sections
4. Interact with charts/heatmaps
5. Filter by date ranges
6. View detailed breakdowns

**Error Handling**:
- No data: show empty states with prompts
- Date range too large: backend limits to 365 days, show error
- Invalid period: validation error

#### 5.2 Mood Insights Page
**Purpose**: View mood trends and AI-generated insights

**Available Actions**:
- View mood trend chart
- View mood distribution
- Read AI-generated insights
- Filter by date range
- Analyze mood from log notes

**Data Shown**:
- Mood trend over time:
  - Date
  - Mood intensity (0.0-1.0)
  - Mood label
  - Sentiment (positive/neutral/negative)
- Mood distribution (count by mood label)
- AI insights (text summary)
- Period start and end dates

**Backend Functionality Mapped**:
- GET /api/logs/mood-insights (with optional start_date and end_date)
- POST /api/logs/{log_id}/analyze-mood

**User Flow**:
1. Navigate to mood insights
2. Load mood data for period (default: last 30 days)
3. View trend chart
4. View distribution
5. Read AI insights
6. Adjust date range
7. Trigger mood analysis for specific logs

**Error Handling**:
- No mood data: show empty state, prompt to add notes to logs
- Insufficient notes for analysis: show error (need 10+ characters)
- AI analysis fails: show fallback message

---

### 6. Parties Pages

#### 6.1 Parties List Page
**Purpose**: View user's parties and discover public parties

**Available Actions**:
- View user's parties
- View public parties
- Create new party
- Join party (with invite code)
- View party details
- Leave party
- Navigate to party leaderboard

**Data Shown**:
- List of user's parties:
  - Name, description
  - Member count
  - Total points
  - Avatar
  - User's role
- Public parties (if public_only filter)
- Create party button
- Join party button/form

**Backend Functionality Mapped**:
- GET /api/parties/ (with public_only filter)
- POST /api/parties/
- POST /api/parties/join
- GET /api/parties/leaderboard

**User Flow**:
1. Load user's parties
2. Optionally view public parties
3. Create new party or join with invite code
4. Navigate to party details
5. Leave party if needed

**Error Handling**:
- No parties: show empty state with create/join options
- Invalid invite code: error message
- Party full: error message
- Already member: error message

#### 6.2 Create Party Page
**Purpose**: Create a new party/guild

**Available Actions**:
- Enter party details:
  - Name (required)
  - Description (optional)
  - Public/private visibility
  - Maximum members (1-100)
  - Avatar URL (optional)
- Submit form
- Cancel navigation

**Data Shown**:
- Party creation form
- Visibility toggle
- Max members input
- Avatar upload/URL input
- Validation errors

**Backend Functionality Mapped**:
- POST /api/parties/
- Creates party with unique invite code
- Creator automatically becomes LEADER
- Returns party details including invite_code

**User Flow**:
1. Fill party creation form
2. Set visibility and max members
3. Submit form
4. Receive invite code
5. Share invite code or navigate to party details

**Error Handling**:
- Missing name: validation error
- Invalid max members: validation error (must be 1-100)
- Network error: retry option

#### 6.3 Party Details Page
**Purpose**: View and manage party information

**Available Actions**:
- View party information
- View party members
- View party goals
- Edit party (if leader)
- Delete party (if leader)
- Leave party
- Transfer leadership (if leader)
- Copy invite code
- View member roles and contribution points
- Navigate to party goals

**Data Shown**:
- Party details: name, description, visibility, max members
- Invite code (if member)
- Member count and total points
- Member list with:
  - Username, avatar
  - Role (LEADER, OFFICER, MEMBER)
  - Contribution points
  - Joined date
- User's role in party
- Edit/delete actions (if leader)
- Leave party action

**Backend Functionality Mapped**:
- GET /api/parties/{party_id}
- GET /api/parties/{party_id}/members
- PUT /api/parties/{party_id}
- DELETE /api/parties/{party_id}
- POST /api/parties/{party_id}/leave
- POST /api/parties/{party_id}/transfer-leadership

**User Flow**:
1. Navigate from parties list
2. Load party details and members
3. View member list and roles
4. If leader: edit party details, transfer leadership, delete party
5. If member: leave party
6. Copy invite code to share

**Error Handling**:
- Party not found: 404 error
- Not a member: 403 error (unless public)
- Leader cannot leave without transferring: error message
- Last member leaving: party archived automatically

#### 6.4 Party Leaderboard Page
**Purpose**: View global party rankings

**Available Actions**:
- View top parties by points
- Navigate to party details
- Filter by limit (1-100)

**Data Shown**:
- Ranked list of parties:
  - Rank
  - Party name
  - Total points
  - Member count
  - Avatar
- Limit selector

**Backend Functionality Mapped**:
- GET /api/parties/leaderboard (with limit parameter)

**User Flow**:
1. Navigate to leaderboard
2. Load top parties
3. View rankings
4. Click party to view details

**Error Handling**:
- No parties: show empty state
- Invalid limit: validation error

---

### 7. Party Goals Pages

#### 7.1 Party Goals List Page
**Purpose**: View all goals for a party

**Available Actions**:
- View party goals
- Filter by status (ACTIVE, COMPLETED, FAILED, CANCELLED)
- Create new goal (if officer/leader)
- View goal details
- Contribute to goal
- Edit goal (if creator/leader)
- Delete goal (if creator/leader)

**Data Shown**:
- List of goals:
  - Title, description
  - Target value and current value
  - Progress percentage
  - Status
  - Reward points
  - Created by user
  - Start/end dates
- Status filter
- Create goal button (if permitted)

**Backend Functionality Mapped**:
- GET /api/party-goals/party/{party_id} (with optional status_filter)
- POST /api/party-goals/
- GET /api/party-goals/{goal_id}
- POST /api/party-goals/{goal_id}/contribute
- PUT /api/party-goals/{goal_id}
- DELETE /api/party-goals/{goal_id}

**User Flow**:
1. Navigate from party details
2. Load party goals
3. Apply status filter if needed
4. View goal progress
5. Contribute to active goals
6. Create/edit/delete goals (if permitted)

**Error Handling**:
- No goals: show empty state with create option
- Not a member: 403 error
- Cannot create goal: error (only officers/leaders)
- Goal not active: cannot contribute error
- Goal completed: show completion message

#### 7.2 Create Party Goal Page
**Purpose**: Create a new goal for a party

**Available Actions**:
- Enter goal details:
  - Title (required)
  - Description (optional)
  - Target value (required, > 0)
  - Start date (optional, defaults to now)
  - End date (optional deadline)
  - Reward points (optional, defaults to 0)
  - Habit category filter (optional)
- Submit form
- Cancel navigation

**Data Shown**:
- Goal creation form
- Party information
- Validation errors

**Backend Functionality Mapped**:
- POST /api/party-goals/
- Validates: user must be party member, user must be officer/leader
- Creates goal with ACTIVE status, current_value=0

**User Flow**:
1. Navigate from party goals list
2. Fill goal creation form
3. Set target value and dates
4. Submit form
5. Redirect to goals list or goal details

**Error Handling**:
- Not party member: 403 error
- Not officer/leader: 403 error
- Missing title/target: validation error
- Invalid target value: must be > 0

#### 7.3 Party Goal Details Page
**Purpose**: View detailed goal information and contribute

**Available Actions**:
- View goal details
- View contributors
- Contribute to goal
- Edit goal (if creator/leader)
- Delete goal (if creator/leader)
- View progress visualization

**Data Shown**:
- Goal details: title, description, target, current value
- Progress percentage and visualization
- Status
- Start/end dates
- Reward points
- Created by user
- Contributors list:
  - Username, avatar
  - Contribution points
  - Contribution percentage
- Contribute button (if active)
- Edit/delete actions (if permitted)

**Backend Functionality Mapped**:
- GET /api/party-goals/{goal_id}
- GET /api/party-goals/{goal_id}/contributors
- POST /api/party-goals/{goal_id}/contribute
- PUT /api/party-goals/{goal_id}
- DELETE /api/party-goals/{goal_id}

**User Flow**:
1. Navigate from goals list
2. Load goal details and contributors
3. View progress
4. Contribute if goal is active
5. Edit/delete if permitted
6. View contributor rankings

**Error Handling**:
- Goal not found: 404 error
- Not party member: 403 error
- Goal not active: cannot contribute error
- Goal completed: show completion message and reward points

---

### 8. Accountability Pages

#### 8.1 Accountability Dashboard Page
**Purpose**: View and manage accountability partnerships

**Available Actions**:
- View partnerships (all statuses or filtered)
- Request new partnership
- Accept/decline pending requests
- View partner's habits
- Update partnership settings
- End partnership
- Search for users to partner with

**Data Shown**:
- List of partnerships:
  - Partner username, avatar, email
  - Status (PENDING, ACTIVE, DECLINED, ENDED)
  - Request message
  - Permissions (can_view_all_habits, can_comment)
  - Created/accepted/ended timestamps
- Status filter
- Request partnership button
- Search users functionality

**Backend Functionality Mapped**:
- GET /api/accountability/partners (with optional status filter)
- POST /api/accountability/request
- POST /api/accountability/{partnership_id}/respond
- PUT /api/accountability/{partnership_id}
- DELETE /api/accountability/{partnership_id}
- GET /api/accountability/search

**User Flow**:
1. Navigate to accountability dashboard
2. Load partnerships
3. Filter by status if needed
4. Request new partnership: search users, send request
5. Respond to pending requests: accept/decline
6. View active partner's habits
7. Update settings or end partnership

**Error Handling**:
- No partnerships: show empty state with request option
- User not found: error when searching
- Self-partnership attempt: error message
- Existing partnership: error message
- Partnership not found: 404 error
- Unauthorized action: 403 error

#### 8.2 Request Partnership Page
**Purpose**: Send accountability partnership request

**Available Actions**:
- Search for users (by username or email)
- Select user from search results
- Enter optional message
- Submit request
- Cancel navigation

**Data Shown**:
- User search input
- Search results:
  - Username, email, avatar
- Message input (optional)
- Submit button

**Backend Functionality Mapped**:
- GET /api/accountability/search (query parameter, min 3 characters)
- POST /api/accountability/request

**User Flow**:
1. Navigate to request partnership
2. Search for users (min 3 characters)
3. Select user from results
4. Optionally add message
5. Submit request
6. Redirect to dashboard

**Error Handling**:
- Query too short: show validation message
- User not found: show "no results"
- Self-selection: error message
- Existing partnership: error message
- Network error: retry option

#### 8.3 Partner Habits View Page
**Purpose**: View partner's habits and provide feedback

**Available Actions**:
- View partner's habits (based on permissions)
- View habit details
- Add comments on habits or logs
- View existing comments
- View partner's completion rates and streaks

**Data Shown**:
- Partner information: username, avatar
- List of partner's habits:
  - Title, category, frequency
  - Current streak
  - Completion status
- Overall completion rate
- Current streaks list
- Comments section for each habit/log
- Add comment form

**Backend Functionality Mapped**:
- GET /api/accountability/partner/{partner_id}/habits
- GET /api/accountability/comments/{habit_id}
- POST /api/accountability/comment

**User Flow**:
1. Navigate from partnership dashboard
2. Load partner's habits
3. View habit details and completion status
4. Add comments on habits or specific logs
5. View existing comments
6. Provide encouragement and feedback

**Error Handling**:
- No active partnership: 403 error
- No permission to view: 403 error
- Cannot comment: 403 error (if permission disabled)
- Habit not found: 404 error
- Cannot comment on own habits: error message

---

### 9. Calendar Integration Pages

#### 9.1 Calendar Settings Page
**Purpose**: Manage Google Calendar integration

**Available Actions**:
- Connect Google Calendar
- Disconnect Google Calendar
- View connection status
- Sync habits to calendar
- Create calendar events for habits
- Update calendar events
- Delete calendar events

**Data Shown**:
- Connection status (connected/disconnected/expired)
- Connected account information (if connected)
- List of habits with calendar sync status
- Sync button
- Disconnect button

**Backend Functionality Mapped**:
- GET /api/calendar/status
- GET /api/calendar/oauth/url
- GET /api/calendar/oauth/callback (handled by backend redirect)
- POST /api/calendar/sync
- POST /api/calendar/event/{habit_id}
- PUT /api/calendar/event/{habit_id}
- DELETE /api/calendar/event/{habit_id}
- DELETE /api/calendar/disconnect

**User Flow**:
1. Navigate to calendar settings
2. Check connection status
3. If disconnected: click connect, redirect to Google OAuth, return to callback
4. If connected: view sync status
5. Sync all habits or individual habits
6. Create/update/delete calendar events
7. Disconnect if needed

**Error Handling**:
- Not connected: show connect button
- Connection expired: show reconnect option
- OAuth error: show error message
- Sync errors: show which habits failed
- Invalid reminder time: validation error

---

### 10. AI Features Pages

#### 10.1 AI Assistant Page
**Purpose**: Interact with AI for habit-related assistance

**Available Actions**:
- Chat with AI about habits
- Get habit suggestions
- Get weekly AI summary
- Get motivation messages
- Analyze habit patterns
- Get improvement tips for specific habits

**Data Shown**:
- Chat interface
- AI responses
- Habit suggestions list
- Weekly summary:
  - Summary text
  - Highlights
  - Insights
  - Recommendations
- Motivation message
- Pattern analysis results
- Habit-specific tips

**Backend Functionality Mapped**:
- POST /api/ai/chat
- GET /api/ai/suggestions (with optional category filter)
- GET /api/ai/weekly-summary
- GET /api/ai/motivation
- GET /api/ai/patterns
- GET /api/ai/tips/{habit_id}

**User Flow**:
1. Navigate to AI assistant
2. Choose feature: chat, suggestions, summary, etc.
3. Interact with AI
4. View AI-generated content
5. Apply suggestions or insights

**Error Handling**:
- AI service unavailable: show fallback message
- No data for analysis: show empty state
- Network error: retry option
- Invalid habit ID: 404 error

#### 10.2 Habit Suggestions Page
**Purpose**: Get AI-powered habit suggestions

**Available Actions**:
- View AI suggestions
- Filter by category
- Create habit from suggestion
- Refresh suggestions

**Data Shown**:
- List of suggested habits:
  - Title
  - Description
  - Category
- Category filter
- Create habit buttons for each suggestion

**Backend Functionality Mapped**:
- GET /api/ai/suggestions (with optional category filter)

**User Flow**:
1. Navigate to suggestions
2. Load AI suggestions
3. Filter by category if needed
4. Review suggestions
5. Create habit from suggestion
6. Refresh for new suggestions

**Error Handling**:
- No suggestions: show empty state
- AI error: show fallback suggestions
- Network error: retry option

---

### 11. Profile & Settings Pages

#### 11.1 Profile Page
**Purpose**: View and edit user profile

**Available Actions**:
- View profile information
- Edit username
- Update avatar URL
- Update bio
- Update timezone
- Change password
- View account information

**Data Shown**:
- Username, email
- Avatar
- Bio
- Timezone
- User type
- Account created date
- Edit form fields

**Backend Functionality Mapped**:
- GET /api/auth/me
- PUT /api/auth/profile
- PUT /api/auth/password

**User Flow**:
1. Navigate to profile
2. View current profile information
3. Edit fields as needed
4. Save changes
5. Change password if needed

**Error Handling**:
- Username already taken: error message
- Invalid password: validation error
- Current password incorrect: error message
- Passwords don't match: error message
- Network error: retry option

#### 11.2 Settings Page
**Purpose**: Application settings and preferences

**Available Actions**:
- Update timezone
- Manage notifications (if implemented)
- Privacy settings (if implemented)
- Data export (if implemented)
- Account deletion (if implemented)

**Data Shown**:
- Settings form
- Timezone selector
- Notification preferences
- Privacy options

**Backend Functionality Mapped**:
- PUT /api/auth/profile (for timezone)
- Other settings endpoints (if implemented)

**User Flow**:
1. Navigate to settings
2. Update preferences
3. Save changes

**Error Handling**:
- Invalid settings: validation error
- Network error: retry option

---

## User Flows

### Flow 1: New User Onboarding
1. User visits application
2. User registers account (email, username, password)
3. Account created, redirect to login
4. User logs in
5. Redirect to dashboard (empty state)
6. Prompt to create first habit
7. User creates habit
8. User logs first completion
9. Dashboard shows activity

### Flow 2: Daily Habit Tracking
1. User opens dashboard
2. View today's habits
3. Complete habits via quick action or detailed log
4. Add notes, mood, duration
5. Optionally analyze mood from notes
6. View daily completion percentage
7. View updated streaks

### Flow 3: Join Party and Contribute to Goal
1. User navigates to parties
2. User receives invite code or browses public parties
3. User joins party with invite code
4. User views party details and goals
5. User contributes to active goal
6. Goal progress updates
7. User's contribution points increase
8. Party total points increase

### Flow 4: Request and Accept Accountability Partnership
1. User navigates to accountability dashboard
2. User searches for potential partner
3. User selects partner and sends request with optional message
4. Partner receives notification (if implemented) or views dashboard
5. Partner views request
6. Partner accepts or declines
7. If accepted: partnership becomes active
8. Both users can view each other's habits (based on permissions)
9. Partners can add comments on habits/logs

### Flow 5: Create Habit with Calendar Integration
1. User creates new habit
2. User sets reminder time
3. User connects Google Calendar (if not already connected)
4. User syncs habit to calendar
5. Calendar event created with recurrence
6. User receives calendar reminders
7. User completes habit and logs completion
8. Calendar event remains for future reminders

### Flow 6: View Analytics and Get AI Insights
1. User navigates to analytics
2. User views overview statistics
3. User views completion heatmap
4. User views progress charts
5. User views category breakdown
6. User navigates to AI assistant
7. User requests weekly summary
8. AI generates insights based on data
9. User views suggestions and recommendations
10. User applies suggestions

### Flow 7: Manage Party as Leader
1. Leader views party details
2. Leader edits party information
3. Leader creates party goal
4. Members contribute to goal
5. Goal reaches target, status changes to COMPLETED
6. Party receives reward points
7. Leader views contributors
8. Leader transfers leadership to another member
9. New leader can manage party

---

## Error & Edge-Case UX Handling

### Authentication Errors
- Invalid credentials: Show generic error message (don't reveal if email exists)
- Inactive account: Show specific message with support contact
- Token expired: Automatically refresh token or redirect to login
- Network errors: Show retry option with offline indicator

### Data Validation Errors
- Missing required fields: Highlight fields, show inline errors
- Invalid format: Show format requirements
- Duplicate entries: Show specific error (email taken, username taken)
- Out of range values: Show valid range

### Authorization Errors
- 403 Forbidden: Show "You don't have permission" message
- 404 Not Found: Show "Resource not found" with navigation options
- Unauthorized: Redirect to login with return URL

### Empty States
- No habits: Show "Create your first habit" prompt with button
- No logs: Show "Start logging your habits" message
- No parties: Show "Join or create a party" options
- No partnerships: Show "Find an accountability partner" prompt
- No goals: Show "Create a party goal" option

### Loading States
- Show loading indicators for all async operations
- Skeleton screens for content loading
- Progress indicators for long operations (sync, export)

### Network Errors
- Offline detection: Show offline indicator
- Retry failed requests automatically (with exponential backoff)
- Queue actions when offline, sync when online
- Show cached data when available

### Edge Cases
- User tries to partner with self: Show error before request
- Leader tries to leave party: Require leadership transfer first
- Last member leaves party: Automatically archive party
- Goal reaches target: Show completion celebration, update status
- Calendar sync fails: Show which habits failed, allow retry
- AI service unavailable: Show fallback content, disable AI features gracefully

---

## Non-Interactive / Background Behaviors

### Automatic Operations
- Streak calculation: Automatically updates when logs are created/updated
- Goal completion detection: Automatically marks goal as COMPLETED when target reached
- Party points calculation: Automatically updates when contributions are made
- Token refresh: Automatically refreshes JWT token before expiration
- Calendar event creation: Background sync when habits are created/updated

### Scheduled Tasks (Backend)
- Expired goal checking: Background task marks goals past end_date as FAILED
- Token cleanup: Remove expired OAuth states
- Achievement calculation: Background process checks achievement criteria

### Real-time Updates (If Implemented)
- Partnership request notifications
- Party goal progress updates
- Comment notifications

### Data Synchronization
- Calendar sync: Periodic sync of habits to Google Calendar
- Offline queue: Sync pending actions when connection restored
- Cache invalidation: Refresh stale data when user returns to page

---

## Additional Considerations

### Responsive Design
- All pages must work on mobile, tablet, and desktop
- Touch-friendly interactions for mobile
- Responsive data tables and charts

### Accessibility
- Keyboard navigation support
- Screen reader compatibility
- ARIA labels for interactive elements
- Color contrast compliance
- Focus indicators

### Performance
- Lazy loading for lists and images
- Pagination for large datasets
- Debounced search inputs
- Optimistic UI updates
- Caching strategies

### Security
- Store JWT token securely (httpOnly cookie or secure storage)
- Never expose sensitive data in client-side code
- Validate all inputs client-side before submission
- Handle token expiration gracefully
- Clear sensitive data on logout

### Internationalization (If Implemented)
- Support multiple languages
- Date/time formatting by locale
- Timezone handling

---

## Summary

This frontend plan maps every backend endpoint, model, and functionality to user-facing interactions. Every feature in the backend has a corresponding frontend representation, ensuring complete feature parity. The plan focuses on UX structure, information architecture, and functional flows without prescribing visual design, allowing frontend engineers to implement the interface according to design system requirements while maintaining full backend functionality coverage.

