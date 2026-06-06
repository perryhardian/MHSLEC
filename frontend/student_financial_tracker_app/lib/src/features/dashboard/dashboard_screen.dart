import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../shared/theme/app_colors.dart';
import '../../shared/theme/app_spacing.dart';
import '../../shared/utils/app_formatters.dart';
import '../../shared/widgets/app_card.dart';
import '../../shared/widgets/app_state_widgets.dart';
import '../../shared/widgets/finance_charts.dart';
import '../../shared/widgets/status_pill.dart';
import 'dashboard_repository.dart';

class DashboardScreen extends ConsumerWidget {
  const DashboardScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final dashboard = ref.watch(dashboardProvider);

    return dashboard.when(
      data: (data) => RefreshIndicator(
        onRefresh: () async {
          ref.invalidate(dashboardProvider);
          await ref.read(dashboardProvider.future);
        },
        child: _DashboardContent(data: data),
      ),
      loading: () => const AppLoadingState(message: 'Memuat dashboard...'),
      error: (error, stackTrace) => AppErrorState(
        message: error.toString(),
        onRetry: () => ref.invalidate(dashboardProvider),
      ),
    );
  }
}

class _DashboardContent extends StatelessWidget {
  const _DashboardContent({required this.data});

  final Map<String, dynamic> data;

  @override
  Widget build(BuildContext context) {
    final summary = _map(data['summary']);
    final period = _map(data['period']);
    final expenses = _list(data['expenseByCategory']);
    final savingsGoals = _list(data['savingsGoals']);
    final savingsSummary = _map(data['savingsSummary']);

    return ListView(
      padding: AppInsets.screen,
      children: [
        _BalanceHero(summary: summary, period: period),
        const SizedBox(height: 26),
        _SavingsTargetSummarySection(
          goals: savingsGoals,
          savingsSummary: savingsSummary,
        ),
        const SizedBox(height: 34),
        _ExpenseChartSection(expenses: expenses),
      ],
    );
  }
}

class _BalanceHero extends StatefulWidget {
  const _BalanceHero({required this.summary, required this.period});

  final Map<String, dynamic> summary;
  final Map<String, dynamic> period;

  @override
  State<_BalanceHero> createState() => _BalanceHeroState();
}

class _BalanceHeroState extends State<_BalanceHero> {
  var _isVisible = true;

  @override
  Widget build(BuildContext context) {
    final startDate = DateTime.tryParse('${widget.period['startDate']}');
    final currentDate = DateTime.tryParse('${widget.period['currentDate']}');
    final periodLabel = startDate == null
        ? 'Periode ${widget.period['month']}/${widget.period['year']}'
        : AppFormatters.month(startDate.toLocal());
    final today = currentDate == null
        ? 'Hari ini'
        : AppFormatters.fullDate(currentDate.toLocal());
    final remaining = AppFormatters.currency(widget.summary['remainingMoney']);
    final income = AppFormatters.currency(widget.summary['totalIncome']);
    final expense = AppFormatters.currency(widget.summary['totalExpense']);

    return AppCard(
      padding: AppInsets.cardLarge,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Container(
                width: 44,
                height: 44,
                decoration: BoxDecoration(
                  color: AppColors.primaryLight,
                  borderRadius: BorderRadius.circular(AppRadius.md),
                ),
                child: const Icon(
                  Icons.account_balance_wallet_outlined,
                  color: AppColors.primary,
                ),
              ),
              const SizedBox(width: AppSpacing.md),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      periodLabel,
                      style: Theme.of(context).textTheme.titleMedium?.copyWith(
                        fontWeight: FontWeight.w900,
                      ),
                    ),
                    Text(
                      today,
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                      style: Theme.of(
                        context,
                      ).textTheme.bodySmall?.copyWith(color: AppColors.slate),
                    ),
                  ],
                ),
              ),
              IconButton(
                onPressed: () => setState(() => _isVisible = !_isVisible),
                tooltip: _isVisible ? 'Sembunyikan saldo' : 'Tampilkan saldo',
                icon: Icon(
                  _isVisible
                      ? Icons.visibility_outlined
                      : Icons.visibility_off_outlined,
                ),
              ),
            ],
          ),
          const SizedBox(height: AppSpacing.xl),
          Text(
            'Total Balance',
            style: Theme.of(context).textTheme.bodyMedium?.copyWith(
              color: AppColors.slate,
              fontWeight: FontWeight.w700,
            ),
          ),
          const SizedBox(height: AppSpacing.xs),
          FittedBox(
            fit: BoxFit.scaleDown,
            alignment: Alignment.centerLeft,
            child: Text(
              _isVisible ? remaining : 'Rp********',
              maxLines: 1,
              style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                color: AppColors.ink,
                fontWeight: FontWeight.w900,
              ),
            ),
          ),
          const SizedBox(height: AppSpacing.lg),
          Row(
            children: [
              Expanded(
                child: _HeroMiniStat(
                  icon: Icons.south_west_rounded,
                  label: 'Income',
                  value: _isVisible ? income : 'Rp****',
                  color: AppColors.success,
                  backgroundColor: AppColors.successSoft,
                ),
              ),
              const SizedBox(width: AppSpacing.md),
              Expanded(
                child: _HeroMiniStat(
                  icon: Icons.north_east_rounded,
                  label: 'Expense',
                  value: _isVisible ? expense : 'Rp****',
                  color: AppColors.danger,
                  backgroundColor: AppColors.dangerSoft,
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}

class _HeroMiniStat extends StatelessWidget {
  const _HeroMiniStat({
    required this.icon,
    required this.label,
    required this.value,
    required this.color,
    required this.backgroundColor,
  });

  final IconData icon;
  final String label;
  final String value;
  final Color color;
  final Color backgroundColor;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: AppSpacing.xs),
      child: Row(
        children: [
          Container(
            width: 42,
            height: 42,
            decoration: BoxDecoration(
              color: backgroundColor,
              borderRadius: BorderRadius.circular(AppRadius.md),
            ),
            child: Icon(icon, color: color),
          ),
          const SizedBox(width: AppSpacing.md),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              mainAxisSize: MainAxisSize.min,
              children: [
                Text(
                  label,
                  style: Theme.of(context).textTheme.bodySmall?.copyWith(
                    color: AppColors.slate,
                    fontWeight: FontWeight.w700,
                  ),
                ),
                const SizedBox(height: 2),
                FittedBox(
                  fit: BoxFit.scaleDown,
                  alignment: Alignment.centerLeft,
                  child: Text(
                    value,
                    maxLines: 1,
                    style: Theme.of(context).textTheme.titleMedium?.copyWith(
                      fontWeight: FontWeight.w900,
                    ),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class _SavingsTargetSummarySection extends StatelessWidget {
  const _SavingsTargetSummarySection({
    required this.goals,
    required this.savingsSummary,
  });

  final List<Map<String, dynamic>> goals;
  final Map<String, dynamic> savingsSummary;

  @override
  Widget build(BuildContext context) {
    final goalCount = AppFormatters.numberOrZero(
      savingsSummary['goalsCount'],
    ).toInt();
    final averageProgress = AppFormatters.numberOrZero(
      savingsSummary['averageProgressPercentage'],
    ).clamp(0, 100);
    final primaryGoal = goals.isEmpty ? null : goals.first;
    final primaryGoalName = primaryGoal == null
        ? 'Belum ada target'
        : '${primaryGoal['name'] ?? 'Target tabungan'}';
    final primaryGoalProgress = primaryGoal == null
        ? averageProgress
        : AppFormatters.numberOrZero(
            primaryGoal['progressPercentage'],
          ).clamp(0, 100);

    return Padding(
      padding: const EdgeInsets.symmetric(vertical: AppSpacing.sm),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Container(
                width: 44,
                height: 44,
                decoration: BoxDecoration(
                  color: AppColors.savingsSoft,
                  borderRadius: BorderRadius.circular(AppRadius.md),
                ),
                child: const Icon(
                  Icons.savings_outlined,
                  color: AppColors.savings,
                ),
              ),
              const SizedBox(width: AppSpacing.md),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Target pencapaian',
                      style: Theme.of(context).textTheme.titleLarge?.copyWith(
                        fontWeight: FontWeight.w900,
                      ),
                    ),
                    Text(
                      '$goalCount target dibuat',
                      style: Theme.of(
                        context,
                      ).textTheme.bodySmall?.copyWith(color: AppColors.slate),
                    ),
                  ],
                ),
              ),
              StatusPill(
                label: '${averageProgress.toStringAsFixed(0)}%',
                color: AppColors.savings,
              ),
            ],
          ),
          const SizedBox(height: AppSpacing.lg),
          Text(
            primaryGoalName,
            maxLines: 1,
            overflow: TextOverflow.ellipsis,
            style: Theme.of(
              context,
            ).textTheme.bodyMedium?.copyWith(fontWeight: FontWeight.w700),
          ),
          const SizedBox(height: AppSpacing.sm),
          ClipRRect(
            borderRadius: BorderRadius.circular(AppRadius.sm),
            child: LinearProgressIndicator(
              minHeight: 9,
              value: primaryGoalProgress / 100,
              color: AppColors.savings,
              backgroundColor: AppColors.savingsSoft,
            ),
          ),
          const SizedBox(height: AppSpacing.sm),
          Row(
            children: [
              Expanded(
                child: Text(
                  primaryGoal == null
                      ? 'Buat target tabungan untuk mulai memantau progress.'
                      : '${AppFormatters.currency(primaryGoal['currentAmount'])} dari ${AppFormatters.currency(primaryGoal['targetAmount'])}',
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                  style: Theme.of(
                    context,
                  ).textTheme.bodySmall?.copyWith(color: AppColors.slate),
                ),
              ),
              Text(
                '${primaryGoalProgress.toStringAsFixed(0)}% tercapai',
                style: Theme.of(context).textTheme.bodySmall?.copyWith(
                  color: AppColors.savings,
                  fontWeight: FontWeight.w900,
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}

class _ExpenseChartSection extends StatelessWidget {
  const _ExpenseChartSection({required this.expenses});

  final List<Map<String, dynamic>> expenses;

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Padding(
          padding: const EdgeInsets.only(bottom: AppSpacing.sm),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                'Pengeluaran terbesar',
                style: Theme.of(
                  context,
                ).textTheme.titleLarge?.copyWith(fontWeight: FontWeight.w900),
              ),
              const SizedBox(height: AppSpacing.xs),
              Text(
                'Kategori yang paling banyak menyerap uang bulan ini',
                style: Theme.of(
                  context,
                ).textTheme.bodySmall?.copyWith(color: AppColors.slate),
              ),
            ],
          ),
        ),
        if (expenses.isEmpty)
          const Padding(
            padding: EdgeInsets.symmetric(vertical: AppSpacing.md),
            child: Text('Belum ada pengeluaran bulan ini.'),
          )
        else
          LayoutBuilder(
            builder: (context, constraints) {
              final segments = _segments(expenses.take(5).toList());
              final chart = DonutChart(
                segments: segments,
                centerTitle: 'Total',
                centerValue: AppFormatters.compactNumber(
                  expenses.fold<num>(
                    0,
                    (total, item) =>
                        total + AppFormatters.numberOrZero(item['amount']),
                  ),
                ),
              );
              final detail = Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  ChartLegend(segments: segments),
                  const SizedBox(height: AppSpacing.md),
                  for (final item in expenses.take(5))
                    _CategoryAmountRow(
                      name: '${item['categoryName'] ?? 'Kategori'}',
                      value: AppFormatters.currency(item['amount']),
                    ),
                ],
              );

              if (constraints.maxWidth >= 520) {
                return Row(
                  children: [
                    chart,
                    const SizedBox(width: AppSpacing.xl),
                    Expanded(child: detail),
                  ],
                );
              }

              return Column(
                children: [
                  Center(child: chart),
                  const SizedBox(height: AppSpacing.lg),
                  detail,
                ],
              );
            },
          ),
      ],
    );
  }

  static List<ChartSegment> _segments(List<Map<String, dynamic>> items) {
    const colors = [
      AppColors.primary,
      Color(0xFF1F9D55),
      Color(0xFFD4A017),
      Color(0xFF334155),
      AppColors.accent,
    ];

    return [
      for (var index = 0; index < items.length; index++)
        ChartSegment(
          label: '${items[index]['categoryName'] ?? 'Kategori'}',
          value: AppFormatters.numberOrZero(items[index]['amount']).toDouble(),
          color: colors[index % colors.length],
        ),
    ];
  }
}

class _CategoryAmountRow extends StatelessWidget {
  const _CategoryAmountRow({required this.name, required this.value});

  final String name;
  final String value;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 7),
      child: Row(
        children: [
          Expanded(
            child: Text(name, maxLines: 1, overflow: TextOverflow.ellipsis),
          ),
          Text(value, style: const TextStyle(fontWeight: FontWeight.w800)),
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
