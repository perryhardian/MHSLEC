import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

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
              data: (items) => RefreshIndicator(
                onRefresh: () async => ref.invalidate(categoriesProvider),
                child: ListView.separated(
                  padding: const EdgeInsets.fromLTRB(16, 0, 16, 96),
                  itemCount: items.length,
                  separatorBuilder: (_, _) => const SizedBox(height: 8),
                  itemBuilder: (context, index) {
                    return _CategoryTile(category: items[index]);
                  },
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
          ),
        ],
      ),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: () => _showAddCategoryDialog(context, ref, selectedType),
        icon: const Icon(Icons.add),
        label: const Text('Tambah'),
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
    final tile = Card(
      margin: EdgeInsets.zero,
      child: ListTile(
        leading: CircleAvatar(
          backgroundColor: color.withValues(alpha: 0.18),
          foregroundColor: color,
          child: const Icon(Icons.label_outline),
        ),
        title: Text(category['name'] as String),
        subtitle: Text(isCustom ? 'Custom' : 'Default'),
        trailing: isCustom ? const Icon(Icons.swipe_left) : null,
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
        color: Colors.redAccent,
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
      return Colors.teal;
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
                ButtonSegment(value: '#0F766E', label: Text('Hijau')),
                ButtonSegment(value: '#4F46E5', label: Text('Biru')),
                ButtonSegment(value: '#DC2626', label: Text('Merah')),
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
      await ref.read(categoriesRepositoryProvider).create(
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
