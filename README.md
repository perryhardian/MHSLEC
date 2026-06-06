# SakuAman

SakuAman adalah aplikasi pencatatan keuangan mahasiswa dengan backend NestJS modular monolith, PostgreSQL, Prisma ORM, dan frontend Flutter mobile.

## Fitur Utama

- Auth JWT dengan access token dan refresh token
- Profile user dan uang bulanan
- Kategori default dan kategori custom
- Transaksi income/expense dengan CRUD
- Budget bulanan dengan CRUD dan progress pemakaian
- Savings goals dengan CRUD dan kontribusi tabungan
- Analytics dashboard
- Monthly reports
- Notifications
- Flutter Android emulator app

## Dokumentasi

- [Database Design](docs/database-design.md)
- [Modular Monolith Architecture](docs/modular-monolith.md)
- [Auth JWT Implementation](docs/auth-jwt.md)
- [Users API](docs/users-api.md)
- [Transactions API](docs/transactions-api.md)
- [Savings Goals API](docs/savings-goals-api.md)
- [Analytics API](docs/analytics-api.md)
- [Reports API](docs/reports-api.md)
- [Notifications API](docs/notifications-api.md)
- [Flutter Frontend](docs/flutter-frontend.md)
- [Mobile Runbook](docs/mobile-runbook.md)
- [Production Readiness](docs/production-readiness.md)
- [E2E Checklist](docs/e2e-checklist.md)
- [Deployment](docs/deployment.md)

## Backend Setup

Install dependency:

```bash
npm install
```

Siapkan database PostgreSQL dan `.env`:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/student_financial_tracker"
JWT_ACCESS_SECRET="change-me-access-secret-at-least-32-chars"
JWT_REFRESH_SECRET="change-me-refresh-secret-at-least-32-chars"
JWT_ACCESS_EXPIRES_IN="15m"
JWT_REFRESH_EXPIRES_IN="7d"
CORS_ORIGIN=""
```

Generate Prisma client, migrate, dan seed:

```bash
npx prisma generate
npx prisma migrate dev
npm run prisma:seed
```

Untuk production atau Docker, gunakan migration deploy:

```bash
npx prisma migrate deploy
```

Jalankan backend:

```bash
npm run build
npm run start:prod
```

Backend lokal berjalan di:

```text
http://localhost:3000
```

## Flutter Mobile Setup

Frontend berada di:

```text
frontend/student_financial_tracker_app
```

Untuk Android emulator, gunakan base URL:

```text
http://10.0.2.2:3000
```

Jalankan test Flutter:

```bash
flutter test --dart-define=API_BASE_URL=http://localhost:3000
```

Build APK debug untuk emulator:

```bash
flutter build apk --debug --target-platform android-x64 --dart-define=API_BASE_URL=http://10.0.2.2:3000
```

## Validasi

Backend:

```bash
npm run build
npm test
```

Frontend:

```bash
flutter analyze
flutter test --dart-define=API_BASE_URL=http://localhost:3000
```

Full local validation:

```powershell
.\scripts\validate-local.ps1
```

With emulator install:

```powershell
.\scripts\validate-local.ps1 -InstallEmulator
```

Android emulator:

```bash
flutter devices
flutter emulators --launch Medium_Phone_API_36.1
adb install -r build/app/outputs/flutter-apk/app-debug.apk
```

## Status MVP

Status saat ini: sekitar 90% siap sebagai MVP mobile/release candidate lokal, di luar bug.

Sudah siap:

- Backend modular monolith
- Database schema, migration, seed
- Auth/session flow
- Flutter mobile app
- Transaksi, budget, savings goals
- Reports, notifications, profile, categories
- Integration tests
- APK emulator build

Sisa menuju production-ready:

- Manual E2E testing lengkap di emulator
- UI polishing mobile
- Release signing Android
- Environment production/staging
- Backend deployment
- Monitoring/logging production
