# 🏋️ GymRemo — Fitness Tracking Application

A comprehensive fitness tracking application with **3D muscle visualization**, workout logging, progress analytics, and a Spring Boot REST API backend.

![Next.js](https://img.shields.io/badge/Next.js-16.2-black?style=flat-square&logo=next.js)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.2.5-green?style=flat-square&logo=spring)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-blue?style=flat-square&logo=postgresql)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)

---

## ✨ Features

### Core Features
- **Workout Tracking** — Log sets, reps, and weights for 120+ exercises across 12 muscle groups
- **3D Muscle Visualization** — Interactive Three.js body model colored by your strength levels
- **Progress Analytics** — Weight progression, volume trends, and workout frequency charts
- **Personal Records** — Automatic PR detection and tracking
- **5 Unique Themes** — Relaxing, Hardcore, Psycho, Sinner, Unbeatable

### New Features
- **Exercise Encyclopedia** — Browse and filter 120+ exercises by muscle group, equipment, and difficulty
- **Workout Templates** — Pre-built PPL, Upper/Lower, Full Body, and 5x5 programs
- **Rest Timer** — Floating timer with sound notifications and quick presets (60s, 90s, 2m, 3m)
- **Expanded Muscle Groups** — Now includes Neck, Glutes, Core, and Calves
- **JWT Authentication** — Secure login/signup with access + refresh tokens

---

## 🏗️ Architecture

```
gym-remo/
├── app/                          # Next.js pages (App Router)
│   ├── page.tsx                  # Landing page
│   ├── auth/page.tsx             # Login/Signup
│   ├── onboarding/page.tsx       # User onboarding (3 steps)
│   ├── dashboard/page.tsx        # Dashboard with stats
│   ├── add-workout/page.tsx      # Workout logging + rest timer
│   ├── progress/page.tsx         # Charts and analytics
│   ├── exercises/page.tsx        # Exercise encyclopedia NEW
│   ├── templates/page.tsx        # Workout templates NEW
│   ├── 3d-view/page.tsx          # 3D muscle visualization
│   ├── profile/page.tsx          # Profile and settings
│   └── workout-history/page.tsx  # Workout history
├── components/                   # React components
├── contexts/                     # React contexts (API-integrated)
├── lib/                          # Utilities
├── backend/                      # Spring Boot backend NEW
│   ├── src/main/java/com/gymremo/
│   │   ├── entity/               # JPA entities
│   │   ├── repository/           # Spring Data repositories
│   │   ├── service/              # Business logic
│   │   ├── controller/           # REST controllers
│   │   ├── security/             # JWT auth filter
│   │   ├── config/               # Security and CORS config
│   │   └── dto/                  # Request/response DTOs
│   ├── src/main/resources/
│   │   ├── application.properties
│   │   └── data.sql              # Exercise seed data
│   ├── Dockerfile
│   ├── render.yaml
│   └── pom.xml
└── .github/workflows/deploy.yml  # CI/CD pipeline
```

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** 20+
- **Java** 17+
- **PostgreSQL** 15+ (for backend)
- **Maven** 3.9+

### Frontend (Next.js)

```bash
npm install
echo "NEXT_PUBLIC_API_URL=http://localhost:8080/api" > .env.local
npm run dev
```

Open http://localhost:3000

### Backend (Spring Boot)

```bash
cd backend
createdb gymremo_db
mvn spring-boot:run -Dspring-boot.run.profiles=dev
```

Backend runs at http://localhost:8080/api

---

## 🔑 API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | /api/auth/signup | No | Create account |
| POST | /api/auth/login | No | Login |
| POST | /api/auth/refresh | No | Refresh JWT token |
| GET | /api/auth/me | Yes | Get current user |
| POST | /api/auth/onboarding | Yes | Complete onboarding |
| PATCH | /api/users/me/profile | Yes | Update profile |
| PUT | /api/users/me/strength | Yes | Update strength assessment |
| GET | /api/workouts | Yes | List all workouts |
| POST | /api/workouts | Yes | Create workout |
| DELETE | /api/workouts/:id | Yes | Delete workout |
| GET | /api/exercises | No | List all exercises |
| GET | /api/exercises/muscle-group/:group | No | Filter exercises by muscle |
| GET | /api/templates | Yes | List workout templates |
| POST | /api/templates | Yes | Create custom template |
| DELETE | /api/templates/:id | Yes | Delete custom template |
| GET | /api/body-weight | Yes | List weight logs |
| POST | /api/body-weight | Yes | Log body weight |
| DELETE | /api/body-weight/:id | Yes | Delete weight log |
| GET | /api/analytics/summary | Yes | Get workout analytics |

---

## 🎨 Themes

| Theme | Description |
|-------|-------------|
| Relaxing | Calm blue/purple, professional and motivating |
| Hardcore | Dark red/black, intense and aggressive |
| Psycho | Neon cyberpunk, wild with glow effects |
| Sinner | Gothic deep purple, dark and mysterious |
| Unbeatable | Elite gold, champion and victorious |

---

## 🌐 Deployment

### Frontend to Vercel
1. Push to GitHub
2. Import in vercel.com
3. Set NEXT_PUBLIC_API_URL to your backend URL

### Backend to Render
1. Push backend/ to GitHub
2. Create Web Service on render.com
3. Set environment variables: JWT_SECRET, DATABASE_URL, CORS_ALLOWED_ORIGINS

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 16.2, React 19, TypeScript 5 |
| 3D Visualization | Three.js, react-three/fiber, react-three/drei |
| UI Components | Shadcn UI, Radix UI, Tailwind CSS 4 |
| Charts | Recharts |
| Backend | Spring Boot 3.2.5, Java 17 |
| Database | PostgreSQL |
| Auth | JWT (jjwt 0.12.3) |
| Deployment | Vercel (frontend), Render (backend) |

---

## License

MIT License
