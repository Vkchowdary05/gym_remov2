<p align="center">
  <h1 align="center">🏋️ GymRemo</h1>
  <p align="center"><strong>Advanced Fitness Tracking with 3D Muscle Visualization</strong></p>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16.2-black?style=for-the-badge&logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/Spring_Boot-3.2.5-6DB33F?style=for-the-badge&logo=spring" alt="Spring Boot" />
  <img src="https://img.shields.io/badge/PostgreSQL-16-4169E1?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL" />
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Three.js-3D-000?style=for-the-badge&logo=three.js" alt="Three.js" />
</p>

---

## 📖 About

GymRemo is a full-stack fitness tracking platform that combines a polished Next.js frontend with a robust Spring Boot REST API backend. Unlike typical fitness apps, GymRemo features an **interactive 3D human body model** powered by Three.js that visually maps your strength levels to individual muscle groups using a color-coded system — from red (beginner) through blue, white, gold, to platinum (pro bodybuilder).

The application supports **120+ exercises** across **12 muscle groups**, offers pre-built workout templates (Push/Pull/Legs, Upper/Lower, 5x5 Strength), and provides comprehensive progress analytics with charts and personal record tracking. Authentication is handled via JWT tokens with automatic refresh, and all data is persisted in PostgreSQL.

---

## ✨ Features

### 🏋️ Workout Tracking
- Log sets, reps, and weights for **120+ exercises** across 12 muscle groups
- Real-time volume and set calculations during workout entry
- **Floating rest timer** with audio notification, adjustable duration (15s–10min), and quick presets (60s, 90s, 2m, 3m)
- Workout notes and history with search/filter capabilities
- Automatic **personal record (PR) detection** across all exercises

### 🧬 3D Muscle Visualization
- Interactive Three.js human body model with **40+ individual muscle meshes**
- Front and back view toggle for complete body coverage
- Color-coded strength mapping: Red → Blue → White → Gold → Platinum
- Hover tooltips showing muscle name and current strength level
- Dynamic glow effects based on strength assessment data

### 📊 Progress Analytics
- **Weight progression charts** per exercise over time (Recharts)
- **Volume trend analysis** — weekly/monthly total volume tracking
- **Workout frequency heatmap** — visualize training consistency
- **Muscle group distribution** — pie chart of training balance
- **Personal records dashboard** — top lifts with dates

### 📚 Exercise Encyclopedia
- Browse and search **120+ exercises** with multi-filter system
- Filter by: muscle group, difficulty level (beginner/intermediate/advanced), equipment type
- Grouped display by muscle group with exercise count badges
- Equipment tags, compound exercise indicators, and difficulty color coding

### 📋 Workout Templates
- **8 pre-built templates**: Push Day, Pull Day, Leg Day, Upper Body, Lower Body, Full Body (Beginner), 5x5 Strength, HIIT Circuit
- Expandable cards showing all exercises with sets x reps
- Category filtering: Push Pull Legs, Upper Lower, Full Body, Strength, Cardio
- Estimated duration and difficulty badges

### 🎨 5 Unique Themes
| Theme | Vibe | Colors |
|-------|------|--------|
| **Relaxing** | Professional & calm | Blue/purple tones, soft shadows |
| **Hardcore** | Intense & aggressive | Deep red/black, bold contrasts |
| **Psycho** | Cyberpunk neon | Electric neon, glow effects |
| **Sinner** | Gothic & mysterious | Deep purple, dark atmosphere |
| **Unbeatable** | Champion & elite | Gold/black, prestigious feel |

### 🔐 Authentication & Security
- JWT-based authentication with **access + refresh token** flow
- Automatic token refresh on 401 responses (seamless UX)
- BCrypt password hashing
- CORS configuration for production domains
- Protected routes with onboarding flow enforcement

---

## 🏗️ Project Architecture

```
gym-remo/
│
├── 📁 app/                              # Next.js App Router Pages
│   ├── page.tsx                         # Landing page (hero, features, CTA)
│   ├── layout.tsx                       # Root layout (providers, fonts)
│   ├── globals.css                      # 5-theme CSS system
│   ├── auth/page.tsx                    # Login & signup (tabbed)
│   ├── onboarding/page.tsx              # 3-step onboarding wizard
│   ├── dashboard/page.tsx               # Stats, streaks, recent workouts
│   ├── add-workout/page.tsx             # Workout builder + rest timer
│   ├── workout-history/page.tsx         # Searchable workout history
│   ├── workout/[id]/page.tsx            # Workout detail with delete
│   ├── progress/page.tsx                # Charts & analytics
│   ├── exercises/page.tsx               # Exercise encyclopedia ⭐
│   ├── templates/page.tsx               # Workout templates ⭐
│   ├── 3d-view/page.tsx                 # 3D muscle visualization
│   └── profile/page.tsx                 # Profile, strength, settings
│
├── 📁 components/
│   ├── 3d/
│   │   ├── muscle-model-3d.tsx          # Three.js body model (40+ meshes)
│   │   └── muscle-visualization-content.tsx  # 3D orchestrator
│   ├── auth/
│   │   ├── login-form.tsx               # Email/password login
│   │   └── signup-form.tsx              # Signup with password requirements
│   ├── dashboard/
│   │   └── dashboard-content.tsx        # Stats grid, PRs, recent workouts
│   ├── layout/
│   │   ├── navbar.tsx                   # Responsive nav (7 items + theme)
│   │   └── protected-layout.tsx         # Auth guard + WorkoutProvider
│   ├── onboarding/
│   │   ├── personal-info-step.tsx       # Name, gender, weight, height
│   │   ├── strength-assessment-step.tsx # 8 lift maxes
│   │   └── review-step.tsx              # Summary with strength levels
│   ├── progress/
│   │   └── progress-content.tsx         # Recharts analytics
│   ├── workout/
│   │   ├── add-workout-content.tsx      # Multi-muscle workout builder
│   │   └── rest-timer.tsx               # Floating timer component ⭐
│   └── ui/                              # Shadcn UI components (20+)
│
├── 📁 contexts/
│   ├── auth-context.tsx                 # JWT auth with API integration
│   ├── workout-context.tsx              # Workout CRUD with API + fallback
│   └── theme-context.tsx                # 5-theme system
│
├── 📁 lib/
│   ├── api.ts                           # HTTP client with JWT refresh ⭐
│   ├── exercises.ts                     # 120+ exercise database
│   ├── strength-calculator.ts           # Strength level formulas
│   ├── muscle-color-calculator.ts       # 3D model color mapping
│   └── utils.ts                         # Tailwind merge helper
│
├── 📁 backend/                          # Spring Boot API ⭐
│   ├── pom.xml                          # Maven (Boot 3.2.5, JPA, JWT)
│   ├── Dockerfile                       # Multi-stage Docker build
│   ├── render.yaml                      # Render.com deployment
│   └── src/main/
│       ├── java/com/gymremo/
│       │   ├── GymRemoApplication.java  # Entry point
│       │   ├── config/
│       │   │   ├── SecurityConfig.java  # CORS, JWT filter, BCrypt
│       │   │   └── DataSeeder.java      # System template seeder
│       │   ├── controller/              # 8 REST controllers
│       │   │   ├── AuthController.java
│       │   │   ├── UserController.java
│       │   │   ├── WorkoutController.java
│       │   │   ├── ExerciseController.java
│       │   │   ├── TemplateController.java
│       │   │   ├── BodyWeightController.java
│       │   │   ├── AnalyticsController.java
│       │   │   └── GlobalExceptionHandler.java
│       │   ├── dto/
│       │   │   └── AuthDtos.java        # All request/response DTOs
│       │   ├── entity/                  # 10 JPA entities
│       │   ├── repository/              # 7 Spring Data repos
│       │   ├── security/
│       │   │   ├── JwtTokenProvider.java
│       │   │   └── JwtAuthFilter.java
│       │   └── service/
│       │       ├── AuthService.java
│       │       ├── WorkoutService.java
│       │       └── UserMapperService.java
│       └── resources/
│           ├── application.properties
│           ├── application-dev.properties
│           ├── application-prod.properties
│           └── data.sql                 # Exercise seed (50+ rows)
│
├── 📁 .github/workflows/
│   └── deploy.yml                       # CI/CD pipeline
│
├── .env.local                           # Frontend env vars
├── DEPLOYMENT.md                        # Deployment guide
└── README.md                            # This file
```

---

## 🚀 Getting Started

### Prerequisites

| Tool | Version | Purpose |
|------|---------|---------|
| Node.js | 20+ | Frontend runtime |
| Java | 17+ | Backend runtime |
| PostgreSQL | 15+ | Database |
| Maven | 3.9+ | Java build tool |

### Step 1: Clone the Repository

```bash
git clone https://github.com/Vkchowdary05/gym_remov2.git
cd gym_remov2
```

### Step 2: Set Up the Database

```bash
# Connect as postgres user (password: root)
createdb -U postgres gymremo_db

# Or via psql
psql -U postgres -c "CREATE DATABASE gymremo_db;"
```

### Step 3: Start the Backend

```bash
cd backend

# Run with dev profile (connects to localhost:5432/gymremo_db)
mvn spring-boot:run -Dspring-boot.run.profiles=dev
```

The backend starts at **http://localhost:8080/api**

On first startup:
- Hibernate auto-creates all tables
- `data.sql` seeds 50+ exercises
- `DataSeeder.java` creates 6 system workout templates

### Step 4: Start the Frontend

```bash
# In the project root (not backend/)
npm install
npm run dev
```

The frontend starts at **http://localhost:3000**

### Step 5: Use the App

1. Open http://localhost:3000
2. Click **Get Started** → Create an account
3. Complete the 3-step onboarding (personal info → strength assessment → review)
4. You're on the dashboard! Start logging workouts

---

## 🔑 API Reference

All endpoints are prefixed with `/api`. Authenticated endpoints require `Authorization: Bearer <token>` header.

### Authentication

| Method | Endpoint | Auth | Description |
|--------|----------|:----:|-------------|
| `POST` | `/auth/signup` | ❌ | Create new account. Body: `{email, password, displayName}` |
| `POST` | `/auth/login` | ❌ | Login. Body: `{email, password}`. Returns access + refresh tokens |
| `POST` | `/auth/refresh` | ❌ | Refresh tokens. Header: `X-Refresh-Token: <token>` |
| `GET` | `/auth/me` | ✅ | Get current user with profile and strength data |
| `POST` | `/auth/onboarding` | ✅ | Complete onboarding with profile + strength data |

### User Management

| Method | Endpoint | Auth | Description |
|--------|----------|:----:|-------------|
| `PATCH` | `/users/me/profile` | ✅ | Update name, gender, weight, height |
| `PUT` | `/users/me/strength` | ✅ | Update all 8 strength assessment values |

### Workouts

| Method | Endpoint | Auth | Description |
|--------|----------|:----:|-------------|
| `GET` | `/workouts` | ✅ | List all user workouts (newest first) |
| `POST` | `/workouts` | ✅ | Create workout with muscle groups, exercises, sets |
| `DELETE` | `/workouts/:id` | ✅ | Delete a workout (owner only) |

### Exercises

| Method | Endpoint | Auth | Description |
|--------|----------|:----:|-------------|
| `GET` | `/exercises` | ❌ | List all active exercises |
| `GET` | `/exercises/muscle-group/:group` | ❌ | Filter by muscle group |

### Templates

| Method | Endpoint | Auth | Description |
|--------|----------|:----:|-------------|
| `GET` | `/templates` | ✅ | List system + user templates |
| `POST` | `/templates` | ✅ | Create custom template |
| `DELETE` | `/templates/:id` | ✅ | Delete custom template (not system ones) |

### Body Weight Tracking

| Method | Endpoint | Auth | Description |
|--------|----------|:----:|-------------|
| `GET` | `/body-weight` | ✅ | List weight log entries |
| `POST` | `/body-weight` | ✅ | Log body weight + optional body fat % |
| `DELETE` | `/body-weight/:id` | ✅ | Delete a weight log entry |

### Analytics

| Method | Endpoint | Auth | Description |
|--------|----------|:----:|-------------|
| `GET` | `/analytics/summary` | ✅ | Computed stats: streak, weekly count, volume, most trained muscle |

---

## 🗄️ Database Schema

```
┌──────────────┐     ┌──────────────────┐     ┌──────────────────────┐
│    users     │────▶│  user_profiles   │     │ strength_assessments │
│              │────▶│                  │     │                      │
│ id (UUID)    │     │ name             │     │ bench_press_kg       │
│ email        │     │ gender           │     │ squat_kg             │
│ password_hash│     │ weight_kg        │     │ deadlift_kg          │
│ display_name │     │ height_cm        │     │ shoulder_press_kg    │
│ provider     │     │ onboarded        │     │ barbell_row_kg       │
│ created_at   │     │ preferred_theme  │     │ overhead_press_kg    │
└──────┬───────┘     └──────────────────┘     │ leg_press_kg         │
       │                                       │ pull_ups_multiplier  │
       │                                       └──────────────────────┘
       │
       ├───▶ workouts ───▶ workout_muscle_groups ───▶ workout_exercises ───▶ workout_sets
       │
       ├───▶ body_weight_logs
       │
       ├───▶ workout_templates
       │
       └───▶ exercises (seeded, shared)
```

### Key Relationships
- **User → UserProfile**: One-to-one (created on signup)
- **User → StrengthAssessment**: One-to-one (created on onboarding)
- **User → Workouts**: One-to-many
- **Workout → MuscleGroups → Exercises → Sets**: Nested cascade (all saved/deleted together)

---

## 🔒 Security Architecture

### JWT Flow

```
1. User signs up/logs in
   └── Server returns: { accessToken (24h), refreshToken (7d) }

2. Frontend stores tokens in localStorage
   └── All API calls include: Authorization: Bearer <accessToken>

3. On 401 response:
   └── API client auto-sends refresh request with X-Refresh-Token header
       ├── Success: New tokens stored, original request retried
       └── Failure: User redirected to /auth
```

### Password Security
- **BCrypt** hashing with default strength (10 rounds)
- Minimum 8 characters, must contain letter + number

### CORS
- Dev: `http://localhost:3000`
- Prod: Configured via `CORS_ALLOWED_ORIGINS` environment variable

---

## 🛠️ Tech Stack

### Frontend
| Technology | Version | Purpose |
|-----------|---------|---------|
| Next.js | 16.2 | React framework with App Router |
| React | 19 | UI library |
| TypeScript | 5 | Type safety |
| Tailwind CSS | 4 | Utility-first styling |
| Shadcn UI | Latest | 20+ accessible UI components |
| Three.js | Latest | 3D muscle visualization |
| @react-three/fiber | Latest | React Three.js renderer |
| @react-three/drei | Latest | Three.js helpers |
| Recharts | Latest | Chart library for analytics |
| date-fns | Latest | Date formatting |
| Lucide React | Latest | Icon library |

### Backend
| Technology | Version | Purpose |
|-----------|---------|---------|
| Spring Boot | 3.2.5 | Java web framework |
| Java | 17 | Language runtime |
| Spring Data JPA | 3.2.x | Database ORM |
| Spring Security | 6.x | Authentication & authorization |
| PostgreSQL | 16 | Relational database |
| jjwt | 0.12.3 | JWT token generation/validation |
| Lombok | Latest | Boilerplate reduction |
| Hibernate | 6.x | JPA implementation |

---

## 🌐 Deployment

| Component | Platform | URL Pattern |
|-----------|----------|-------------|
| Frontend | Vercel | `https://gymremo.vercel.app` |
| Backend | Render | `https://gymremo-backend.onrender.com` |
| Database | Render PostgreSQL | Internal connection |

### Environment Variables

**Frontend (Vercel)**:
```
NEXT_PUBLIC_API_URL=https://gymremo-backend.onrender.com/api
```

**Backend (Render)**:
```
SPRING_PROFILES_ACTIVE=prod
DATABASE_URL=jdbc:postgresql://...
DATABASE_USERNAME=gymremo_user
DATABASE_PASSWORD=<generated>
JWT_SECRET=<64+ char random string>
CORS_ALLOWED_ORIGINS=https://gymremo.vercel.app
PORT=8080
```

See [DEPLOYMENT.md](./DEPLOYMENT.md) for step-by-step instructions.

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m "Add amazing feature"`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License.

---

<p align="center">
  Built with 💪 by <a href="https://github.com/Vkchowdary05">Vkchowdary05</a>
</p>
