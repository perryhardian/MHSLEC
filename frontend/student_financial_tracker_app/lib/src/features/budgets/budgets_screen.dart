import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:intl/intl.dart';

import '../dashboard/dashboard_repository.dart';
import '../transactions/transactions_repository.dart';
import 'budgets_repository.dart';

class BudgetsScreen extends ConsumerWidget {
  const BudgetsScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final budgets = ref.watch(budgetsProvider);

    return Scaffold(
      body: budgets.when(
        data: (items) {
          if (items.isEmpty) {
            return const Center(child: Text('Belum ada budget.'));
          }

          return ListView.separated(
            padding: const EdgeInsets.all(16),
            itemCount: items.length,
            separatorBuilder: (_, _) => const SizedBox(height: 12),
            itemBuilder: (context, index) {
              return _BudgetTile(budget: items[index]);
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
        onPressed: () => _showAddBudgetDialog(context, ref),
        icon: const Icon(Icons.add),
        label: const Text('Tambah'),
      ),
    );
  }

  Future<void> _showAddBudgetDialog(BuildContext context, WidgetRef ref) async {
    final result = await showDialog<bool>(
      context: context,
      builder: (_) => const _BudgetDialog(),
    );

    if (result == true) {
      _invalidateBudgetViews(ref);
    }
  }

  static void _invalidateBudgetViews(WidgetRef ref) {
    ref.invalidate(budgetsProvider);
    ref.invalidate(dashboardProvider);
  }
}

class _BudgetTile extends ConsumerWidget {
  const _BudgetTile({required this.budget});

  final Map<String, dynamic> budget;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final category = budget['category'] as Map<String, dynamic>?;
    final usedPercent = _number(budget['usagePercentage']).clamp(0, 100) / 100;
    final isExceeded = budget['isExceeded'] == true;

    return Card(
      margin: EdgeInsets.zero,
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        budget['name'] as String,
                        style: Theme.of(context).textTheme.titleMedium,
                      ),
                      const SizedBox(height: 4),
                      Text(category?['name'] as String? ?? 'Budget umum'),
                    ],
                  ),
                ),
                Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Text(
                      '${_number(budget['usagePercentage']).toStringAsFixed(0)}%',
                      style: TextStyle(
                        fontWeight: FontWeight.w700,
                        color: isExceeded ? Colors.redAccent : Colors.teal,
                      ),
                    ),
                    PopupMenuButton<String>(
                      onSelected: (value) {
                        if (value == 'edit') {
                          _showEditDialog(context, ref);
                        }
                        if (value == 'delete') {
                          _deleteBudget(context, ref);
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
              ],
            ),
            const SizedBox(height: 12),
            LinearProgressIndicator(
              value: usedPercent.toDouble(),
              minHeight: 8,
              color: isExceeded ? Colors.redAccent : Colors.teal,
            ),
            const SizedBox(height: 12),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text('Terpakai ${_currency(budget['spentAmount'])}'),
                Text('Sisa ${_currency(budget['remainingAmount'])}'),
              ],
            ),
            const SizedBox(height: 4),
            Text('Limit ${_currency(budget['limitAmount'])}'),
          ],
        ),
      ),
    );
  }

  Future<void> _showEditDialog(BuildContext context, WidgetRef ref) async {
    final result = await showDialog<bool>(
      context: context,
      builder: (_) => _BudgetDialog(budget: budget),
    );

    if (result == true) {
      BudgetsScreen._invalidateBudgetViews(ref);
    }
  }

  Future<void> _deleteBudget(BuildContext context, WidgetRef ref) async {
    final confirmed = await showDialog<bool>(
          context: context,
          builder: (context) => AlertDialog(
            title: const Text('Hapus budget?'),
            content: Text('Budget ${budget['name']} akan dihapus.'),
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
      await ref.read(budgetsRepositoryProvider).delete(budget['id'] as String);
      BudgetsScreen._invalidateBudgetViews(ref);
    } catch (error) {
      if (context.mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text(error.toString())),
        );
      }
    }
  }

  static num _number(Object? value) {
    return value is num ? value : num.tryParse('$value') ?? 0;
  }

  static String _currency(Object? value) {
    return NumberFormat.currency(
      locale: 'id_ID',
      symbol: 'Rp',
      decimalDigits: 0,
    ).format(_number(value));
  }
}

class _BudgetDialog extends ConsumerStatefulWidget {
  const _BudgetDialog({this.budget});

  final Map<String, dynamic>? budget;

  @override
  ConsumerState<_BudgetDialog> createState() => _BudgetDialogState();
}

class _BudgetDialogState extends ConsumerState<_BudgetDialog> {
  late final TextEditingController _nameController;
  late final TextEditingController _limitController;
  String? _categoryId;
  late DateTime _startDate;
  late DateTime _endDate;
  var _isSaving = false;

  bool get _isEditing => widget.budget != null;

  @override
  void initState() {
    super.initState();
    final budget = widget.budget;
    final category = budget?['category'] as Map<String, dynamic>?;
    final now = DateTime.now();
    _nameController = TextEditingController(
      text: budget?['name'] as String? ?? '',
    );
    _limitController = TextEditingController(
      text: budget?['limitAmount']?.toString() ?? '',
    );
    _categoryId = category?['id'] as String?;
    _startDate = DateTime.tryParse('${budget?['startDate']}') ??
        DateTime(now.year, now.month);
    _endDate = DateTime.tryParse('${budget?['endDate']}') ??
        DateTime(now.year, now.month + 1, 0, 23, 59, 59);
  }

  @override
  void dispose() {
    _nameController.dispose();
    _limitController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final categories = ref.watch(expenseCategoriesProvider);

    return AlertDialog(
      title: Text(_isEditing ? 'Edit Budget' : 'Tambah Budget'),
      content: SingleChildScrollView(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            TextField(
              controller: _nameController,
              decoration: const InputDecoration(
                labelText: 'Nama budget',
                border: OutlineInputBorder(),
              ),
            ),
            const SizedBox(height: 12),
            TextField(
              controller: _limitController,
              keyboardType: TextInputType.number,
              decoration: const InputDecoration(
                labelText: 'Limit',
                border: OutlineInputBorder(),
              ),
            ),
            const SizedBox(height: 12),
            Row(
              children: [
                Expanded(
                  child: OutlinedButton.icon(
                    onPressed: () => _pickDate(isStart: true),
                    icon: const Icon(Icons.event_outlined),
                    label: Text(DateFormat.yMMMd('id_ID').format(_startDate)),
                  ),
                ),
                const SizedBox(width: 8),
                Expanded(
                  child: OutlinedButton.icon(
                    onPressed: () => _pickDate(isStart: false),
                    icon: const Icon(Icons.event_available_outlined),
                    label: Text(DateFormat.yMMMd('id_ID').format(_endDate)),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 12),
            categories.when(
              data: (items) => DropdownButtonFormField<String?>(
                initialValue: _categoryId,
                decoration: const InputDecoration(
                  labelText: 'Kategori',
                  border: OutlineInputBorder(),
                ),
                items: [
                  const DropdownMenuItem<String?>(
                    value: null,
                    child: Text('Budget umum'),
                  ),
                  ...items.map(
                    (item) => DropdownMenuItem<String?>(
                      value: item['id'] as String,
                      child: Text(item['name'] as String),
                    ),
                  ),
                ],
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

  Future<void> _pickDate({required bool isStart}) async {
    final selected = await showDatePicker(
      context: context,
      initialDate: isStart ? _startDate : _endDate,
      firstDate: DateTime(2000),
      lastDate: DateTime.now().add(const Duration(days: 3650)),
    );

    if (selected == null) {
      return;
    }

    setState(() {
      if (isStart) {
        _startDate = selected;
        if (_endDate.isBefore(_startDate)) {
          _endDate = DateTime(
            _startDate.year,
            _startDate.month + 1,
            0,
            23,
            59,
            59,
          );
        }
      } else {
        _endDate = DateTime(
          selected.year,
          selected.month,
          selected.day,
          23,
          59,
          59,
        );
      }
    });
  }

  Future<void> _save() async {
    final limit = num.tryParse(_limitController.text);

    if (_nameController.text.trim().isEmpty ||
        limit == null ||
        limit <= 0 ||
        _endDate.isBefore(_startDate)) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Lengkapi data budget.')),
      );
      return;
    }

    setState(() => _isSaving = true);

    try {
      if (_isEditing) {
        await ref.read(budgetsRepositoryProvider).update(
              id: widget.budget!['id'] as String,
              categoryId: _categoryId,
              name: _nameController.text.trim(),
              limitAmount: limit,
              startDate: _startDate,
              endDate: _endDate,
            );
      } else {
        await ref.read(budgetsRepositoryProvider).create(
              categoryId: _categoryId,
              name: _nameController.text.trim(),
              limitAmount: limit,
              startDate: _startDate,
              endDate: _endDate,
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
