import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:intl/intl.dart';

import '../../shared/theme/app_colors.dart';
import '../../shared/theme/app_spacing.dart';
import '../../shared/utils/app_formatters.dart';
import '../../shared/widgets/app_state_widgets.dart';
import '../../shared/widgets/add_fab.dart';
import '../../shared/widgets/section_header.dart';
import '../../shared/widgets/transaction_item.dart';
import '../dashboard/dashboard_repository.dart';
import 'transactions_repository.dart';

class TransactionsScreen extends ConsumerWidget {
  const TransactionsScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final transactions = ref.watch(transactionsProvider);

    return Scaffold(
      body: transactions.when(
        data: (items) {
          if (items.isEmpty) {
            return AppEmptyState(
              icon: Icons.receipt_long_outlined,
              title: 'Belum ada transaksi',
              message:
                  'Catat pemasukan atau pengeluaran pertama agar dashboard mulai terisi.',
              actionLabel: 'Tambah transaksi',
              onAction: () => _showAddTransactionDialog(context, ref),
            );
          }

          return RefreshIndicator(
            onRefresh: () async {
              ref.invalidate(transactionsProvider);
              await ref.read(transactionsProvider.future);
            },
            child: ListView(
              padding: AppInsets.screen,
              children: [
                _TransactionsSummary(items: items),
                const SizedBox(height: AppSpacing.xl),
                SectionHeader(
                  title: 'Riwayat transaksi',
                  subtitle: '${items.length} transaksi tercatat',
                ),
                for (final transaction in items) ...[
                  TransactionItem(
                    title: transaction['title'] as String? ?? '-',
                    category:
                        _categoryName(transaction) ?? '${transaction['type']}',
                    amount: _currency(transaction['amount']),
                    date: _date(transaction['transactionAt']),
                    isIncome: transaction['type'] == 'INCOME',
                    onEdit: () =>
                        _showEditTransactionDialog(context, ref, transaction),
                    onDelete: () =>
                        _deleteTransaction(context, ref, transaction),
                  ),
                  const SizedBox(height: AppSpacing.md),
                ],
              ],
            ),
          );
        },
        loading: () => const AppLoadingState(message: 'Memuat transaksi...'),
        error: (error, stackTrace) => AppErrorState(
          message: error.toString(),
          onRetry: () => ref.invalidate(transactionsProvider),
        ),
      ),
      floatingActionButton: AddFab(
        onPressed: () => _showAddTransactionDialog(context, ref),
        tooltip: 'Tambah transaksi',
      ),
    );
  }

  Future<void> _showAddTransactionDialog(
    BuildContext context,
    WidgetRef ref,
  ) async {
    final mode = await showModalBottomSheet<String>(
      context: context,
      showDragHandle: true,
      builder: (_) => const _TransactionModeSheet(),
    );

    if (!context.mounted) {
      return;
    }

    if (mode == 'auto') {
      await _showDailyExpenseSettingDialog(context, ref);
      return;
    }

    if (mode != 'manual') {
      return;
    }

    final result = await showDialog<bool>(
      context: context,
      builder: (_) => const _TransactionDialog(),
    );

    if (result == true) {
      _invalidateTransactionViews(ref);
    }
  }

  Future<void> _showDailyExpenseSettingDialog(
    BuildContext context,
    WidgetRef ref,
  ) async {
    final result = await showDialog<bool>(
      context: context,
      builder: (_) => const _DailyExpenseSettingDialog(),
    );

    if (result == true) {
      ref.invalidate(dailyExpenseSettingProvider);
      _invalidateTransactionViews(ref);
    }
  }

  Future<void> _showEditTransactionDialog(
    BuildContext context,
    WidgetRef ref,
    Map<String, dynamic> transaction,
  ) async {
    final result = await showDialog<bool>(
      context: context,
      builder: (_) => _TransactionDialog(transaction: transaction),
    );

    if (result == true) {
      _invalidateTransactionViews(ref);
    }
  }

  Future<void> _deleteTransaction(
    BuildContext context,
    WidgetRef ref,
    Map<String, dynamic> transaction,
  ) async {
    final confirmed =
        await showDialog<bool>(
          context: context,
          builder: (context) => AlertDialog(
            title: const Text('Hapus transaksi?'),
            content: Text('Transaksi ${transaction['title']} akan dihapus.'),
            actions: [
              TextButton(
                onPressed: () => Navigator.of(context).pop(false),
                child: const Text('Batal'),
              ),
              FilledButton(
                onPressed: () => Navigator.of(context).pop(true),
                child: const Text('Hapus'),
              ),
            ],
          ),
        ) ??
        false;

    if (!confirmed) {
      return;
    }

    try {
      await ref
          .read(transactionsRepositoryProvider)
          .delete(transaction['id'] as String);
      _invalidateTransactionViews(ref);
    } catch (error) {
      if (context.mounted) {
        ScaffoldMessenger.of(
          context,
        ).showSnackBar(SnackBar(content: Text(error.toString())));
      }
    }
  }

  void _invalidateTransactionViews(WidgetRef ref) {
    ref.invalidate(transactionsProvider);
    ref.invalidate(dashboardProvider);
  }

  static String _currency(Object? value) {
    return AppFormatters.currency(value);
  }

  static String _date(Object? value) {
    final date = DateTime.tryParse('$value');
    if (date == null) {
      return '-';
    }
    return AppFormatters.shortDate(date.toLocal());
  }

  static String? _categoryName(Map<String, dynamic> transaction) {
    final category = transaction['category'] as Map<String, dynamic>?;
    return category?['name'] as String?;
  }
}

class _TransactionsSummary extends StatelessWidget {
  const _TransactionsSummary({required this.items});

  final List<Map<String, dynamic>> items;

  @override
  Widget build(BuildContext context) {
    final income = _sumByType('INCOME');
    final expense = _sumByType('EXPENSE');
    final net = income - expense;

    return Padding(
      padding: const EdgeInsets.symmetric(vertical: AppSpacing.sm),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'Ringkasan transaksi',
            style: Theme.of(context).textTheme.titleMedium,
          ),
          const SizedBox(height: AppSpacing.md),
          Row(
            children: [
              Expanded(
                child: _SummaryTile(
                  label: 'Masuk',
                  value: AppFormatters.currency(income),
                  icon: Icons.south_west_rounded,
                  color: AppColors.success,
                ),
              ),
              const SizedBox(width: AppSpacing.md),
              Expanded(
                child: _SummaryTile(
                  label: 'Keluar',
                  value: AppFormatters.currency(expense),
                  icon: Icons.north_east_rounded,
                  color: AppColors.danger,
                ),
              ),
            ],
          ),
          const SizedBox(height: AppSpacing.md),
          _SummaryTile(
            label: 'Selisih',
            value: AppFormatters.currency(net),
            icon: Icons.account_balance_wallet_outlined,
            color: net >= 0 ? AppColors.primary : AppColors.warning,
            isWide: true,
          ),
        ],
      ),
    );
  }

  num _sumByType(String type) {
    return items
        .where((item) => item['type'] == type)
        .fold<num>(
          0,
          (total, item) => total + AppFormatters.numberOrZero(item['amount']),
        );
  }
}

class _SummaryTile extends StatelessWidget {
  const _SummaryTile({
    required this.label,
    required this.value,
    required this.icon,
    required this.color,
    this.isWide = false,
  });

  final String label;
  final String value;
  final IconData icon;
  final Color color;
  final bool isWide;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(
        horizontal: AppSpacing.md,
        vertical: AppSpacing.sm,
      ),
      decoration: BoxDecoration(
        color: color.withValues(alpha: 0.08),
        borderRadius: BorderRadius.circular(999),
      ),
      child: Row(
        children: [
          Icon(icon, color: color, size: 22),
          const SizedBox(width: AppSpacing.sm),
          Expanded(
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
                    style:
                        (isWide
                                ? Theme.of(context).textTheme.titleMedium
                                : Theme.of(context).textTheme.labelLarge)
                            ?.copyWith(fontWeight: FontWeight.w900),
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

class _TransactionModeSheet extends StatelessWidget {
  const _TransactionModeSheet();

  @override
  Widget build(BuildContext context) {
    return SafeArea(
      child: Padding(
        padding: const EdgeInsets.fromLTRB(16, 0, 16, 16),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            ListTile(
              leading: const Icon(Icons.edit_outlined),
              title: const Text('Transaksi manual'),
              subtitle: const Text('Tambah income atau expense satu kali.'),
              onTap: () => Navigator.of(context).pop('manual'),
            ),
            ListTile(
              leading: const Icon(Icons.autorenew),
              title: const Text('Auto harian'),
              subtitle: const Text('Buat transaksi otomatis setiap hari.'),
              onTap: () => Navigator.of(context).pop('auto'),
            ),
          ],
        ),
      ),
    );
  }
}

class _DailyExpenseSettingDialog extends ConsumerStatefulWidget {
  const _DailyExpenseSettingDialog();

  @override
  ConsumerState<_DailyExpenseSettingDialog> createState() =>
      _DailyExpenseSettingDialogState();
}

class _DailyExpenseSettingDialogState
    extends ConsumerState<_DailyExpenseSettingDialog> {
  final _amountController = TextEditingController();
  String? _categoryId;
  var _type = 'EXPENSE';
  DateTime _startDate = DateTime.now();
  var _isActive = true;
  var _isInitialized = false;
  var _loadedExistingSetting = false;
  var _isSaving = false;

  @override
  void dispose() {
    _amountController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final categories = ref.watch(
      _type == 'EXPENSE' ? expenseCategoriesProvider : incomeCategoriesProvider,
    );
    final setting = ref.watch(dailyExpenseSettingProvider);

    setting.whenData((data) {
      if (_loadedExistingSetting || data == null) {
        return;
      }

      final category = data['category'] as Map<String, dynamic>?;
      _amountController.text = '${data['amount'] ?? ''}';
      _type = category?['type'] as String? ?? 'EXPENSE';
      _categoryId = category?['id'] as String? ?? data['categoryId'] as String?;
      _startDate = DateTime.tryParse('${data['startDate']}') ?? DateTime.now();
      _isActive = data['isActive'] == true;
      _isInitialized = true;
      _loadedExistingSetting = true;
    });

    return AlertDialog(
      title: const Text('Auto Kebutuhan Harian'),
      content: SingleChildScrollView(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            SegmentedButton<String>(
              segments: const [
                ButtonSegment(
                  value: 'EXPENSE',
                  label: Text('Expense'),
                  icon: Icon(Icons.north_east),
                ),
                ButtonSegment(
                  value: 'INCOME',
                  label: Text('Income'),
                  icon: Icon(Icons.south_west),
                ),
              ],
              selected: {_type},
              onSelectionChanged: (value) {
                setState(() {
                  _type = value.first;
                  _categoryId = null;
                  _isInitialized = false;
                });
              },
            ),
            const SizedBox(height: 12),
            categories.when(
              data: (items) {
                if (!_isInitialized && items.isNotEmpty) {
                  final dailyCategory = items
                      .cast<Map<String, dynamic>>()
                      .firstWhere(
                        (item) =>
                            item['name'] ==
                            (_type == 'EXPENSE'
                                ? 'Kebutuhan Harian'
                                : 'Uang Saku'),
                        orElse: () => items.first,
                      );
                  _categoryId ??= dailyCategory['id'] as String;
                  _isInitialized = true;
                }

                return DropdownButtonFormField<String>(
                  initialValue: _categoryId,
                  decoration: const InputDecoration(
                    labelText: 'Kategori',
                    border: OutlineInputBorder(),
                  ),
                  items: items
                      .map(
                        (item) => DropdownMenuItem<String>(
                          value: item['id'] as String,
                          child: Text(item['name'] as String),
                        ),
                      )
                      .toList(),
                  onChanged: (value) => setState(() => _categoryId = value),
                );
              },
              loading: () => const LinearProgressIndicator(),
              error: (error, _) => Text(error.toString()),
            ),
            const SizedBox(height: 12),
            TextField(
              controller: _amountController,
              keyboardType: TextInputType.number,
              decoration: const InputDecoration(
                labelText: 'Nominal per hari',
                border: OutlineInputBorder(),
              ),
            ),
            const SizedBox(height: 12),
            OutlinedButton.icon(
              onPressed: _pickDate,
              icon: const Icon(Icons.event_outlined),
              label: Text(DateFormat.yMMMd('id_ID').format(_startDate)),
            ),
            SwitchListTile(
              contentPadding: EdgeInsets.zero,
              title: const Text('Aktif'),
              value: _isActive,
              onChanged: (value) => setState(() => _isActive = value),
            ),
          ],
        ),
      ),
      actions: [
        TextButton(
          onPressed: _isSaving ? null : () => Navigator.of(context).pop(false),
          child: const Text('Batal'),
        ),
        FilledButton(
          onPressed: _isSaving ? null : _save,
          child: _isSaving
              ? const SizedBox(
                  width: 18,
                  height: 18,
                  child: CircularProgressIndicator(strokeWidth: 2),
                )
              : const Text('Simpan'),
        ),
      ],
    );
  }

  Future<void> _pickDate() async {
    final selected = await showDatePicker(
      context: context,
      initialDate: _startDate,
      firstDate: DateTime(2000),
      lastDate: DateTime.now().add(const Duration(days: 3650)),
    );

    if (selected == null) {
      return;
    }

    setState(() {
      _startDate = selected;
    });
  }

  Future<void> _save() async {
    final amount = num.tryParse(_amountController.text);

    if (_categoryId == null || amount == null || amount <= 0) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Lengkapi setting auto harian.')),
      );
      return;
    }

    setState(() => _isSaving = true);

    try {
      await ref
          .read(transactionsRepositoryProvider)
          .updateDailyExpenseSetting(
            categoryId: _categoryId!,
            type: _type,
            amount: amount,
            startDate: _startDate,
            isActive: _isActive,
          );

      if (mounted) {
        Navigator.of(context).pop(true);
      }
    } catch (error) {
      if (mounted) {
        ScaffoldMessenger.of(
          context,
        ).showSnackBar(SnackBar(content: Text(error.toString())));
      }
    } finally {
      if (mounted) {
        setState(() => _isSaving = false);
      }
    }
  }
}

class _TransactionDialog extends ConsumerStatefulWidget {
  const _TransactionDialog({this.transaction});

  final Map<String, dynamic>? transaction;

  @override
  ConsumerState<_TransactionDialog> createState() => _TransactionDialogState();
}

class _TransactionDialogState extends ConsumerState<_TransactionDialog> {
  late final TextEditingController _titleController;
  late final TextEditingController _amountController;
  late String _type;
  String? _categoryId;
  late DateTime _transactionAt;
  var _isSaving = false;

  bool get _isEditing => widget.transaction != null;

  @override
  void initState() {
    super.initState();
    final transaction = widget.transaction;
    final category = transaction?['category'] as Map<String, dynamic>?;
    _titleController = TextEditingController(
      text: transaction?['title'] as String? ?? '',
    );
    _amountController = TextEditingController(
      text: transaction?['amount']?.toString() ?? '',
    );
    _type = transaction?['type'] as String? ?? 'EXPENSE';
    _categoryId = category?['id'] as String?;
    _transactionAt =
        DateTime.tryParse('${transaction?['transactionAt']}') ?? DateTime.now();
  }

  @override
  void dispose() {
    _titleController.dispose();
    _amountController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final categories = ref.watch(
      _type == 'EXPENSE' ? expenseCategoriesProvider : incomeCategoriesProvider,
    );

    return AlertDialog(
      title: Text(_isEditing ? 'Edit Transaksi' : 'Tambah Transaksi'),
      content: SingleChildScrollView(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            SegmentedButton<String>(
              segments: const [
                ButtonSegment(
                  value: 'EXPENSE',
                  label: Text('Expense'),
                  icon: Icon(Icons.north_east),
                ),
                ButtonSegment(
                  value: 'INCOME',
                  label: Text('Income'),
                  icon: Icon(Icons.south_west),
                ),
              ],
              selected: {_type},
              onSelectionChanged: (value) {
                setState(() {
                  _type = value.first;
                  _categoryId = null;
                });
              },
            ),
            const SizedBox(height: 12),
            TextField(
              controller: _titleController,
              decoration: const InputDecoration(
                labelText: 'Judul',
                border: OutlineInputBorder(),
              ),
            ),
            const SizedBox(height: 12),
            TextField(
              controller: _amountController,
              keyboardType: TextInputType.number,
              decoration: const InputDecoration(
                labelText: 'Nominal',
                border: OutlineInputBorder(),
              ),
            ),
            const SizedBox(height: 12),
            OutlinedButton.icon(
              onPressed: _pickDate,
              icon: const Icon(Icons.calendar_today_outlined),
              label: Text(DateFormat.yMMMd('id_ID').format(_transactionAt)),
            ),
            const SizedBox(height: 12),
            categories.when(
              data: (items) => DropdownButtonFormField<String>(
                initialValue: _categoryId,
                decoration: const InputDecoration(
                  labelText: 'Kategori',
                  border: OutlineInputBorder(),
                ),
                items: items
                    .map(
                      (item) => DropdownMenuItem<String>(
                        value: item['id'] as String,
                        child: Text(item['name'] as String),
                      ),
                    )
                    .toList(),
                onChanged: (value) => setState(() => _categoryId = value),
              ),
              loading: () => const LinearProgressIndicator(),
              error: (error, stackTrace) => Text(error.toString()),
            ),
          ],
        ),
      ),
      actions: [
        TextButton(
          onPressed: _isSaving ? null : () => Navigator.of(context).pop(false),
          child: const Text('Batal'),
        ),
        FilledButton(
          onPressed: _isSaving ? null : _save,
          child: _isSaving
              ? const SizedBox(
                  width: 18,
                  height: 18,
                  child: CircularProgressIndicator(strokeWidth: 2),
                )
              : const Text('Simpan'),
        ),
      ],
    );
  }

  Future<void> _pickDate() async {
    final date = await showDatePicker(
      context: context,
      initialDate: _transactionAt,
      firstDate: DateTime(2000),
      lastDate: DateTime.now().add(const Duration(days: 365)),
    );

    if (date != null) {
      setState(() => _transactionAt = date);
    }
  }

  Future<void> _save() async {
    final amount = num.tryParse(_amountController.text);

    if (_titleController.text.trim().isEmpty ||
        amount == null ||
        amount <= 0 ||
        _categoryId == null) {
      ScaffoldMessenger.of(
        context,
      ).showSnackBar(const SnackBar(content: Text('Lengkapi data transaksi.')));
      return;
    }

    setState(() => _isSaving = true);

    try {
      if (_isEditing) {
        await ref
            .read(transactionsRepositoryProvider)
            .update(
              id: widget.transaction!['id'] as String,
              categoryId: _categoryId!,
              type: _type,
              amount: amount,
              title: _titleController.text.trim(),
              transactionAt: _transactionAt,
            );
      } else {
        await ref
            .read(transactionsRepositoryProvider)
            .create(
              categoryId: _categoryId!,
              type: _type,
              amount: amount,
              title: _titleController.text.trim(),
              transactionAt: _transactionAt,
            );
      }

      if (mounted) {
        Navigator.of(context).pop(true);
      }
    } catch (error) {
      if (mounted) {
        ScaffoldMessenger.of(
          context,
        ).showSnackBar(SnackBar(content: Text(error.toString())));
      }
    } finally {
      if (mounted) {
        setState(() => _isSaving = false);
      }
    }
  }
}
