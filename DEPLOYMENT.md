# GymRemo Deployment Guide

## Prerequisites

- GitHub repository with the GymRemo codebase
- Accounts on Vercel and Render (both have free tiers)

---

## 1. Deploy Backend to Render

### Step 1: Create PostgreSQL Database

1. Go to [render.com](https://render.com) and sign in
2. Click **New** > **PostgreSQL**
3. Configure:
   - **Name**: `gymremo-db`
   - **Database**: `gymremo_db`
   - **User**: `gymremo_user`
   - **Region**: Oregon (or closest to your users)
   - **Plan**: Free
4. Click **Create Database**
5. Copy the **Internal Database URL** for later

### Step 2: Create Web Service

1. Click **New** > **Web Service**
2. Connect your GitHub repository
3. Configure:
   - **Name**: `gymremo-backend`
   - **Root Directory**: `backend`
   - **Runtime**: Docker
   - **Plan**: Free
4. Add environment variables:

| Variable | Value |
|----------|-------|
| `SPRING_PROFILES_ACTIVE` | `prod` |
| `DATABASE_URL` | `jdbc:postgresql://...` (from Step 1) |
| `DATABASE_USERNAME` | (from Step 1) |
| `DATABASE_PASSWORD` | (from Step 1) |
| `JWT_SECRET` | Generate a 64+ character random string |
| `CORS_ALLOWED_ORIGINS` | `https://your-app.vercel.app` |
| `PORT` | `8080` |

5. Click **Create Web Service**

### Step 3: Verify

```bash
curl https://gymremo-backend.onrender.com/api/exercises
```

---

## 2. Deploy Frontend to Vercel

### Step 1: Import Project

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click **New Project**
3. Import your GitHub repository
4. Framework: **Next.js** (auto-detected)

### Step 2: Configure Environment Variables

| Variable | Value |
|----------|-------|
| `NEXT_PUBLIC_API_URL` | `https://gymremo-backend.onrender.com/api` |

### Step 3: Deploy

1. Click **Deploy**
2. Wait for build to complete
3. Update Render's `CORS_ALLOWED_ORIGINS` with your Vercel URL

---

## 3. Post-Deployment

### Verify End-to-End

1. Open your Vercel URL
2. Create a new account
3. Complete onboarding
4. Add a workout
5. Check the 3D visualization

### Monitor

- **Render Dashboard**: Check backend logs and health
- **Vercel Dashboard**: Check frontend build logs and analytics
- **Database**: Use Render's built-in DB explorer

---

## 4. Local Development

### Backend

```bash
# Start PostgreSQL (Docker option)
docker run -d --name gymremo-pg \
  -e POSTGRES_DB=gymremo_db \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -p 5432:5432 \
  postgres:16-alpine

# Run Spring Boot
cd backend
mvn spring-boot:run -Dspring-boot.run.profiles=dev
```

### Frontend

```bash
# In project root
npm install
npm run dev
```

### Environment Variables

Create `.env.local` in project root:

```env
NEXT_PUBLIC_API_URL=http://localhost:8080/api
```

---

## 5. Troubleshooting

### Backend won't start on Render
- Check that `PORT` is set to `8080`
- Verify database credentials are correct
- Check Render build logs for Maven errors

### CORS errors in browser
- Ensure `CORS_ALLOWED_ORIGINS` includes your exact Vercel URL (no trailing slash)
- Make sure the URL uses `https://` not `http://`

### Database connection timeout
- Render free tier databases sleep after 15 minutes of inactivity
- First request after sleep may take 30-60 seconds

### JWT token errors
- Ensure `JWT_SECRET` is at least 32 characters
- Check that frontend is sending the `Authorization: Bearer <token>` header
