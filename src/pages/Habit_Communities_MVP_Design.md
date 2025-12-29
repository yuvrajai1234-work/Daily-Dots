      
# MVP Design: Habit Communities Feature for Daily Dots

This document outlines the design and specifications for the "Habit Communities" MVP, a social feature integrated into the Daily Dots habit-tracking app.

---

### 1. UI/UX Description of Key Screens & Components

#### **A. Community Explore Screen**
This screen is the central hub for discovering new communities.

*   **Layout:** A vertically scrollable screen with a prominent search bar at the top.
*   **Components:**
    *   **Search Bar:** Allows users to search by name or tags.
    *   **Filter Buttons:** "Habit Type," "Language," "Popularity."
    *   **Community Card Grid:** A responsive grid displaying `CommunityCard` components.

#### **B. Community Card Component**
A reusable card to represent a community in lists.

*   **Layout:** A compact card with a background image, title, and key stats.
*   **Components:**
    *   `CoverImage`: The community's banner.
    *   `CommunityName`: Bold and prominent.
    *   `Tagline`: A short, catchy description.
    *   `Stats`: A small icon-based display for `memberCount` and `primaryHabit`.
    *   `JoinButton`: A clear call-to-action.

#### **C. Community Home Screen**
The main view once a user joins a community.

*   **Layout:** A header section followed by a tabbed interface.
*   **Components:**
    *   **Header:** Displays the community's `coverImage`, `title`, and `memberCount`. It includes a `Leave` button and an `Invite` button that generates a shareable link.
    *   **Tab Navigator:** Switches between four views:
        1.  **Chat:** The default view. A real-time, single-channel chat.
        2.  **Leaderboard:** Displays user rankings based on points.
        3.  **Members:** A scrollable list of all community members.
        4.  **Challenges:** Shows active and completed community-wide challenges.

#### **D. Community Chat View**
A simple, real-time chat interface.

*   **Layout:** A classic chat UI with messages aligned to the left and a text input at the bottom.
*   **Components:**
    *   **Message List:** A virtualized list showing messages.
    *   **Message Item:** Contains `avatar`, `username`, `timestamp`, and the `message` content. User's own messages are styled differently.
    *   **Reaction Bar:** Appears below a message, showing emoji reactions (e.g., 👍🔥✅💪) and their counts.
    *   **Text Input:** A simple input field with a "Send" button.

#### **E. Member Profile Drawer**
A quick-view modal that slides up when a user taps on a member's avatar.

*   **Layout:** A clean, concise drawer.
*   **Components:**
    *   `Avatar` and `Username`.
    *   `Bio`: A short user-provided bio.
    *   **Community Stats:**
        *   `Rank`: e.g., "#5 on Leaderboard"
        *   `Points`: e.g., "1,250 Points"
        *   `Current Streak`: e.g., "15-day streak"
    *   **Action Buttons:** `Send DM` and `Block/Report`.

#### **F. Leaderboard Screen**
Displays rankings for friendly competition.

*   **Layout:** A ranked list view.
*   **Components:**
    *   **Toggle:** Buttons to switch between "Weekly" and "All-Time" leaderboards.
    *   **Leaderboard Row:** A list item containing `Rank`, `Avatar`, `Username`, `Points`, and `Current Streak`. The current user's row is highlighted.

---

### 2. Data Model Suggestions (Supabase/Firebase-Friendly)

**`Community`**
```
{
  "id": "uuid",
  "name": "string",
  "description": "text",
  "coverImageUrl": "string",
  "primaryHabitCategory": "string", // e.g., "Fitness", "Study"
  "tags": ["string"],
  "admin": "user_id",
  "createdAt": "timestamp"
}
```

**`Membership`**
```
{
  "communityId": "uuid",
  "userId": "uuid",
  "joinedAt": "timestamp",
  "role": "enum('admin', 'member')",
  "notifications": "boolean"
}
```

**`Message`**
```
{
  "id": "uuid",
  "communityId": "uuid",
  "userId": "uuid",
  "content": "text",
  "createdAt": "timestamp"
}
```

**`Reaction`**
```
{
  "id": "uuid",
  "messageId": "uuid",
  "userId": "uuid",
  "emoji": "string" // e.g., "👍"
}
```

**`LeaderboardEntry`** (Could be a generated view or a collection)
```
{
  "userId": "uuid",
  "communityId": "uuid",
  "points": "number",
  "currentStreak": "number",
  "weeklyPoints": "number"
}
```

**`CommunityChallenge`**
```
{
  "id": "uuid",
  "communityId": "uuid",
  "createdBy": "user_id",
  "name": "string",
  "description": "text",
  "goal": "string", // e.g., "Log habit 20 times"
  "startDate": "date",
  "endDate": "date"
}
```

---

### 3. MVP User Stories

*   **As a user, I can** explore and discover new communities based on habits I'm interested in.
*   **As a user, I can** join a public community to connect with others who share my goals.
*   **As a user, I can** create my own community to lead a group of like-minded individuals.
*   **As a user, I can** send and read messages in a real-time community chat.
*   **As a user, I can** view a leaderboard to see how my progress compares to others in the community.
*   **As a community admin, I can** create a community-wide challenge to engage my members.
*   **As a user, I can** view a member's profile to learn more about them.
*   **As a user, I can** send a direct message to another member for private conversation.
*   **As a user, I can** earn points for checking in my habits and participating in the community, tying into the app's gamification system (A-Coins/P-Coins).

---

### 4. Phased Roadmap

**MVP (Must-Haves)**
*   Public communities only.
*   Single `#general` chat channel per community.
*   Real-time text messages and emoji reactions.
*   Weekly and All-Time leaderboards based on points.
*   Admin-created community challenges.
*   Basic member profiles and 1:1 DMs.
*   Simple Admin role (creator).

**V2 (Social Expansion)**
*   Private, invite-only communities.
*   Multiple, topic-based text channels (e.g., `#progress-pics`, `#resources`).
*   Admin/Moderator roles with permissions (kick, ban, mute).
*   User-set statuses and typing indicators.
*   Advanced member analytics for admins.
*   @mentions and message replies/threads.

**V3 (Rich Engagement)**
*   Live audio/video rooms for group sessions (e.g., co-working, meditation).
*   Scheduled community events with calendar integration.
*   Advanced gamification: community-vs-community competitions, special event rewards.
*   Deeper integration with personal habit stats and insights.
