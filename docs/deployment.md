# Deployment

Dokumen ini menjelaskan opsi deployment backend dan mobile release.

## Docker Local/Staging

Build dan jalankan backend + PostgreSQL:

```bash
docker compose up --build
```

Jalankan Prisma migration di container API:

```bash
docker compose exec api npx prisma migrate deploy
docker compose exec api npm run prisma:seed
```

Cek API:

```bash
curl http://localhost:3000
```

## Backend Production

Minimum environment variables:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/student_financial_tracker"
JWT_ACCESS_SECRET="long-random-secret-at-least-32-characters"
JWT_REFRESH_SECRET="another-long-random-secret-at-least-32-characters"
JWT_ACCESS_EXPIRES_IN="15m"
JWT_REFRESH_EXPIRES_IN="7d"
CORS_ORIGIN="https://your-app-domain.example"
PORT=3000
```

Deployment steps:

1. Provision PostgreSQL.
2. Set environment variables.
3. Build Docker image.
4. Run `npx prisma migrate deploy`.
5. Run seed only when default categories are needed.
6. Start API with `node dist/src/main.js`.
7. Verify health with `GET /`.

## Mobile Release

Build Android App Bundle:

```bash
cd frontend/student_financial_tracker_app
flutter build appbundle --release --dart-define=API_BASE_URL=https://api.your-domain.example
```

Build Android APK:

```bash
flutter build apk --release --dart-define=API_BASE_URL=https://api.your-domain.example
```

Release signing reads `android/key.properties`. See [Production Readiness](production-readiness.md).
