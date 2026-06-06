import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../shared/theme/app_colors.dart';
import '../../shared/theme/app_spacing.dart';
import '../../shared/widgets/add_fab.dart';
import '../../shared/widgets/app_card.dart';
import '../../shared/widgets/app_state_widgets.dart';
import '../../shared/widgets/status_pill.dart';
import '../transactions/transactions_repository.dart';
import 'categories_repository.dart';

class CategoriesScreen extends ConsumerWidget {
  const CategoriesScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final selectedType = ref.watch(selectedCategoryTypeProvider);
    final categories = ref.watch(categoriesProvider);

    return Scaffold(
      appBar: AppBar(title: const Text('Kategori')),
      body: Column(
        children: [
          Padding(
            padding: const EdgeInsets.fromLTRB(16, 8, 16, 12),
            child: SegmentedButton<String>(
              segments: const [
                ButtonSegment(
                  value: 'EXPENSE',
                  icon: Icon(Icons.north_east),
                  label: Text('Expense'),
                ),
                ButtonSegment(
                  value: 'INCOME',
                  icon: Icon(Icons.south_west),
                  label: Text('Income'),
                ),
              ],
              selected: {selectedType},
              onSelectionChanged: (value) {
                ref
                    .read(selectedCategoryTypeProvider.notifier)
                    .setType(value.first);
              },
            ),
          ),
          Expanded(
            child: categories.when(
              data: (items) {
                if (items.isEmpty) {
                  return const AppEmptyState(
                    icon: Icons.category_outlined,
                    title: 'Belum ada kategori',
                    message: 'Kategori transaksi akan muncul di sini.',
                  );
                }

                return RefreshIndicator(
                  onRefresh: () async {
                    ref.invalidate(categoriesProvider);
                    await ref.read(categoriesProvider.future);
                  },
                  child: ListView.separated(
                    padding: const EdgeInsets.fromLTRB(16, 0, 16, 96),
                    itemCount: items.length,
                    separatorBuilder: (_, _) => const SizedBox(height: 8),
                    itemBuilder: (context, index) =>
                        _CategoryTile(category: items[index]),
                  ),
                );
              },
              loading: () =>
                  const AppLoadingState(message: 'Memuat kategori...'),
              error: (error, stackTrace) => AppErrorState(
                message: error.toString(),
                onRetry: () => ref.invalidate(categoriesProvider),
              ),
            ),
          ),
        ],
      ),
      floatingActionButton: AddFab(
        onPressed: () => _showAddCategoryDialog(context, ref, selectedType),
        tooltip: 'Tambah kategori',
      ),
    );
  }

  Future<void> _showAddCategoryDialog(
    BuildContext context,
    WidgetRef ref,
    String type,
  ) async {
    final result = await showDialog<bool>(
      context: context,
      builder: (_) => _AddCategoryDialog(type: type),
    );

    if (result == true) {
      ref.invalidate(categoriesProvider);
      ref.invalidate(expenseCategoriesProvider);
      ref.invalidate(incomeCategoriesProvider);
    }
  }
}

class _CategoryTile extends ConsumerWidget {
  const _CategoryTile({required this.category});

  final Map<String, dynamic> category;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final isCustom = category['kind'] == 'CUSTOM';
    final color = _parseColor(category['color'] as String?);
    final type = category['type'] as String? ?? 'EXPENSE';
    final tile = AppCard(
      padding: const EdgeInsets.symmetric(
        horizontal: AppSpacing.md,
        vertical: AppSpacing.sm,
      ),
      child: ListTile(
        contentPadding: EdgeInsets.zero,
        leading: Container(
          width: 44,
          height: 44,
          decoration: BoxDecoration(
            color: color.withValues(alpha: 0.14),
            borderRadius: BorderRadius.circular(AppRadius.md),
          ),
          child: Icon(Icons.label_outline, color: color),
        ),
        title: Text(category['name'] as String),
        subtitle: Text(isCustom ? 'Custom' : 'Default'),
        trailing: StatusPill(
          label: type == 'INCOME' ? 'Income' : 'Expense',
          color: type == 'INCOME' ? AppColors.success : AppColors.danger,
        ),
      ),
    );

    if (!isCustom) {
      return tile;
    }

    return Dismissible(
      key: ValueKey(category['id'] as String),
      direction: DismissDirection.endToStart,
      background: Container(
        alignment: Alignment.centerRight,
        padding: const EdgeInsets.only(right: 20),
        decoration: BoxDecoration(
          color: AppColors.danger,
          borderRadius: BorderRadius.circular(AppRadius.md),
        ),
        child: const Icon(Icons.delete, color: Colors.white),
      ),
      confirmDismiss: (_) => _confirmDelete(context),
      onDismissed: (_) => _delete(ref),
      child: tile,
    );
  }

  Future<bool> _confirmDelete(BuildContext context) async {
    return await showDialog<bool>(
          context: context,
          builder: (context) => AlertDialog(
            title: const Text('Hapus kategori?'),
            content: Text('Kategori ${category['name']} akan dihapus.'),
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
  }

  Future<void> _delete(WidgetRef ref) async {
    await ref
        .read(categoriesRepositoryProvider)
        .delete(category['id'] as String);
    ref.invalidate(categoriesProvider);
    ref.invalidate(expenseCategoriesProvider);
    ref.invalidate(incomeCategoriesProvider);
  }

  Color _parseColor(String? value) {
    if (value == null || !value.startsWith('#') || value.length != 7) {
      return AppColors.primary;
    }
    return Color(int.parse('FF${value.substring(1)}', radix: 16));
  }
}

class _AddCategoryDialog extends ConsumerStatefulWidget {
  const _AddCategoryDialog({required this.type});

  final String type;

  @override
  ConsumerState<_AddCategoryDialog> createState() => _AddCategoryDialogState();
}

class _AddCategoryDialogState extends ConsumerState<_AddCategoryDialog> {
  final _nameController = TextEditingController();
  var _color = '#0F766E';
  var _isSaving = false;

  @override
  void dispose() {
    _nameController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return AlertDialog(
      title: const Text('Tambah Kategori'),
      content: SingleChildScrollView(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            TextField(
              controller: _nameController,
              decoration: const InputDecoration(
                labelText: 'Nama kategori',
                border: OutlineInputBorder(),
              ),
            ),
            const SizedBox(height: 12),
            SegmentedButton<String>(
              segments: const [
                ButtonSegment(
                  value: '#0F766E',
                  label: _ColorOption(color: AppColors.primary, label: 'Hijau'),
                ),
                ButtonSegment(
                  value: '#D4A017',
                  label: _ColorOption(
                    color: AppColors.savings,
                    label: 'Kuning',
                  ),
                ),
                ButtonSegment(
                  value: '#DC2626',
                  label: _ColorOption(color: AppColors.danger, label: 'Merah'),
                ),
              ],
              selected: {_color},
              onSelectionChanged: (value) {
                setState(() => _color = value.first);
              },
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
    if (_nameController.text.trim().isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Nama kategori harus diisi.')),
      );
      return;
    }

    setState(() => _isSaving = true);

    try {
      await ref
          .read(categoriesRepositoryProvider)
          .create(
            name: _nameController.text.trim(),
            type: widget.type,
            color: _color,
            icon: 'label',
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

class _ColorOption extends StatelessWidget {
  const _ColorOption({required this.color, required this.label});

  final Color color;
  final String label;

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        Container(
          width: 10,
          height: 10,
          decoration: BoxDecoration(
            color: color,
            borderRadius: BorderRadius.circular(AppRadius.xs),
          ),
        ),
        const SizedBox(width: AppSpacing.xs),
        Flexible(
          child: Text(label, maxLines: 1, overflow: TextOverflow.ellipsis),
        ),
      ],
    );
  }
}
