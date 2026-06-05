# Production Readiness

Dokumen ini merangkum hal yang harus disiapkan sebelum aplikasi dipakai di environment production.

## Backend Environment

Gunakan secret kuat dan origin spesifik.

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/student_financial_tracker"
JWT_ACCESS_SECRET="replace-with-long-random-secret"
JWT_REFRESH_SECRET="replace-with-another-long-random-secret"
JWT_ACCESS_EXPIRES_IN="15m"
JWT_REFRESH_EXPIRES_IN="7d"
CORS_ORIGIN="https://your-frontend-domain.example"
PORT=3000
```

Untuk local development, `CORS_ORIGIN` boleh dikosongkan agar backend menerima origin apa pun.

Backend akan gagal start jika `DATABASE_URL`, `JWT_ACCESS_SECRET`, atau `JWT_REFRESH_SECRET` kosong. JWT secret minimal 32 karakter.

## Backend Security Defaults

Backend sudah mengaktifkan:

- Helmet security headers.
- Global request throttling.
- Login/register throttling: 30 requests per minute.
- Refresh token throttling: 60 requests per minute.
- Validation pipe dengan whitelist dan `forbidNonWhitelisted`.

## Android API URL

Local Android emulator:

```bash
flutter build apk --debug --target-platform android-x64 --dart-define=API_BASE_URL=http://10.0.2.2:3000
```

Production build harus memakai API HTTPS:

```bash
flutter build appbundle --release --dart-define=API_BASE_URL=https://api.your-domain.example
```

## Android Release Signing

File `android/app/build.gradle.kts` sudah membaca signing config dari:

```text
frontend/student_financial_tracker_app/android/key.properties
```

Buat file tersebut dari template:

```bash
copy android/key.properties.example android/key.properties
```

Isi:

```properties
storePassword=your-store-password
keyPassword=your-key-password
keyAlias=student-financial-tracker
storeFile=C:/secure/path/upload-keystore.jks
```

Jangan commit `key.properties` atau keystore asli ke repository.

Build release APK:

```bash
flutter build apk --release --dart-define=API_BASE_URL=https://api.your-domain.example
```

Build release app bundle:

```bash
flutter build appbundle --release --dart-define=API_BASE_URL=https://api.your-domain.example
```

Jika `android/key.properties` belum tersedia, release build akan fallback ke debug signing hanya untuk kebutuhan local verification. Untuk distribusi sungguhan, wajib gunakan keystore release.

## Release Checklist

1. Backend production database tersedia.
2. Prisma migrations sudah dijalankan.
3. JWT secrets sudah diganti dari default/local value.
4. `CORS_ORIGIN` sudah spesifik.
5. API production memakai HTTPS.
6. Flutter build memakai `API_BASE_URL` production.
7. Android release signing memakai keystore production.
8. Manual E2E test lulus di APK release atau staging build.
9. Logging dan monitoring backend aktif.
10. Backup database disiapkan.
