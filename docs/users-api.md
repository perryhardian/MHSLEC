# Users API

## Overview

Users API menyediakan endpoint profil untuk user yang sedang login. Semua endpoint membutuhkan JWT access token.

## Endpoints

### Get Current Profile

`GET /users/me`

Response:

```json
{
  "id": "uuid",
  "name": "Student Name",
  "email": "student@example.com",
  "role": "STUDENT",
  "monthlyAllowance": 1500000,
  "phoneNumber": "081234567890",
  "university": "Updated University",
  "createdAt": "2026-06-02T00:00:00.000Z",
  "updatedAt": "2026-06-02T00:00:00.000Z"
}
```

### Update Current Profile

`PATCH /users/me`

Request:

```json
{
  "name": "Updated Profile User",
  "phoneNumber": "081234567890",
  "university": "Updated University",
  "monthlyAllowance": 1500000
}
```

## Notes

- Response profil tidak mengembalikan `passwordHash`.
- Email tidak diubah melalui endpoint ini agar perubahan identitas login bisa dibuat sebagai flow terpisah.
- `monthlyAllowance` dipakai untuk dashboard, laporan, dan rekomendasi finansial berikutnya.

## Implementation Files

```text
src/modules/users
|-- users.controller.ts
|-- users.module.ts
|-- users.service.ts
|-- dto
|   |-- update-profile.dto.ts
```
