import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../shared/theme/app_colors.dart';
import '../../shared/theme/app_spacing.dart';
import '../../shared/utils/app_formatters.dart';
import '../../shared/widgets/app_card.dart';
import '../../shared/widgets/app_state_widgets.dart';
import '../../shared/widgets/finance_charts.dart';
import '../../shared/widgets/metric_card.dart';
import '../../shared/widgets/progress_stat_card.dart';
import '../../shared/widgets/section_header.dart';
import '../../shared/widgets/status_pill.dart';
import 'reports_repository.dart';

class ReportsScreen extends ConsumerWidget {
  const ReportsScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final selectedMonth = ref.watch(selectedReportMonthProvider);
    final report = ref.watch(monthlyReportProvider);

    return Scaffold(
      body: report.when(
        data: (data) => RefreshIndicator(
          onRefresh: () async {
            ref.invalidate(monthlyReportProvider);
            await ref.read(monthlyReportProvider.future);
          },
          child: ListView(
            padding: AppInsets.screen,
            children: [
              _MonthSelector(selectedMonth: selectedMonth),
              const SizedBox(height: AppSpacing.lg),
              _SummarySection(summary: _map(data['summary'])),
              const SizedBox(height: AppSpacing.xl),
              _HealthSnapshotCard(
                snapshot: _map(data['financialHealthSnapshot']),
              ),
              const SizedBox(height: AppSpacing.xl),
              _CategorySection(
                title: 'Pengeluaran per kategori',
                items: _list(data['expenseByCategory']),
                color: AppColors.danger,
                emptyMessage: 'Belum ada pengeluaran untuk periode ini.',
              ),
              const SizedBox(height: AppSpacing.xl),
              _CategorySection(
                title: 'Pemasukan per kategori',
                items: _list(data['incomeByCategory']),
                color: AppColors.success,
                emptyMessage: 'Belum ada pemasukan untuk periode ini.',
              ),
              const SizedBox(height: AppSpacing.xl),
              _BudgetSection(items: _list(data['budgetPerformance'])),
              const SizedBox(height: AppSpacing.xl),
              _SavingsSection(items: _list(data['savingsProgress'])),
            ],
          ),
        ),
        loading: () => const AppLoadingState(message: 'Memuat laporan...'),
        error: (error, stackTrace) => AppErrorState(
          message: error.toString(),
          onRetry: () => ref.invalidate(monthlyReportProvider),
        ),
      ),
    );
  }
}

class _MonthSelector extends ConsumerWidget {
  const _MonthSelector({required this.selectedMonth});

  final DateTime selectedMonth;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return AppCard(
      padding: const EdgeInsets.symmetric(
        horizontal: AppSpacing.sm,
        vertical: AppSpacing.sm,
      ),
      child: Row(
        children: [
          IconButton(
            tooltip: 'Bulan sebelumnya',
            onPressed: () =>
                ref.read(selectedReportMonthProvider.notifier).previousMonth(),
            icon: const Icon(Icons.chevron_left),
          ),
          Expanded(
            child: Column(
              children: [
                Text(
                  AppFormatters.month(selectedMonth),
                  textAlign: TextAlign.center,
                  style: Theme.of(context).textTheme.titleMedium,
                ),
                const SizedBox(height: AppSpacing.xs),
                Text(
                  'Laporan bulanan',
                  style: Theme.of(
                    context,
                  ).textTheme.bodySmall?.copyWith(color: AppColors.slate),
                ),
              ],
            ),
          ),
          IconButton(
            tooltip: 'Bulan berikutnya',
            onPressed: () =>
                ref.read(selectedReportMonthProvider.notifier).nextMonth(),
            icon: const Icon(Icons.chevron_right),
          ),
        ],
      ),
    );
  }
}

class _SummarySection extends StatelessWidget {
  const _SummarySection({required this.summary});

  final Map<String, dynamic> summary;

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const SectionHeader(
          title: 'Ringkasan',
          subtitle: 'Total uang masuk, keluar, dan sisa periode ini',
        ),
        Row(
          children: [
            Expanded(
              child: MetricCard(
                title: 'Pemasukan',
                value: AppFormatters.currency(summary['totalIncome']),
                icon: Icons.south_west_rounded,
                color: AppColors.success,
                compact: true,
              ),
            ),
            const SizedBox(width: AppSpacing.md),
            Expanded(
              child: MetricCard(
                title: 'Pengeluaran',
                value: AppFormatters.currency(summary['totalExpense']),
                icon: Icons.north_east_rounded,
                color: AppColors.danger,
                compact: true,
              ),
            ),
          ],
        ),
        const SizedBox(height: AppSpacing.md),
        Row(
          children: [
            Expanded(
              child: MetricCard(
                title: 'Sisa uang',
                value: AppFormatters.currency(summary['remainingMoney']),
                icon: Icons.account_balance_wallet_outlined,
                color: AppColors.primary,
                compact: true,
              ),
            ),
            const SizedBox(width: AppSpacing.md),
            Expanded(
              child: MetricCard(
                title: 'Transaksi',
                value:
                    '${AppFormatters.numberOrZero(summary['transactionCount']).toInt()}',
                icon: Icons.receipt_long_outlined,
                color: AppColors.accent,
                compact: true,
              ),
            ),
          ],
        ),
      ],
    );
  }
}

class _HealthSnapshotCard extends StatefulWidget {
  const _HealthSnapshotCard({required this.snapshot});

  final Map<String, dynamic> snapshot;

  @override
  State<_HealthSnapshotCard> createState() => _HealthSnapshotCardState();
}

class _HealthSnapshotCardState extends State<_HealthSnapshotCard> {
  var _isVisible = true;

  @override
  Widget build(BuildContext context) {
    if (widget.snapshot.isEmpty) {
      return const SizedBox.shrink();
    }

    final score = AppFormatters.numberOrZero(
      widget.snapshot['score'],
    ).clamp(0, 100);
    final savingsRate = AppFormatters.numberOrZero(
      widget.snapshot['savingsProgressRate'],
    ).clamp(0, 100);

    return AppCard(
      padding: AppInsets.cardLarge,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Expanded(
                child: Text(
                  'Financial Health',
                  style: Theme.of(
                    context,
                  ).textTheme.titleLarge?.copyWith(fontWeight: FontWeight.w900),
                ),
              ),
              IconButton(
                onPressed: () => setState(() => _isVisible = !_isVisible),
                tooltip: _isVisible ? 'Sembunyikan' : 'Tampilkan',
                icon: Icon(
                  _isVisible
                      ? Icons.visibility_outlined
                      : Icons.visibility_off_outlined,
                ),
              ),
            ],
          ),
          AnimatedCrossFade(
            duration: const Duration(milliseconds: 180),
            crossFadeState: _isVisible
                ? CrossFadeState.showFirst
                : CrossFadeState.showSecond,
            secondChild: Text(
              'Disembunyikan',
              style: Theme.of(
                context,
              ).textTheme.bodySmall?.copyWith(color: AppColors.slate),
            ),
            firstChild: Column(
              children: [
                Row(
                  children: [
                    SizedBox.square(
                      dimension: 92,
                      child: Stack(
                        alignment: Alignment.center,
                        children: [
                          SizedBox.square(
                            dimension: 86,
                            child: CircularProgressIndicator(
                              value: score / 100,
                              strokeWidth: 8,
                              color: AppColors.primary,
                              backgroundColor: AppColors.primaryLight,
                              strokeCap: StrokeCap.round,
                            ),
                          ),
                          Text(
                            score.toStringAsFixed(0),
                            style: Theme.of(context).textTheme.titleLarge
                                ?.copyWith(fontWeight: FontWeight.w900),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(width: AppSpacing.lg),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const StatusPill(
                            label: 'Financial Health',
                            color: AppColors.primary,
                            icon: Icons.monitor_heart_outlined,
                          ),
                          const SizedBox(height: AppSpacing.sm),
                          Text(
                            _scoreLabel(score),
                            style: Theme.of(context).textTheme.titleLarge
                                ?.copyWith(fontWeight: FontWeight.w900),
                          ),
                          const SizedBox(height: AppSpacing.xs),
                          Text(
                            'Score dihitung dari performa keuangan bulanan.',
                            style: Theme.of(context).textTheme.bodySmall
                                ?.copyWith(color: AppColors.slate),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: AppSpacing.lg),
                Row(
                  children: [
                    Expanded(
                      child: _HealthMetricBox(
                        label: 'Sisa uang',
                        value: AppFormatters.currency(
                          widget.snapshot['remainingMoney'],
                        ),
                      ),
                    ),
                    const SizedBox(width: AppSpacing.md),
                    Expanded(
                      child: _HealthMetricBox(
                        label: 'Tabungan',
                        value: '${savingsRate.toStringAsFixed(0)}%',
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  static String _scoreLabel(num score) {
    if (score >= 80) {
      return 'Sehat';
    }
    if (score >= 60) {
      return 'Stabil';
    }
    if (score >= 40) {
      return 'Perlu dijaga';
    }
    return 'Kritis';
  }
}

class _HealthMetricBox extends StatelessWidget {
  const _HealthMetricBox({required this.label, required this.value});

  final String label;
  final String value;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: AppSpacing.sm),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            label,
            style: Theme.of(
              context,
            ).textTheme.bodySmall?.copyWith(color: AppColors.slate),
          ),
          const SizedBox(height: AppSpacing.xs),
          FittedBox(
            fit: BoxFit.scaleDown,
            alignment: Alignment.centerLeft,
            child: Text(
              value,
              maxLines: 1,
              style: Theme.of(
                context,
              ).textTheme.titleMedium?.copyWith(fontWeight: FontWeight.w900),
            ),
          ),
        ],
      ),
    );
  }
}

class _CategorySection extends StatelessWidget {
  const _CategorySection({
    required this.title,
    required this.items,
    required this.color,
    required this.emptyMessage,
  });

  final String title;
  final List<Map<String, dynamic>> items;
  final Color color;
  final String emptyMessage;

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        SectionHeader(title: title),
        if (items.isEmpty)
          AppCard(child: Text(emptyMessage))
        else
          AppCard(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                MiniBarChart(
                  segments: _segments(items.take(6).toList(), color),
                  barWidth: 54,
                ),
                const SizedBox(height: AppSpacing.lg),
                for (final item in items)
                  _MetricRow(
                    label:
                        '${item['categoryName'] ?? 'Kategori'} (${AppFormatters.numberOrZero(item['transactionCount']).toInt()}x)',
                    value: AppFormatters.currency(item['amount']),
                    color: color,
                  ),
              ],
            ),
          ),
      ],
    );
  }

  static List<ChartSegment> _segments(
    List<Map<String, dynamic>> items,
    Color color,
  ) {
    return [
      for (final item in items)
        ChartSegment(
          label: _shortLabel('${item['categoryName'] ?? 'Kategori'}'),
          value: AppFormatters.numberOrZero(item['amount']).toDouble(),
          color: color,
        ),
    ];
  }

  static String _shortLabel(String value) {
    final trimmed = value.trim();
    if (trimmed.length <= 8) {
      return trimmed;
    }
    return '${trimmed.substring(0, 8)}...';
  }
}

class _BudgetSection extends StatelessWidget {
  const _BudgetSection({required this.items});

  final List<Map<String, dynamic>> items;

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const SectionHeader(
          title: 'Performa budget',
          subtitle: 'Persentase penggunaan limit per budget',
        ),
        if (items.isEmpty)
          const AppCard(child: Text('Belum ada budget untuk periode ini.'))
        else
          for (final item in items) ...[
            ProgressStatCard(
              title: '${item['name'] ?? 'Budget'}',
              subtitle:
                  '${AppFormatters.currency(item['spentAmount'])} dari ${AppFormatters.currency(item['limitAmount'])}',
              progress:
                  AppFormatters.numberOrZero(
                    item['usagePercentage'],
                  ).toDouble() /
                  100,
              color: item['isExceeded'] == true
                  ? AppColors.danger
                  : AppColors.primary,
              icon: Icons.account_balance_wallet_outlined,
              trailing: StatusPill(
                label:
                    '${AppFormatters.numberOrZero(item['usagePercentage']).toStringAsFixed(0)}%',
                color: item['isExceeded'] == true
                    ? AppColors.danger
                    : AppColors.primary,
              ),
            ),
            const SizedBox(height: AppSpacing.md),
          ],
      ],
    );
  }
}

class _SavingsSection extends StatelessWidget {
  const _SavingsSection({required this.items});

  final List<Map<String, dynamic>> items;

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const SectionHeader(
          title: 'Progres tabungan',
          subtitle: 'Target yang ikut dihitung dalam laporan',
        ),
        if (items.isEmpty)
          const AppCard(child: Text('Belum ada progres tabungan.'))
        else
          for (final item in items.take(5)) ...[
            ProgressStatCard(
              title: '${item['name'] ?? 'Target'}',
              subtitle:
                  '${AppFormatters.currency(item['currentAmount'])} dari ${AppFormatters.currency(item['targetAmount'])}',
              progress:
                  AppFormatters.numberOrZero(
                    item['progressPercentage'],
                  ).toDouble() /
                  100,
              color: AppColors.savings,
              icon: Icons.savings_outlined,
              trailing: StatusPill(
                label:
                    '${AppFormatters.numberOrZero(item['progressPercentage']).toStringAsFixed(0)}%',
                color: AppColors.savings,
              ),
            ),
            const SizedBox(height: AppSpacing.md),
          ],
      ],
    );
  }
}

class _MetricRow extends StatelessWidget {
  const _MetricRow({required this.label, required this.value, this.color});

  final String label;
  final String value;
  final Color? color;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 7),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Expanded(
            child: Text(label, maxLines: 1, overflow: TextOverflow.ellipsis),
          ),
          const SizedBox(width: AppSpacing.md),
          Text(
            value,
            style: TextStyle(fontWeight: FontWeight.w800, color: color),
          ),
        ],
      ),
    );
  }
}

Map<String, dynamic> _map(Object? value) {
  return value is Map<String, dynamic> ? value : <String, dynamic>{};
}

List<Map<String, dynamic>> _list(Object? value) {
  if (value is! List<dynamic>) {
    return [];
  }

  return value
      .whereType<Map<String, dynamic>>()
      .map((item) => Map<String, dynamic>.from(item))
      .toList();
}
