# Mobile Runbook

Panduan ini dipakai untuk menjalankan Student Financial Tracker sebagai aplikasi Flutter di Android emulator.

## Prasyarat

- PostgreSQL berjalan di `localhost:5432`
- Database `student_financial_tracker` tersedia
- Backend NestJS berjalan di `http://localhost:3000`
- Android emulator tersedia
- Flutter SDK tersedia

## Jalankan Backend

Dari root project:

```bash
npm run build
npm run start:prod
```

Alternatif Docker:

```bash
docker compose up --build
docker compose exec api npx prisma migrate deploy
```

Cek backend:

```bash
curl http://localhost:3000
```

Respons sukses default:

```text
Hello World!
```

## Jalankan Android Emulator

```bash
flutter emulators
flutter emulators --launch Medium_Phone_API_36.1
flutter devices
```

Device Android harus muncul seperti:

```text
emulator-5554 android-x64
```

## Build APK Debug

Dari folder `frontend/student_financial_tracker_app`:

```bash
flutter build apk --debug --target-platform android-x64 --dart-define=API_BASE_URL=http://10.0.2.2:3000
```

Catatan:

- `10.0.2.2` adalah alamat host machine dari Android emulator.
- Jangan gunakan `localhost:3000` di app emulator karena `localhost` berarti emulator itu sendiri.

## Install APK ke Emulator

```bash
adb install -r build/app/outputs/flutter-apk/app-debug.apk
adb shell monkey -p com.studentfinance.student_financial_tracker_app -c android.intent.category.LAUNCHER 1
```

## Validasi Cepat

```bash
flutter analyze
flutter test --dart-define=API_BASE_URL=http://localhost:3000
```

Atau jalankan validasi lengkap dari root project:

```powershell
.\scripts\validate-local.ps1
```

Untuk sekaligus install APK ke emulator:

```powershell
.\scripts\validate-local.ps1 -InstallEmulator
```

## Manual E2E Checklist

1. Register user baru.
2. Login otomatis setelah register.
3. Buka Dashboard dan pastikan tidak error.
4. Tambah transaksi expense.
5. Edit transaksi.
6. Hapus transaksi.
7. Tambah budget.
8. Edit budget.
9. Hapus budget.
10. Tambah savings goal.
11. Setor tabungan.
12. Edit savings goal.
13. Hapus savings goal.
14. Buka Reports dan pindah bulan.
15. Generate Notifications.
16. Tandai notifikasi sebagai read.
17. Edit Profile.
18. Tambah kategori custom.
19. Hapus kategori custom yang belum dipakai transaksi.
20. Logout.

## Troubleshooting

Jika Android build gagal karena NDK:

1. Hapus folder NDK yang rusak di Android SDK.
2. Jalankan build ulang agar Gradle mengunduh ulang NDK.

Jika app emulator tidak bisa akses backend:

1. Pastikan backend hidup di `localhost:3000`.
2. Pastikan APK dibuild dengan `API_BASE_URL=http://10.0.2.2:3000`.
3. Pastikan AndroidManifest memiliki `INTERNET` permission dan `usesCleartextTraffic=true`.
