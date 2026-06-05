import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:intl/intl.dart';

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
          onRefresh: () async => ref.invalidate(monthlyReportProvider),
          child: ListView(
            padding: const EdgeInsets.all(16),
            children: [
              _MonthSelector(selectedMonth: selectedMonth),
              const SizedBox(height: 16),
              _SummarySection(summary: data['summary'] as Map<String, dynamic>),
              const SizedBox(height: 16),
              _CategorySection(
                title: 'Pengeluaran per Kategori',
                items: data['expenseByCategory'] as List<dynamic>,
                color: Colors.redAccent,
              ),
              const SizedBox(height: 16),
              _CategorySection(
                title: 'Pemasukan per Kategori',
                items: data['incomeByCategory'] as List<dynamic>,
                color: Colors.teal,
              ),
              const SizedBox(height: 16),
              _BudgetSection(
                items: data['budgetPerformance'] as List<dynamic>,
              ),
            ],
          ),
        ),
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (error, stackTrace) => Center(
          child: Padding(
            padding: const EdgeInsets.all(24),
            child: Text(error.toString(), textAlign: TextAlign.center),
          ),
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
    return Row(
      children: [
        IconButton(
          tooltip: 'Bulan sebelumnya',
          onPressed: () =>
              ref.read(selectedReportMonthProvider.notifier).previousMonth(),
          icon: const Icon(Icons.chevron_left),
        ),
        Expanded(
          child: Center(
            child: Text(
              DateFormat.yMMMM('id_ID').format(selectedMonth),
              style: Theme.of(context).textTheme.titleMedium,
            ),
          ),
        ),
        IconButton(
          tooltip: 'Bulan berikutnya',
          onPressed: () =>
              ref.read(selectedReportMonthProvider.notifier).nextMonth(),
          icon: const Icon(Icons.chevron_right),
        ),
      ],
    );
  }
}

class _SummarySection extends StatelessWidget {
  const _SummarySection({required this.summary});

  final Map<String, dynamic> summary;

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: EdgeInsets.zero,
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('Ringkasan', style: Theme.of(context).textTheme.titleMedium),
            const SizedBox(height: 12),
            _MetricRow(
              label: 'Pemasukan',
              value: _currency(summary['totalIncome']),
              color: Colors.teal,
            ),
            _MetricRow(
              label: 'Pengeluaran',
              value: _currency(summary['totalExpense']),
              color: Colors.redAccent,
            ),
            _MetricRow(
              label: 'Sisa uang',
              value: _currency(summary['remainingMoney']),
              color: Colors.indigo,
            ),
            _MetricRow(
              label: 'Jumlah transaksi',
              value: '${summary['transactionCount']}',
            ),
          ],
        ),
      ),
    );
  }
}

class _CategorySection extends StatelessWidget {
  const _CategorySection({
    required this.title,
    required this.items,
    required this.color,
  });

  final String title;
  final List<dynamic> items;
  final Color color;

  @override
  Widget build(BuildContext context) {
    if (items.isEmpty) {
      return _EmptySection(title: title);
    }

    return Card(
      margin: EdgeInsets.zero,
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(title, style: Theme.of(context).textTheme.titleMedium),
            const SizedBox(height: 8),
            for (final rawItem in items)
              _MetricRow(
                label: (rawItem as Map<String, dynamic>)['categoryName']
                    as String,
                value: _currency(rawItem['amount']),
                color: color,
              ),
          ],
        ),
      ),
    );
  }
}

class _BudgetSection extends StatelessWidget {
  const _BudgetSection({required this.items});

  final List<dynamic> items;

  @override
  Widget build(BuildContext context) {
    if (items.isEmpty) {
      return const _EmptySection(title: 'Performa Budget');
    }

    return Card(
      margin: EdgeInsets.zero,
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Performa Budget',
              style: Theme.of(context).textTheme.titleMedium,
            ),
            const SizedBox(height: 12),
            for (final rawItem in items)
              _BudgetProgress(item: rawItem as Map<String, dynamic>),
          ],
        ),
      ),
    );
  }
}

class _BudgetProgress extends StatelessWidget {
  const _BudgetProgress({required this.item});

  final Map<String, dynamic> item;

  @override
  Widget build(BuildContext context) {
    final percentage = _number(item['usagePercentage']).clamp(0, 100) / 100;
    final isExceeded = item['isExceeded'] == true;

    return Padding(
      padding: const EdgeInsets.only(bottom: 12),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Expanded(child: Text(item['name'] as String)),
              Text('${_number(item['usagePercentage']).toStringAsFixed(0)}%'),
            ],
          ),
          const SizedBox(height: 6),
          LinearProgressIndicator(
            value: percentage.toDouble(),
            color: isExceeded ? Colors.redAccent : Colors.teal,
          ),
          const SizedBox(height: 4),
          Text(
            '${_currency(item['spentAmount'])} dari ${_currency(item['limitAmount'])}',
            style: Theme.of(context).textTheme.bodySmall,
          ),
        ],
      ),
    );
  }
}

class _EmptySection extends StatelessWidget {
  const _EmptySection({required this.title});

  final String title;

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: EdgeInsets.zero,
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(title, style: Theme.of(context).textTheme.titleMedium),
            const SizedBox(height: 8),
            const Text('Belum ada data untuk periode ini.'),
          ],
        ),
      ),
    );
  }
}

class _MetricRow extends StatelessWidget {
  const _MetricRow({
    required this.label,
    required this.value,
    this.color,
  });

  final String label;
  final String value;
  final Color? color;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 6),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Expanded(child: Text(label)),
          Text(
            value,
            style: TextStyle(fontWeight: FontWeight.w700, color: color),
          ),
        ],
      ),
    );
  }
}

num _number(Object? value) {
  return value is num ? value : num.tryParse('$value') ?? 0;
}

String _currency(Object? value) {
  return NumberFormat.currency(
    locale: 'id_ID',
    symbol: 'Rp',
    decimalDigits: 0,
  ).format(_number(value));
}
