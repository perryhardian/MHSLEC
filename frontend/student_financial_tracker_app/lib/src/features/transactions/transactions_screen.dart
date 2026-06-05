import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:intl/intl.dart';

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
            return const Center(child: Text('Belum ada transaksi.'));
          }

          return ListView.separated(
            padding: const EdgeInsets.all(16),
            itemCount: items.length,
            separatorBuilder: (_, _) => const Divider(height: 1),
            itemBuilder: (context, index) {
              final transaction = items[index];
              final category =
                  transaction['category'] as Map<String, dynamic>?;
              final type = transaction['type'] as String;
              final isIncome = type == 'INCOME';

              return ListTile(
                contentPadding: EdgeInsets.zero,
                leading: CircleAvatar(
                  child: Icon(isIncome ? Icons.south_west : Icons.north_east),
                ),
                title: Text(transaction['title'] as String),
                subtitle: Text(category?['name'] as String? ?? type),
                trailing: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Text(
                      _currency(transaction['amount']),
                      style: TextStyle(
                        fontWeight: FontWeight.w700,
                        color: isIncome ? Colors.teal : Colors.redAccent,
                      ),
                    ),
                    PopupMenuButton<String>(
                      onSelected: (value) {
                        if (value == 'edit') {
                          _showEditTransactionDialog(context, ref, transaction);
                        }
                        if (value == 'delete') {
                          _deleteTransaction(context, ref, transaction);
                        }
                      },
                      itemBuilder: (context) => const [
                        PopupMenuItem(
                          value: 'edit',
                          child: ListTile(
                            leading: Icon(Icons.edit_outlined),
                            title: Text('Edit'),
                          ),
                        ),
                        PopupMenuItem(
                          value: 'delete',
                          child: ListTile(
                            leading: Icon(Icons.delete_outline),
                            title: Text('Hapus'),
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              );
            },
          );
        },
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (error, stackTrace) => Center(
          child: Padding(
            padding: const EdgeInsets.all(24),
            child: Text(error.toString(), textAlign: TextAlign.center),
          ),
        ),
      ),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: () => _showAddTransactionDialog(context, ref),
        icon: const Icon(Icons.add),
        label: const Text('Tambah'),
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
    final confirmed = await showDialog<bool>(
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
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text(error.toString())),
        );
      }
    }
  }

  void _invalidateTransactionViews(WidgetRef ref) {
    ref.invalidate(transactionsProvider);
    ref.invalidate(dashboardProvider);
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
                  final dailyCategory = items.cast<Map<String, dynamic>>().firstWhere(
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
      await ref.read(transactionsRepositoryProvider).updateDailyExpenseSetting(
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
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text(error.toString())),
        );
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
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Lengkapi data transaksi.')),
      );
      return;
    }

    setState(() => _isSaving = true);

    try {
      if (_isEditing) {
        await ref.read(transactionsRepositoryProvider).update(
              id: widget.transaction!['id'] as String,
              categoryId: _categoryId!,
              type: _type,
              amount: amount,
              title: _titleController.text.trim(),
              transactionAt: _transactionAt,
            );
      } else {
        await ref.read(transactionsRepositoryProvider).create(
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
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text(error.toString())),
        );
      }
    } finally {
      if (mounted) {
        setState(() => _isSaving = false);
      }
    }
  }
}
