# 🎮 GitQuest — Gamify Your GitHub Journey

Turn your commits into conquests. GitQuest is a full-stack gamification platform
that converts your real GitHub activity into XP, badges, streaks, quests, and leaderboard rankings.

---

## 🏗️ Architecture

```
gitquest/
├── backend/      ← Spring Boot 3 (Java 17) REST API
└── frontend/     ← React 18 SPA
```

---

## ✅ Prerequisites

| Tool      | Version  |
|-----------|----------|
| Java      | 17+      |
| Maven     | 3.8+     |
| Node.js   | 18+      |
| npm       | 9+       |

---

## 🔑 GitHub OAuth Setup (Required)

1. Go to https://github.com/settings/developers
2. Click **New OAuth App**
3. Fill in:
   - **Application name**: GitQuest
   - **Homepage URL**: `http://localhost:3000`
   - **Authorization callback URL**: `http://localhost:8080/login/oauth2/code/github`
4. Copy your **Client ID** and **Client Secret**

---

## ⚙️ Backend Configuration

Edit `backend/src/main/resources/application.properties`:

```properties
spring.security.oauth2.client.registration.github.client-id=YOUR_CLIENT_ID
spring.security.oauth2.client.registration.github.client-secret=YOUR_CLIENT_SECRET
app.jwt.secret=your-super-secret-jwt-key-minimum-32-characters-long
```

Or set environment variables:
```bash
export GITHUB_CLIENT_ID=your_client_id
export GITHUB_CLIENT_SECRET=your_client_secret
export JWT_SECRET=your_jwt_secret_at_least_32_chars
```

---

## 🚀 Running the App

### Option A — Use the startup script (Linux/Mac)

```bash
chmod +x start.sh
./start.sh
```

### Option B — Manual

**Terminal 1 — Backend:**
```bash
cd backend
mvn spring-boot:run
```

**Terminal 2 — Frontend:**
```bash
cd frontend
npm install
npm start
```

Then open **http://localhost:3000**

---

## 🎮 Modules

| # | Module | Description |
|---|--------|-------------|
| 1 | 🔐 GitHub Auth | OAuth2 login, JWT tokens |
| 2 | 👤 User Profile | XP, level, streak, stats |
| 3 | 📡 Activity Fetcher | Syncs commits, PRs, issues |
| 4 | 🧮 XP Engine | Commit=10, PR=50, Issue=30 XP |
| 5 | 🏆 Badge System | 15 unlockable achievements |
| 6 | 🔥 Streak Tracker | Daily contribution streaks |
| 7 | 📊 Leaderboard | Top 50 users by XP |
| 8 | 🎯 Quests | Daily/weekly coding challenges |
| 9 | 🔔 Notifications | Level-up, badge, streak alerts |
| 10| 🖥️ Dashboard UI | Full gamified React interface |

---

## 🔌 API Endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/auth/me` | ✅ | Current user profile |
| POST | `/api/auth/sync` | ✅ | Sync GitHub activity |
| GET | `/api/activities` | ✅ | Activity feed |
| GET | `/api/badges` | ✅ | User badges |
| GET | `/api/quests` | ✅ | All quests |
| GET | `/api/quests/active` | ✅ | Active quests only |
| GET | `/api/leaderboard` | ❌ | Top 50 leaderboard |
| GET | `/api/notifications` | ✅ | All notifications |
| POST| `/api/notifications/read-all` | ✅ | Mark all read |

H2 Console (dev): http://localhost:8080/h2-console
JDBC URL: `jdbc:h2:mem:gitquestdb`

---

## 🗄️ Database

Uses **H2 in-memory** by default (perfect for development). 
For production, switch to PostgreSQL in `application.properties`:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/gitquest
spring.datasource.username=postgres
spring.datasource.password=yourpassword
spring.jpa.database-platform=org.hibernate.dialect.PostgreSQLDialect
```

Add PostgreSQL dependency to `pom.xml`:
```xml
<dependency>
    <groupId>org.postgresql</groupId>
    <artifactId>postgresql</artifactId>
    <scope>runtime</scope>
</dependency>
```

---

## 🏆 XP System

| Activity | XP |
|----------|----|
| Commit | +10 |
| PR Opened | +20 |
| PR Merged | +50 |
| Issue Opened | +15 |
| Issue Closed | +30 |
| Code Review | +25 |

**Level Formula:** `level = floor(sqrt(totalXP / 100)) + 1`

---

## 🎖️ Badges

🌱 First Commit · 🔥 10 Commits · ⚡ 50 Commits · 💯 100 Commits  
🚀 First PR · 🏅 PR Pro (5 merged) · 🐛 Bug Slayer (10 issues)  
📅 Week Warrior (7d streak) · 🗓️ Month Master (30d streak)  
⭐ Level 5 · 🌟 Level 10 · 💫 Level 20  
🐦 Early Bird · 🦉 Night Owl · 🎯 Quest Master

---

## 🛠️ Tech Stack

**Backend:** Spring Boot 3, Spring Security (OAuth2 + JWT), Spring Data JPA,
H2/PostgreSQL, WebFlux (GitHub API client), Lombok, Maven

**Frontend:** React 18, React Router v6, Axios, Custom CSS (no UI framework)

---

## 📝 Notes

- GitHub activity syncs every **30 minutes** automatically (scheduled job)
- Click **"Sync GitHub"** in the sidebar for immediate sync
- The H2 database resets on every restart (in-memory mode)
- OAuth token is stored in localStorage as `gq_token`
