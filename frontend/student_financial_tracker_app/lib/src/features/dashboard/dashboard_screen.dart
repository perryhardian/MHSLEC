import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:intl/intl.dart';

import 'dashboard_repository.dart';

class DashboardScreen extends ConsumerWidget {
  const DashboardScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final dashboard = ref.watch(dashboardProvider);

    return dashboard.when(
        data: (data) => _DashboardContent(data: data),
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (error, stackTrace) => Center(
          child: Padding(
            padding: const EdgeInsets.all(24),
            child: Text(
              error.toString(),
              textAlign: TextAlign.center,
            ),
          ),
        ),
    );
  }
}

class _DashboardContent extends StatelessWidget {
  const _DashboardContent({required this.data});

  final Map<String, dynamic> data;

  @override
  Widget build(BuildContext context) {
    final summary = data['summary'] as Map<String, dynamic>;
    final score = data['financialHealthScore'] as Map<String, dynamic>;
    final period = data['period'] as Map<String, dynamic>;
    final budgets = (data['budgets'] as List<dynamic>);
    final expenses = (data['expenseByCategory'] as List<dynamic>);

    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        _DateCard(period: period),
        const SizedBox(height: 12),
        _ScoreCard(score: score),
        const SizedBox(height: 12),
        _ScoreBreakdownCard(score: score),
        const SizedBox(height: 12),
        Row(
          children: [
            Expanded(
              child: _MetricCard(
                title: 'Pemasukan',
                value: _currency(summary['totalIncome']),
                icon: Icons.south_west,
              ),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: _MetricCard(
                title: 'Pengeluaran',
                value: _currency(summary['totalExpense']),
                icon: Icons.north_east,
              ),
            ),
          ],
        ),
        const SizedBox(height: 12),
        _MetricCard(
          title: 'Sisa Uang Bulanan',
          value: _currency(summary['remainingMoney']),
          icon: Icons.savings,
        ),
        const SizedBox(height: 18),
        Text('Budget', style: Theme.of(context).textTheme.titleMedium),
        const SizedBox(height: 8),
        if (budgets.isEmpty)
          const Text('Belum ada budget aktif.')
        else
          ...budgets.take(3).map((item) {
            final budget = item as Map<String, dynamic>;
            return _ProgressTile(
              title: budget['name'] as String,
              subtitle: '${budget['usagePercentage']}% terpakai',
              progress: ((budget['usagePercentage'] as num) / 100).clamp(0, 1),
            );
          }),
        const SizedBox(height: 18),
        Text('Pengeluaran Terbesar',
            style: Theme.of(context).textTheme.titleMedium),
        const SizedBox(height: 8),
        if (expenses.isEmpty)
          const Text('Belum ada pengeluaran bulan ini.')
        else
          ...expenses.take(5).map((item) {
            final expense = item as Map<String, dynamic>;
            return ListTile(
              contentPadding: EdgeInsets.zero,
              leading: const Icon(Icons.category),
              title: Text(expense['categoryName'] as String),
              trailing: Text(_currency(expense['amount'])),
            );
          }),
      ],
    );
  }

  static String _currency(Object? value) {
    final number = value is num ? value : num.tryParse('$value') ?? 0;
    return NumberFormat.currency(
      locale: 'id_ID',
      symbol: 'Rp',
      decimalDigits: 0,
    ).format(number);
  }
}

class _DateCard extends StatelessWidget {
  const _DateCard({required this.period});

  final Map<String, dynamic> period;

  @override
  Widget build(BuildContext context) {
    final startDate = DateTime.tryParse('${period['startDate']}');
    final endDate = DateTime.tryParse('${period['endDate']}');
    final currentDate = DateTime.tryParse('${period['currentDate']}');
    final month = period['month'];
    final year = period['year'];
    final label = startDate == null || endDate == null
        ? 'Periode $month/$year'
        : DateFormat.yMMMM('id_ID').format(startDate.toLocal());
    final range = startDate == null || endDate == null
        ? ''
        : '${DateFormat.yMMMd('id_ID').format(startDate.toLocal())} - ${DateFormat.yMMMd('id_ID').format(endDate.toLocal())}';
    final today = currentDate == null
        ? '-'
        : DateFormat.yMMMMEEEEd('id_ID').format(currentDate.toLocal());

    return Card(
      margin: EdgeInsets.zero,
      child: ListTile(
        leading: const Icon(Icons.calendar_today_outlined),
        title: Text(label),
        subtitle: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('Hari ini: $today'),
            if (range.isNotEmpty) Text('Periode: $range'),
          ],
        ),
      ),
    );
  }
}

class _ScoreBreakdownCard extends StatelessWidget {
  const _ScoreBreakdownCard({required this.score});

  final Map<String, dynamic> score;

  @override
  Widget build(BuildContext context) {
    final breakdown = score['breakdown'] as Map<String, dynamic>?;
    if (breakdown == null) {
      return const SizedBox.shrink();
    }

    final needsInput = breakdown['needsExpectedDailySpendInput'] == true;

    return Card(
      margin: EdgeInsets.zero,
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('Detail Score', style: Theme.of(context).textTheme.titleMedium),
            const SizedBox(height: 10),
            if (needsInput) ...[
              const Text('Isi expected spend per hari di Profil.'),
              const SizedBox(height: 8),
            ],
            _MetricLine(
              label: 'Uang per hari',
              value: _DashboardContent._currency(
                breakdown['availableDailyMoney'],
              ),
            ),
            _MetricLine(
              label: 'Sub score harian',
              value: '${breakdown['dailyCapacityScore']} / 70',
            ),
            _MetricLine(
              label: 'Budget score',
              value: '${breakdown['budgetScore']} / 30',
            ),
          ],
        ),
      ),
    );
  }
}

class _MetricLine extends StatelessWidget {
  const _MetricLine({required this.label, required this.value});

  final String label;
  final String value;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Expanded(child: Text(label)),
          Text(
            value,
            style: const TextStyle(fontWeight: FontWeight.w700),
          ),
        ],
      ),
    );
  }
}

class _ScoreCard extends StatelessWidget {
  const _ScoreCard({required this.score});

  final Map<String, dynamic> score;

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: EdgeInsets.zero,
      child: Padding(
        padding: const EdgeInsets.all(18),
        child: Row(
          children: [
            CircleAvatar(
              radius: 30,
              child: Text('${score['score']}'),
            ),
            const SizedBox(width: 14),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text('Financial Health Score'),
                  Text(
                    score['label'] as String,
                    style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                          fontWeight: FontWeight.w700,
                        ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _MetricCard extends StatelessWidget {
  const _MetricCard({
    required this.title,
    required this.value,
    required this.icon,
  });

  final String title;
  final String value;
  final IconData icon;

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: EdgeInsets.zero,
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Icon(icon),
            const SizedBox(height: 10),
            Text(title),
            const SizedBox(height: 4),
            Text(
              value,
              style: Theme.of(context).textTheme.titleLarge?.copyWith(
                    fontWeight: FontWeight.w700,
                  ),
            ),
          ],
        ),
      ),
    );
  }
}

class _ProgressTile extends StatelessWidget {
  const _ProgressTile({
    required this.title,
    required this.subtitle,
    required this.progress,
  });

  final String title;
  final String subtitle;
  final num progress;

  @override
  Widget build(BuildContext context) {
    return ListTile(
      contentPadding: EdgeInsets.zero,
      title: Text(title),
      subtitle: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(subtitle),
          const SizedBox(height: 6),
          LinearProgressIndicator(value: progress.toDouble()),
        ],
      ),
    );
  }
}
