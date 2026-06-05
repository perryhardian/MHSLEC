# Reports API

## Overview

Reports API menyediakan laporan bulanan yang lebih lengkap dan siap dipakai untuk halaman laporan aplikasi maupun dokumen capstone. Semua endpoint membutuhkan JWT access token.

## Endpoint

### Monthly Report

`GET /reports/monthly`

Query optional:

```text
month=6
year=2026
```

Jika `month` atau `year` tidak dikirim, sistem memakai bulan dan tahun saat ini.

## Response Sections

Monthly report response berisi:

- `period`: bulan, tahun, start date, end date
- `summary`: total pemasukan, total pengeluaran, sisa uang, jumlah transaksi
- `financialHealthSnapshot`: snapshot skor kesehatan finansial jika sudah tersedia
- `incomeByCategory`: total pemasukan per kategori
- `expenseByCategory`: total pengeluaran per kategori
- `budgetPerformance`: performa budget pada periode laporan
- `savingsProgress`: progress semua target tabungan
- `transactions`: daftar transaksi pada periode laporan

## Notes

- `financialHealthSnapshot` dibuat atau diperbarui saat endpoint Analytics Dashboard dipanggil.
- Jika belum ada snapshot, field `financialHealthSnapshot` akan bernilai `null`.
- Report hanya mengembalikan data milik user yang sedang login.

## Implementation Files

```text
src/modules/reports
|-- reports.controller.ts
|-- reports.module.ts
|-- reports.service.ts
|-- dto
|   |-- monthly-report-query.dto.ts
```
