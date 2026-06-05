# Modular Monolith Architecture

## Overview

Student Financial Tracker menggunakan arsitektur modular monolith. Backend tetap berjalan sebagai satu aplikasi NestJS dan satu deployment, tetapi kode dipisahkan berdasarkan domain fitur agar lebih mudah dikembangkan, diuji, dan dirawat.

## Current Backend Structure

```text
src
|-- app.module.ts
|-- prisma
|   |-- prisma.module.ts
|   |-- prisma.service.ts
|-- modules
|   |-- auth
|   |-- users
|   |-- categories
|   |-- transactions
|   |-- budgets
|   |-- savings-goals
|   |-- notifications
|   |-- analytics
|   |-- reports
```

## Module Responsibilities

| Module | Responsibility |
| --- | --- |
| AuthModule | Registrasi, login, logout, JWT access token, refresh token |
| UsersModule | Profil user, data mahasiswa, pengaturan akun |
| CategoriesModule | Kategori default dan kategori custom |
| TransactionsModule | Pencatatan pemasukan dan pengeluaran |
| BudgetsModule | Pengaturan budget mingguan atau bulanan |
| SavingsGoalsModule | Target tabungan dan kontribusi tabungan |
| NotificationsModule | Reminder, warning budget, dan status notifikasi |
| AnalyticsModule | Dashboard, statistik, financial health score |
| ReportsModule | Laporan bulanan dan ringkasan keuangan |
| PrismaModule | Database access layer bersama untuk seluruh modul |

## Layering Direction

Setiap domain module akan dikembangkan dengan pola berikut:

```text
module
|-- controllers
|-- services
|-- dto
|-- repositories
|-- types
```

Pada tahap scaffold saat ini, setiap module baru memiliki `module.ts` dan `service.ts`. Controller, DTO, repository, dan guard akan ditambahkan saat implementasi fitur dimulai.

## Design Notes

- `PrismaModule` dibuat global agar service domain bisa memakai `PrismaService` tanpa import berulang.
- Setiap module domain bertanggung jawab pada satu bounded context fitur.
- Komunikasi antar domain dilakukan melalui service yang diekspor, bukan akses langsung ke detail internal module lain.
- Database tetap satu PostgreSQL schema untuk menjaga implementasi capstone tetap realistis dan mudah dioperasikan.
