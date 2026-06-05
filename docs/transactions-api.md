# Transactions API

## Overview

Transactions API digunakan untuk mencatat pemasukan dan pengeluaran mahasiswa. Semua endpoint membutuhkan JWT access token.

Aturan utama:

- User hanya bisa mengakses transaksi miliknya sendiri.
- Kategori transaksi harus kategori default atau kategori custom milik user.
- `type` transaksi harus sama dengan `type` kategori.
- Nominal transaksi memakai maksimal 2 angka desimal.

## Endpoints

### List Transactions

`GET /transactions`

Query optional:

```text
type=INCOME|EXPENSE
categoryId=uuid
startDate=2026-06-01
endDate=2026-06-30
page=1
limit=20
```

### Detail Transaction

`GET /transactions/:id`

### Create Transaction

`POST /transactions`

Request:

```json
{
  "categoryId": "uuid",
  "type": "EXPENSE",
  "amount": 25000,
  "title": "Makan siang",
  "description": "Kantin kampus",
  "transactionAt": "2026-06-02T12:00:00.000Z"
}
```

### Update Transaction

`PATCH /transactions/:id`

Request dapat mengirim sebagian field:

```json
{
  "amount": 30000,
  "description": "Makan siang dan minum"
}
```

### Delete Transaction

`DELETE /transactions/:id`

## Implementation Files

```text
src/modules/transactions
|-- transactions.controller.ts
|-- transactions.module.ts
|-- transactions.service.ts
|-- dto
|   |-- create-transaction.dto.ts
|   |-- list-transactions-query.dto.ts
|   |-- update-transaction.dto.ts
```
