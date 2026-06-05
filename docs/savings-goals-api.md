# Savings Goals API

## Overview

Savings Goals API digunakan untuk mengelola target tabungan mahasiswa, misalnya menabung untuk laptop, biaya kos, atau dana darurat. Semua endpoint membutuhkan JWT access token.

Aturan utama:

- User hanya bisa mengakses target tabungannya sendiri.
- Kontribusi tabungan menambah `currentAmount` secara atomik.
- Saat `currentAmount` mencapai atau melewati `targetAmount`, status target otomatis menjadi `COMPLETED`.
- Target dengan status `CANCELLED` tidak bisa menerima kontribusi baru.

## Endpoints

### List Savings Goals

`GET /savings-goals`

Query optional:

```text
status=ACTIVE|COMPLETED|CANCELLED
```

### Detail Savings Goal

`GET /savings-goals/:id`

### Create Savings Goal

`POST /savings-goals`

Request:

```json
{
  "name": "Laptop Baru",
  "targetAmount": 5000000,
  "targetDate": "2026-12-31T00:00:00.000Z"
}
```

### Update Savings Goal

`PATCH /savings-goals/:id`

Request dapat mengirim sebagian field:

```json
{
  "name": "Laptop untuk Kuliah",
  "targetAmount": 5500000
}
```

### Delete Savings Goal

`DELETE /savings-goals/:id`

### List Contributions

`GET /savings-goals/:id/contributions`

### Add Contribution

`POST /savings-goals/:id/contributions`

Request:

```json
{
  "amount": 1250000,
  "note": "Setoran bulan Juni",
  "contributedAt": "2026-06-02T10:00:00.000Z"
}
```

## Response Summary Fields

Savings goal response memiliki field tambahan:

- `remainingAmount`
- `progressPercentage`

## Implementation Files

```text
src/modules/savings-goals
|-- savings-goals.controller.ts
|-- savings-goals.module.ts
|-- savings-goals.service.ts
|-- dto
|   |-- add-savings-contribution.dto.ts
|   |-- create-savings-goal.dto.ts
|   |-- list-savings-goals-query.dto.ts
|   |-- update-savings-goal.dto.ts
```
