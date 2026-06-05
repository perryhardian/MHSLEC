# Analytics API

## Overview

Analytics API menyediakan data dashboard keuangan bulanan untuk user yang sedang login. Endpoint ini menggabungkan transaksi, budget, target tabungan, dan financial health score.

## Endpoint

### Dashboard

`GET /analytics/dashboard`

Query optional:

```text
month=6
year=2026
```

Jika `month` atau `year` tidak dikirim, sistem memakai bulan dan tahun saat ini.

## Response Sections

Dashboard response berisi:

- `period`: bulan, tahun, start date, end date
- `summary`: total pemasukan, total pengeluaran, sisa uang
- `financialHealthScore`: skor dan label kondisi finansial
- `budgets`: daftar budget dengan usage summary
- `savingsGoals`: target tabungan dengan progress
- `savingsSummary`: total target, total terkumpul, rata-rata progress
- `expenseByCategory`: pengeluaran per kategori
- `recentTransactions`: 5 transaksi terbaru pada periode tersebut

## Financial Health Score

Skor dihitung dari:

- Cashflow score: sisa uang dibanding pemasukan
- Savings score: progress tabungan
- Budget score: jumlah budget yang tidak melewati batas

Label:

- `HEALTHY`: skor >= 80
- `STABLE`: skor >= 60
- `WARNING`: skor >= 40
- `CRITICAL`: skor < 40

## Implementation Files

```text
src/modules/analytics
|-- analytics.controller.ts
|-- analytics.module.ts
|-- analytics.service.ts
|-- dto
|   |-- dashboard-query.dto.ts
```
