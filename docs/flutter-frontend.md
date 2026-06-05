# Flutter Frontend

## Location

```text
frontend/student_financial_tracker_app
```

## Current Scope

Frontend MVP awal sudah mencakup:

- Flutter app scaffold
- Riverpod state management
- Dio API client
- Secure token storage
- Login/Register screen
- Auth state check on app launch
- Logout
- Dashboard screen consuming `GET /analytics/dashboard`

## API Base URL

Default API base URL:

```text
http://localhost:3000
```

Untuk Android emulator gunakan:

```bash
flutter run --dart-define=API_BASE_URL=http://10.0.2.2:3000
```

Untuk device fisik, gunakan IP laptop pada jaringan lokal:

```bash
flutter run --dart-define=API_BASE_URL=http://192.168.x.x:3000
```

## Validation

Run:

```bash
flutter analyze
flutter test
```

## Notes

Windows desktop build dengan plugin seperti `flutter_secure_storage` membutuhkan Developer Mode agar symlink plugin dapat dibuat.
