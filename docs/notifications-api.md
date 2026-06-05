# Notifications API

## Overview

Notifications API menyediakan notifikasi internal aplikasi untuk user yang sedang login. Modul ini belum mengirim push notification eksternal, tetapi sudah menyiapkan data notifikasi yang bisa ditampilkan di Flutter.

## Endpoints

### List Notifications

`GET /notifications`

Query optional:

```text
status=UNREAD|READ
type=BUDGET_WARNING|BUDGET_EXCEEDED|SAVINGS_REMINDER|MONTHLY_REPORT|GENERAL
```

### Generate Financial Notifications

`POST /notifications/generate`

Membuat notifikasi berdasarkan kondisi saat ini:

- Budget warning jika budget mencapai minimal 80%.
- Budget exceeded jika budget melewati 100%.
- Savings reminder jika target tabungan aktif masih di bawah 50%.

### Mark Notification As Read

`PATCH /notifications/:id/read`

### Mark All As Read

`PATCH /notifications/read-all`

### Delete Notification

`DELETE /notifications/:id`

## Notes

- User hanya bisa mengakses notifikasi miliknya sendiri.
- Generator menghindari duplikasi notifikasi unread dengan isi yang sama.
- Field `readAt` diisi saat notifikasi ditandai sebagai READ.

## Implementation Files

```text
src/modules/notifications
|-- notifications.controller.ts
|-- notifications.module.ts
|-- notifications.service.ts
|-- dto
|   |-- list-notifications-query.dto.ts
```
