# Database Design - Student Financial Tracker

## Overview

Database utama aplikasi menggunakan PostgreSQL dan dikelola melalui Prisma ORM. Desain ini disusun untuk arsitektur modular monolith: setiap domain fitur memiliki tabel dan relasi yang jelas, tetapi tetap berada dalam satu database dan satu aplikasi backend NestJS.

Fokus utama database adalah mendukung pencatatan pemasukan, pengeluaran, budget bulanan, target tabungan, notifikasi, laporan, dan autentikasi JWT.

## Entity Relationship Summary

```text
users
  |-- categories
  |-- transactions
  |-- budgets
  |-- savings_goals
  |     |-- savings_contributions
  |-- notifications
  |-- refresh_tokens
  |-- financial_health_snapshots

categories
  |-- transactions
  |-- budgets
```

## Tables

### users

Menyimpan data akun mahasiswa.

| Column | Type | Constraint | Description |
| --- | --- | --- | --- |
| id | String/UUID | Primary Key | ID unik user |
| name | String | Required | Nama user |
| email | String | Unique, Required | Email login |
| password_hash | String | Required | Password yang sudah di-hash |
| role | UserRole | Default STUDENT | Role user |
| monthly_allowance | Decimal(14,2) | Nullable | Estimasi uang bulanan |
| phone_number | String | Nullable | Nomor telepon |
| university | String | Nullable | Nama kampus |
| created_at | DateTime | Default now | Waktu dibuat |
| updated_at | DateTime | Auto update | Waktu update terakhir |

Relasi:
- One-to-many ke `transactions`, `budgets`, `savings_goals`, `notifications`, `refresh_tokens`, dan `financial_health_snapshots`.
- One-to-many opsional ke `categories` untuk kategori custom milik user.

### categories

Menyimpan kategori transaksi, baik kategori default global maupun kategori custom user.

| Column | Type | Constraint | Description |
| --- | --- | --- | --- |
| id | String/UUID | Primary Key | ID kategori |
| user_id | String/UUID | FK nullable | Pemilik kategori custom, null untuk kategori default |
| name | String | Required | Nama kategori |
| type | TransactionType | Required | INCOME atau EXPENSE |
| kind | CategoryKind | Default CUSTOM | DEFAULT atau CUSTOM |
| icon | String | Nullable | Nama icon UI |
| color | String | Nullable | Warna kategori |
| created_at | DateTime | Default now | Waktu dibuat |
| updated_at | DateTime | Auto update | Waktu update terakhir |

Constraint:
- Unique composite: `user_id`, `name`, `type`.
- FK `user_id` ke `users.id` dengan `onDelete: Cascade`.

Relasi:
- One-to-many ke `transactions`.
- One-to-many ke `budgets`.

### transactions

Menyimpan catatan pemasukan dan pengeluaran user.

| Column | Type | Constraint | Description |
| --- | --- | --- | --- |
| id | String/UUID | Primary Key | ID transaksi |
| user_id | String/UUID | FK required | Pemilik transaksi |
| category_id | String/UUID | FK required | Kategori transaksi |
| type | TransactionType | Required | INCOME atau EXPENSE |
| amount | Decimal(14,2) | Required | Nominal transaksi |
| title | String | Required | Judul transaksi |
| description | String | Nullable | Catatan tambahan |
| transaction_at | DateTime | Required | Tanggal transaksi |
| attachment_url | String | Nullable | URL bukti transaksi |
| created_at | DateTime | Default now | Waktu dibuat |
| updated_at | DateTime | Auto update | Waktu update terakhir |

Index:
- `user_id`, `transaction_at` untuk riwayat dan laporan bulanan.
- `category_id` untuk analisis per kategori.

Relasi:
- Many-to-one ke `users`.
- Many-to-one ke `categories`.

### budgets

Menyimpan anggaran user, bisa umum atau per kategori.

| Column | Type | Constraint | Description |
| --- | --- | --- | --- |
| id | String/UUID | Primary Key | ID budget |
| user_id | String/UUID | FK required | Pemilik budget |
| category_id | String/UUID | FK nullable | Kategori budget, null untuk budget umum |
| name | String | Required | Nama budget |
| period | BudgetPeriod | Default MONTHLY | MONTHLY atau WEEKLY |
| limit_amount | Decimal(14,2) | Required | Batas budget |
| start_date | DateTime | Required | Awal periode |
| end_date | DateTime | Required | Akhir periode |
| created_at | DateTime | Default now | Waktu dibuat |
| updated_at | DateTime | Auto update | Waktu update terakhir |

Index:
- `user_id`, `start_date`, `end_date` untuk monitoring sisa uang.
- `category_id` untuk budget per kategori.

Relasi:
- Many-to-one ke `users`.
- Many-to-one opsional ke `categories`.

### savings_goals

Menyimpan target tabungan user.

| Column | Type | Constraint | Description |
| --- | --- | --- | --- |
| id | String/UUID | Primary Key | ID target tabungan |
| user_id | String/UUID | FK required | Pemilik target |
| name | String | Required | Nama target |
| target_amount | Decimal(14,2) | Required | Nominal target |
| current_amount | Decimal(14,2) | Default 0 | Progress nominal terkumpul |
| target_date | DateTime | Nullable | Tanggal target |
| status | GoalStatus | Default ACTIVE | ACTIVE, COMPLETED, CANCELLED |
| created_at | DateTime | Default now | Waktu dibuat |
| updated_at | DateTime | Auto update | Waktu update terakhir |

Index:
- `user_id`, `status` untuk daftar target aktif.

Relasi:
- Many-to-one ke `users`.
- One-to-many ke `savings_contributions`.

### savings_contributions

Menyimpan riwayat setoran ke target tabungan.

| Column | Type | Constraint | Description |
| --- | --- | --- | --- |
| id | String/UUID | Primary Key | ID kontribusi |
| user_id | String/UUID | FK required | Pemilik kontribusi |
| savings_goal_id | String/UUID | FK required | Target tabungan |
| amount | Decimal(14,2) | Required | Nominal setoran |
| note | String | Nullable | Catatan setoran |
| contributed_at | DateTime | Required | Tanggal setoran |
| created_at | DateTime | Default now | Waktu dibuat |

Index:
- `user_id`, `contributed_at`.
- `savings_goal_id`.

Relasi:
- Many-to-one ke `users`.
- Many-to-one ke `savings_goals`.

### notifications

Menyimpan notifikasi dan reminder keuangan.

| Column | Type | Constraint | Description |
| --- | --- | --- | --- |
| id | String/UUID | Primary Key | ID notifikasi |
| user_id | String/UUID | FK required | Penerima notifikasi |
| type | NotificationType | Required | Jenis notifikasi |
| status | NotificationStatus | Default UNREAD | UNREAD atau READ |
| title | String | Required | Judul notifikasi |
| message | String | Required | Isi notifikasi |
| sent_at | DateTime | Nullable | Waktu dikirim |
| read_at | DateTime | Nullable | Waktu dibaca |
| created_at | DateTime | Default now | Waktu dibuat |

Index:
- `user_id`, `status` untuk inbox notifikasi.

Relasi:
- Many-to-one ke `users`.

### refresh_tokens

Menyimpan refresh token yang sudah di-hash untuk JWT authentication.

| Column | Type | Constraint | Description |
| --- | --- | --- | --- |
| id | String/UUID | Primary Key | ID token |
| user_id | String/UUID | FK required | Pemilik token |
| token_hash | String | Unique, Required | Hash refresh token |
| expires_at | DateTime | Required | Waktu kedaluwarsa |
| revoked_at | DateTime | Nullable | Waktu token dicabut |
| created_at | DateTime | Default now | Waktu dibuat |

Index:
- `user_id`.
- `expires_at` untuk cleanup token kedaluwarsa.

Relasi:
- Many-to-one ke `users`.

### financial_health_snapshots

Menyimpan ringkasan kesehatan finansial bulanan.

| Column | Type | Constraint | Description |
| --- | --- | --- | --- |
| id | String/UUID | Primary Key | ID snapshot |
| user_id | String/UUID | FK required | Pemilik snapshot |
| score | Int | Required | Skor kesehatan finansial |
| month | Int | Required | Bulan snapshot |
| year | Int | Required | Tahun snapshot |
| total_income | Decimal(14,2) | Required | Total pemasukan bulanan |
| total_expense | Decimal(14,2) | Required | Total pengeluaran bulanan |
| remaining_money | Decimal(14,2) | Required | Sisa uang bulanan |
| savings_progress_rate | Decimal(5,2) | Required | Persentase progress tabungan |
| created_at | DateTime | Default now | Waktu dibuat |

Constraint:
- Unique composite: `user_id`, `month`, `year`.

Relasi:
- Many-to-one ke `users`.

## Enums

| Enum | Values | Purpose |
| --- | --- | --- |
| UserRole | STUDENT, ADMIN | Hak akses user |
| TransactionType | INCOME, EXPENSE | Jenis transaksi |
| CategoryKind | DEFAULT, CUSTOM | Sumber kategori |
| BudgetPeriod | MONTHLY, WEEKLY | Periode budget |
| GoalStatus | ACTIVE, COMPLETED, CANCELLED | Status target tabungan |
| NotificationType | BUDGET_WARNING, BUDGET_EXCEEDED, SAVINGS_REMINDER, MONTHLY_REPORT, GENERAL | Jenis notifikasi |
| NotificationStatus | UNREAD, READ | Status baca notifikasi |

## Design Rationale

- `Decimal(14,2)` digunakan untuk data uang agar tidak terkena masalah presisi floating point.
- Kategori default memakai `user_id = null`, sehingga semua user dapat memakai kategori umum tanpa duplikasi.
- Kategori custom tetap didukung melalui `user_id`.
- `refresh_tokens` disimpan sebagai hash untuk mengurangi risiko saat data token bocor.
- `financial_health_snapshots` dipisah dari transaksi agar dashboard dan laporan bulanan bisa lebih cepat.
- Index dibuat pada kolom yang sering dipakai untuk filter: user, tanggal transaksi, periode budget, status target, dan status notifikasi.
