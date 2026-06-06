# Flutter UI Redesign

Dokumen ini merangkum design system sederhana untuk aplikasi financial tracker mahasiswa.

## Arah Visual

- Gaya: modern, clean, utilitarian, financial-friendly.
- Karakter: tenang, mudah dipindai, tidak ramai, cocok untuk pemakaian harian mahasiswa.
- Navigasi: bottom navigation maksimal 5 menu utama: Dashboard, Transaksi, Budget, Tabungan, Laporan.
- Ikon: Material Icons konsisten, tanpa emoji sebagai ikon struktural.

## Warna

- Primary: `#0F766E` untuk aksi utama dan identitas brand.
- Primary dark: `#115E59` untuk teks/ikon utama di permukaan teal.
- Background: `#F3F6F8` untuk latar aplikasi.
- Surface: `#FFFFFF` untuk card dan sheet.
- Text utama: `#0F172A`; text sekunder: `#475569`.
- Income/success: `#047857`.
- Expense/danger: `#DC2626`.
- Warning: `#D97706`.
- Savings/accent: `#4F46E5`; analytic accent: `#2563EB`.

## Typography

- Font: Roboto/system Material.
- Heading: weight 700-800, line-height rapat untuk judul.
- Body: minimal 14-16px dengan line-height sekitar 1.4-1.5.
- Nominal uang: bold/extra-bold, gunakan `FittedBox` pada area sempit agar tidak overflow.

## Spacing & Shape

- Spacing scale: 4, 8, 12, 16, 24, 32.
- Card padding default: 16; large card: 20.
- Border radius: 8 untuk card, button, input, badge.
- Touch target: button dan icon button minimal sekitar 44-48px.
- Shadow: subtle, hanya untuk memisahkan surface dari background.

## Struktur UI Flutter

Shared UI ada di:

```text
lib/src/shared/
  theme/
    app_colors.dart
    app_spacing.dart
    app_theme.dart
  utils/
    app_formatters.dart
  widgets/
    app_buttons.dart
    app_card.dart
    app_state_widgets.dart
    app_text_field.dart
    finance_charts.dart
    metric_card.dart
    progress_stat_card.dart
    section_header.dart
    status_pill.dart
    transaction_item.dart
```

## Komponen Reusable

- `AppCard`: surface card dengan border, radius, shadow, dan optional tap.
- `AppPrimaryButton` / `AppSecondaryButton`: tombol konsisten dengan loading state.
- `AppTextField`: input standar untuk form auth dan form sederhana.
- `MetricCard`: ringkasan nominal, jumlah transaksi, saldo, target.
- `ProgressStatCard`: progress budget dan target tabungan.
- `TransactionItem`: item transaksi dengan kategori, tanggal, nominal, dan aksi.
- `DonutChart` / `MiniBarChart`: visualisasi ringan tanpa dependency chart tambahan.
- `AppLoadingState`, `AppErrorState`, `AppEmptyState`: state UI konsisten.

## Halaman yang Di-redesign

- Login/register: form card modern, responsive, password visibility toggle.
- Dashboard: hero saldo, metric cards, financial health score, donut chart kategori, budget, tabungan, transaksi terbaru.
- Transaksi: summary card, list card, warna berbeda untuk income/expense.
- Budget: progress card, status limit, sisa dan terpakai.
- Tabungan: progress target, status aktif/selesai, aksi auto/setor.
- Laporan: month selector, summary cards, bar chart kategori, health snapshot, budget dan savings report.
- Profil: profile hero, informasi pengguna, preferensi finansial, quick settings.
- Kategori dan notifikasi ikut dirapikan agar visual tetap konsisten.
