# Auth JWT Implementation

## Overview

Auth menggunakan kombinasi access token dan refresh token.

- Access token dipakai untuk mengakses endpoint protected.
- Refresh token dipakai untuk membuat access token baru.
- Password disimpan sebagai bcrypt hash.
- Refresh token tidak disimpan mentah di database, tetapi disimpan sebagai SHA-256 hash di tabel `refresh_tokens`.
- Saat refresh token dipakai, token lama langsung di-revoke dan sistem membuat pasangan token baru.

## Environment Variables

```env
JWT_ACCESS_SECRET="student-financial-tracker-access-secret"
JWT_REFRESH_SECRET="student-financial-tracker-refresh-secret"
JWT_ACCESS_EXPIRES_IN="15m"
JWT_REFRESH_EXPIRES_IN="7d"
```

Untuk production, secret harus diganti dengan nilai acak yang panjang dan tidak boleh disimpan di repository.

## Endpoints

### Register

`POST /auth/register`

Request:

```json
{
  "name": "Budi Santoso",
  "email": "budi@example.com",
  "password": "password123",
  "phoneNumber": "08123456789",
  "university": "Universitas Contoh"
}
```

Response:

```json
{
  "user": {
    "id": "uuid",
    "name": "Budi Santoso",
    "email": "budi@example.com",
    "role": "STUDENT"
  },
  "tokens": {
    "accessToken": "jwt-access-token",
    "refreshToken": "jwt-refresh-token"
  }
}
```

### Login

`POST /auth/login`

Request:

```json
{
  "email": "budi@example.com",
  "password": "password123"
}
```

### Refresh Token

`POST /auth/refresh`

Request:

```json
{
  "refreshToken": "jwt-refresh-token"
}
```

### Logout

`POST /auth/logout`

Header:

```text
Authorization: Bearer jwt-access-token
```

Request:

```json
{
  "refreshToken": "jwt-refresh-token"
}
```

### Current User

`GET /auth/me`

Header:

```text
Authorization: Bearer jwt-access-token
```

Response:

```json
{
  "id": "uuid",
  "email": "budi@example.com",
  "name": "Budi Santoso",
  "role": "STUDENT"
}
```

## Implementation Files

```text
src/modules/auth
|-- auth.controller.ts
|-- auth.module.ts
|-- auth.service.ts
|-- decorators
|   |-- current-user.decorator.ts
|-- dto
|   |-- login.dto.ts
|   |-- refresh-token.dto.ts
|   |-- register.dto.ts
|-- guards
|   |-- jwt-auth.guard.ts
|-- strategies
|   |-- jwt.strategy.ts
|-- types
|   |-- auth-user.type.ts
|   |-- jwt-payload.type.ts
```

## Best Practice Notes

- Gunakan `ValidationPipe` global agar body request hanya menerima field yang diizinkan DTO.
- Jangan mengembalikan `password_hash` ke client.
- Jangan menyimpan refresh token mentah di database.
- Gunakan access token berdurasi pendek.
- Revoke refresh token lama saat refresh token dipakai.
- Gunakan `JwtAuthGuard` untuk endpoint yang butuh login.
