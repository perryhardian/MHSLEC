import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:intl/intl.dart';

import '../dashboard/dashboard_repository.dart';
import 'savings_goals_repository.dart';

class SavingsGoalsScreen extends ConsumerWidget {
  const SavingsGoalsScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final goals = ref.watch(savingsGoalsProvider);

    return Scaffold(
      body: goals.when(
        data: (items) {
          if (items.isEmpty) {
            return const Center(child: Text('Belum ada target tabungan.'));
          }

          return ListView.separated(
            padding: const EdgeInsets.all(16),
            itemCount: items.length,
            separatorBuilder: (_, _) => const SizedBox(height: 12),
            itemBuilder: (context, index) {
              return _SavingsGoalTile(goal: items[index]);
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
        onPressed: () => _showAddGoalDialog(context, ref),
        icon: const Icon(Icons.add),
        label: const Text('Tambah'),
      ),
    );
  }

  Future<void> _showAddGoalDialog(BuildContext context, WidgetRef ref) async {
    final result = await showDialog<bool>(
      context: context,
      builder: (_) => const _SavingsGoalDialog(),
    );

    if (result == true) {
      _invalidateSavingsViews(ref);
    }
  }

  static void _invalidateSavingsViews(WidgetRef ref) {
    ref.invalidate(savingsGoalsProvider);
    ref.invalidate(dashboardProvider);
  }
}

class _SavingsGoalTile extends ConsumerWidget {
  const _SavingsGoalTile({required this.goal});

  final Map<String, dynamic> goal;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final progress = _number(goal['progressPercentage']).clamp(0, 100) / 100;
    final isCompleted = goal['status'] == 'COMPLETED';

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
                  child: Text(
                    goal['name'] as String,
                    style: Theme.of(context).textTheme.titleMedium,
                  ),
                ),
                Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Chip(
                      label: Text(isCompleted ? 'Selesai' : 'Aktif'),
                      visualDensity: VisualDensity.compact,
                    ),
                    PopupMenuButton<String>(
                      onSelected: (value) {
                        if (value == 'edit') {
                          _showEditDialog(context, ref);
                        }
                        if (value == 'delete') {
                          _deleteGoal(context, ref);
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
              value: progress.toDouble(),
              minHeight: 8,
              color: isCompleted ? Colors.teal : Colors.indigo,
            ),
            const SizedBox(height: 12),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text('Terkumpul ${_currency(goal['currentAmount'])}'),
                Text(
                  '${_number(goal['progressPercentage']).toStringAsFixed(0)}%',
                ),
              ],
            ),
            const SizedBox(height: 4),
            Text('Target ${_currency(goal['targetAmount'])}'),
            const SizedBox(height: 12),
            Row(
              mainAxisAlignment: MainAxisAlignment.end,
              children: [
                TextButton.icon(
                  onPressed: isCompleted
                      ? null
                      : () => _showAutoContributionDialog(context, ref),
                  icon: const Icon(Icons.autorenew),
                  label: const Text('Auto'),
                ),
                const SizedBox(width: 8),
                TextButton.icon(
                  onPressed: isCompleted
                      ? null
                      : () => _showContributionDialog(context, ref),
                  icon: const Icon(Icons.savings_outlined),
                  label: const Text('Setor'),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Future<void> _showEditDialog(BuildContext context, WidgetRef ref) async {
    final result = await showDialog<bool>(
      context: context,
      builder: (_) => _SavingsGoalDialog(goal: goal),
    );

    if (result == true) {
      SavingsGoalsScreen._invalidateSavingsViews(ref);
    }
  }

  Future<void> _deleteGoal(BuildContext context, WidgetRef ref) async {
    final confirmed = await showDialog<bool>(
          context: context,
          builder: (context) => AlertDialog(
            title: const Text('Hapus target?'),
            content: Text('Target ${goal['name']} akan dihapus.'),
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
          .read(savingsGoalsRepositoryProvider)
          .delete(goal['id'] as String);
      SavingsGoalsScreen._invalidateSavingsViews(ref);
    } catch (error) {
      if (context.mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text(error.toString())),
        );
      }
    }
  }

  Future<void> _showContributionDialog(
    BuildContext context,
    WidgetRef ref,
  ) async {
    final result = await showDialog<bool>(
      context: context,
      builder: (_) => _AddContributionDialog(goalId: goal['id'] as String),
    );

    if (result == true) {
      ref.invalidate(savingsGoalsProvider);
      ref.invalidate(dashboardProvider);
    }
  }

  Future<void> _showAutoContributionDialog(
    BuildContext context,
    WidgetRef ref,
  ) async {
    final result = await showDialog<bool>(
      context: context,
      builder: (_) => _AutoContributionDialog(goalId: goal['id'] as String),
    );

    if (result == true) {
      ref.invalidate(savingsGoalsProvider);
      ref.invalidate(dashboardProvider);
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

class _AutoContributionDialog extends ConsumerStatefulWidget {
  const _AutoContributionDialog({required this.goalId});

  final String goalId;

  @override
  ConsumerState<_AutoContributionDialog> createState() =>
      _AutoContributionDialogState();
}

class _AutoContributionDialogState
    extends ConsumerState<_AutoContributionDialog> {
  final _amountController = TextEditingController();
  DateTime _startDate = DateTime.now();
  var _isActive = true;
  var _isSaving = false;
  var _isInitialized = false;

  @override
  void dispose() {
    _amountController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return FutureBuilder<Map<String, dynamic>?>(
      future: ref
          .read(savingsGoalsRepositoryProvider)
          .getAutoContribution(widget.goalId),
      builder: (context, snapshot) {
        final data = snapshot.data;
        if (!_isInitialized && data != null) {
          _amountController.text = '${data['amount'] ?? ''}';
          _startDate = DateTime.tryParse('${data['startDate']}') ?? DateTime.now();
          _isActive = data['isActive'] == true;
          _isInitialized = true;
        }

        return AlertDialog(
          title: const Text('Auto Setor Tabungan'),
          content: SingleChildScrollView(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
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
              onPressed:
                  _isSaving ? null : () => Navigator.of(context).pop(false),
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
      },
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

    if (amount == null || amount <= 0) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Nominal auto setor harus diisi.')),
      );
      return;
    }

    setState(() => _isSaving = true);

    try {
      await ref.read(savingsGoalsRepositoryProvider).updateAutoContribution(
            goalId: widget.goalId,
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

class _SavingsGoalDialog extends ConsumerStatefulWidget {
  const _SavingsGoalDialog({this.goal});

  final Map<String, dynamic>? goal;

  @override
  ConsumerState<_SavingsGoalDialog> createState() => _SavingsGoalDialogState();
}

class _SavingsGoalDialogState extends ConsumerState<_SavingsGoalDialog> {
  late final TextEditingController _nameController;
  late final TextEditingController _targetController;
  late String _status;
  DateTime? _targetDate;
  var _isSaving = false;

  bool get _isEditing => widget.goal != null;

  @override
  void initState() {
    super.initState();
    final goal = widget.goal;
    _nameController = TextEditingController(
      text: goal?['name'] as String? ?? '',
    );
    _targetController = TextEditingController(
      text: goal?['targetAmount']?.toString() ?? '',
    );
    _status = goal?['status'] as String? ?? 'ACTIVE';
    _targetDate = DateTime.tryParse('${goal?['targetDate']}');
  }

  @override
  void dispose() {
    _nameController.dispose();
    _targetController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return AlertDialog(
      title: Text(_isEditing ? 'Edit Target' : 'Tambah Target'),
      content: SingleChildScrollView(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            TextField(
              controller: _nameController,
              decoration: const InputDecoration(
                labelText: 'Nama target',
                border: OutlineInputBorder(),
              ),
            ),
            const SizedBox(height: 12),
            TextField(
              controller: _targetController,
              keyboardType: TextInputType.number,
              decoration: const InputDecoration(
                labelText: 'Nominal target',
                border: OutlineInputBorder(),
              ),
            ),
            const SizedBox(height: 12),
            OutlinedButton.icon(
              onPressed: _pickTargetDate,
              icon: const Icon(Icons.event_available_outlined),
              label: Text(
                _targetDate == null
                    ? 'Pilih target tanggal'
                    : DateFormat.yMMMd('id_ID').format(_targetDate!),
              ),
            ),
            if (_isEditing) ...[
              const SizedBox(height: 12),
              DropdownButtonFormField<String>(
                initialValue: _status,
                decoration: const InputDecoration(
                  labelText: 'Status',
                  border: OutlineInputBorder(),
                ),
                items: const [
                  DropdownMenuItem(value: 'ACTIVE', child: Text('Aktif')),
                  DropdownMenuItem(value: 'COMPLETED', child: Text('Selesai')),
                  DropdownMenuItem(value: 'CANCELLED', child: Text('Dibatalkan')),
                ],
                onChanged: (value) {
                  if (value != null) {
                    setState(() => _status = value);
                  }
                },
              ),
            ],
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

  Future<void> _pickTargetDate() async {
    final selected = await showDatePicker(
      context: context,
      initialDate:
          _targetDate ?? DateTime.now().add(const Duration(days: 30)),
      firstDate: DateTime.now(),
      lastDate: DateTime.now().add(const Duration(days: 3650)),
    );

    if (selected != null) {
      setState(() => _targetDate = selected);
    }
  }

  Future<void> _save() async {
    final targetAmount = num.tryParse(_targetController.text);

    if (_nameController.text.trim().isEmpty ||
        targetAmount == null ||
        targetAmount <= 0) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Lengkapi data target tabungan.')),
      );
      return;
    }

    setState(() => _isSaving = true);

    try {
      if (_isEditing) {
        await ref.read(savingsGoalsRepositoryProvider).update(
              id: widget.goal!['id'] as String,
              name: _nameController.text.trim(),
              targetAmount: targetAmount,
              targetDate: _targetDate,
              status: _status,
            );
      } else {
        await ref.read(savingsGoalsRepositoryProvider).create(
              name: _nameController.text.trim(),
              targetAmount: targetAmount,
              targetDate: _targetDate,
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

class _AddContributionDialog extends ConsumerStatefulWidget {
  const _AddContributionDialog({required this.goalId});

  final String goalId;

  @override
  ConsumerState<_AddContributionDialog> createState() =>
      _AddContributionDialogState();
}

class _AddContributionDialogState
    extends ConsumerState<_AddContributionDialog> {
  final _amountController = TextEditingController();
  final _noteController = TextEditingController();
  var _isSaving = false;

  @override
  void dispose() {
    _amountController.dispose();
    _noteController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return AlertDialog(
      title: const Text('Setor Tabungan'),
      content: SingleChildScrollView(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            TextField(
              controller: _amountController,
              keyboardType: TextInputType.number,
              decoration: const InputDecoration(
                labelText: 'Nominal',
                border: OutlineInputBorder(),
              ),
            ),
            const SizedBox(height: 12),
            TextField(
              controller: _noteController,
              decoration: const InputDecoration(
                labelText: 'Catatan',
                border: OutlineInputBorder(),
              ),
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

  Future<void> _save() async {
    final amount = num.tryParse(_amountController.text);

    if (amount == null || amount <= 0) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Nominal setoran harus diisi.')),
      );
      return;
    }

    setState(() => _isSaving = true);

    try {
      await ref.read(savingsGoalsRepositoryProvider).addContribution(
            goalId: widget.goalId,
            amount: amount,
            note: _noteController.text,
            contributedAt: DateTime.now(),
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
