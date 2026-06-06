import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../shared/theme/app_colors.dart';
import '../../shared/theme/app_spacing.dart';
import '../../shared/utils/app_formatters.dart';
import '../../shared/widgets/app_buttons.dart';
import '../../shared/widgets/app_card.dart';
import '../../shared/widgets/app_state_widgets.dart';
import '../../shared/widgets/section_header.dart';
import '../categories/categories_screen.dart';
import '../dashboard/dashboard_repository.dart';
import '../notifications/notifications_repository.dart';
import '../reports/reports_repository.dart';
import '../savings_goals/savings_goals_repository.dart';
import '../transactions/transactions_repository.dart';
import 'profile_repository.dart';

class ProfileScreen extends ConsumerWidget {
  const ProfileScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final profile = ref.watch(profileProvider);

    return Scaffold(
      appBar: AppBar(title: const Text('Profil')),
      body: profile.when(
        data: (data) => RefreshIndicator(
          onRefresh: () async {
            ref.invalidate(profileProvider);
            await ref.read(profileProvider.future);
          },
          child: ListView(
            padding: AppInsets.screen,
            children: [
              _ProfileHero(data: data),
              const SizedBox(height: AppSpacing.xl),
              const SectionHeader(
                title: 'Informasi pengguna',
                subtitle: 'Data identitas dan kontak',
              ),
              _ProfileItem(
                icon: Icons.school_outlined,
                label: 'Universitas',
                value: data['university'] as String? ?? '-',
              ),
              _ProfileItem(
                icon: Icons.phone_outlined,
                label: 'Nomor HP',
                value: data['phoneNumber'] as String? ?? '-',
              ),
              const SizedBox(height: AppSpacing.xl),
              const SectionHeader(
                title: 'Preferensi finansial',
                subtitle: 'Dipakai untuk score dan reminder',
              ),
              _ProfileItem(
                icon: Icons.payments_outlined,
                label: 'Uang Bulanan',
                value: _currency(data['monthlyAllowance']),
              ),
              _ProfileItem(
                icon: Icons.today_outlined,
                label: 'Expected Spend / Hari',
                value: _currency(data['expectedDailySpend']),
              ),
              _ProfileItem(
                icon: Icons.fast_forward_outlined,
                label: 'Timeskip',
                value: '${data['timeSkipDays'] ?? 0} hari',
              ),
              const SizedBox(height: AppSpacing.xl),
              AppCard(
                padding: AppInsets.cardLarge,
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  children: [
                    Text(
                      'Pengaturan cepat',
                      style: Theme.of(context).textTheme.titleMedium,
                    ),
                    const SizedBox(height: AppSpacing.md),
                    AppPrimaryButton(
                      label: 'Edit Profil',
                      icon: Icons.edit_outlined,
                      onPressed: () => _showEditDialog(context, ref, data),
                    ),
                    const SizedBox(height: AppSpacing.sm),
                    AppSecondaryButton(
                      label: 'Kelola Kategori',
                      icon: Icons.category_outlined,
                      onPressed: () => Navigator.of(context).push(
                        MaterialPageRoute<void>(
                          builder: (_) => const CategoriesScreen(),
                        ),
                      ),
                    ),
                    const SizedBox(height: AppSpacing.sm),
                    AppSecondaryButton(
                      label: 'Timeskip',
                      icon: Icons.fast_forward_outlined,
                      onPressed: () => _showTimeSkipDialog(context, ref, data),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
        loading: () => const AppLoadingState(message: 'Memuat profil...'),
        error: (error, stackTrace) => AppErrorState(
          message: error.toString(),
          onRetry: () => ref.invalidate(profileProvider),
        ),
      ),
    );
  }

  Future<void> _showEditDialog(
    BuildContext context,
    WidgetRef ref,
    Map<String, dynamic> profile,
  ) async {
    final result = await showDialog<bool>(
      context: context,
      builder: (_) => _EditProfileDialog(profile: profile),
    );

    if (result == true) {
      _invalidateFinancialViews(ref);
    }
  }

  Future<void> _showTimeSkipDialog(
    BuildContext context,
    WidgetRef ref,
    Map<String, dynamic> profile,
  ) async {
    final result = await showDialog<bool>(
      context: context,
      builder: (_) => _TimeSkipDialog(profile: profile),
    );

    if (result == true) {
      _invalidateFinancialViews(ref);
    }
  }

  static void _invalidateFinancialViews(WidgetRef ref) {
    ref.invalidate(profileProvider);
    ref.invalidate(dashboardProvider);
    ref.invalidate(transactionsProvider);
    ref.invalidate(dailyExpenseSettingProvider);
    ref.invalidate(savingsGoalsProvider);
    ref.invalidate(monthlyReportProvider);
    ref.invalidate(notificationsProvider);
    ref.invalidate(unreadNotificationsCountProvider);
  }

  static String _initial(String name) {
    final trimmed = name.trim();
    return trimmed.isEmpty ? '?' : trimmed.characters.first.toUpperCase();
  }
}

class _ProfileHero extends StatelessWidget {
  const _ProfileHero({required this.data});

  final Map<String, dynamic> data;

  @override
  Widget build(BuildContext context) {
    final name = data['name'] as String? ?? '-';
    final email = data['email'] as String? ?? '-';

    return AppCard(
      color: AppColors.ink,
      borderColor: Colors.transparent,
      padding: AppInsets.cardLarge,
      child: Row(
        children: [
          Container(
            width: 64,
            height: 64,
            decoration: BoxDecoration(
              color: AppColors.primaryLight,
              borderRadius: BorderRadius.circular(AppRadius.md),
            ),
            child: Center(
              child: Text(
                ProfileScreen._initial(name),
                style: Theme.of(context).textTheme.titleLarge?.copyWith(
                  color: AppColors.primaryDark,
                  fontWeight: FontWeight.w900,
                ),
              ),
            ),
          ),
          const SizedBox(width: AppSpacing.lg),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  name,
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                  style: Theme.of(
                    context,
                  ).textTheme.titleLarge?.copyWith(color: Colors.white),
                ),
                const SizedBox(height: AppSpacing.xs),
                Text(
                  email,
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                  style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                    color: Colors.white.withValues(alpha: 0.72),
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

class _ProfileItem extends StatelessWidget {
  const _ProfileItem({
    required this.icon,
    required this.label,
    required this.value,
  });

  final IconData icon;
  final String label;
  final String value;

  @override
  Widget build(BuildContext context) {
    return AppCard(
      margin: const EdgeInsets.only(bottom: AppSpacing.md),
      padding: const EdgeInsets.symmetric(
        horizontal: AppSpacing.md,
        vertical: AppSpacing.sm,
      ),
      child: ListTile(
        contentPadding: EdgeInsets.zero,
        leading: Container(
          width: 42,
          height: 42,
          decoration: BoxDecoration(
            color: AppColors.primaryLight,
            borderRadius: BorderRadius.circular(AppRadius.md),
          ),
          child: Icon(icon, color: AppColors.primaryDark),
        ),
        title: Text(
          label,
          style: Theme.of(
            context,
          ).textTheme.bodySmall?.copyWith(color: AppColors.slate),
        ),
        subtitle: Padding(
          padding: const EdgeInsets.only(top: AppSpacing.xs),
          child: Text(
            value,
            style: Theme.of(
              context,
            ).textTheme.titleSmall?.copyWith(fontWeight: FontWeight.w800),
          ),
        ),
      ),
    );
  }
}

class _EditProfileDialog extends ConsumerStatefulWidget {
  const _EditProfileDialog({required this.profile});

  final Map<String, dynamic> profile;

  @override
  ConsumerState<_EditProfileDialog> createState() => _EditProfileDialogState();
}

class _EditProfileDialogState extends ConsumerState<_EditProfileDialog> {
  late final TextEditingController _nameController;
  late final TextEditingController _phoneController;
  late final TextEditingController _universityController;
  late final TextEditingController _allowanceController;
  late final TextEditingController _expectedDailySpendController;
  var _isSaving = false;

  @override
  void initState() {
    super.initState();
    _nameController = TextEditingController(
      text: widget.profile['name'] as String? ?? '',
    );
    _phoneController = TextEditingController(
      text: widget.profile['phoneNumber'] as String? ?? '',
    );
    _universityController = TextEditingController(
      text: widget.profile['university'] as String? ?? '',
    );
    _allowanceController = TextEditingController(
      text: widget.profile['monthlyAllowance']?.toString() ?? '',
    );
    _expectedDailySpendController = TextEditingController(
      text: widget.profile['expectedDailySpend']?.toString() ?? '',
    );
  }

  @override
  void dispose() {
    _nameController.dispose();
    _phoneController.dispose();
    _universityController.dispose();
    _allowanceController.dispose();
    _expectedDailySpendController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return AlertDialog(
      title: const Text('Edit Profil'),
      content: SingleChildScrollView(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            TextField(
              controller: _nameController,
              decoration: const InputDecoration(
                labelText: 'Nama',
                border: OutlineInputBorder(),
              ),
            ),
            const SizedBox(height: 12),
            TextField(
              controller: _universityController,
              decoration: const InputDecoration(
                labelText: 'Universitas',
                border: OutlineInputBorder(),
              ),
            ),
            const SizedBox(height: 12),
            TextField(
              controller: _phoneController,
              keyboardType: TextInputType.phone,
              decoration: const InputDecoration(
                labelText: 'Nomor HP',
                border: OutlineInputBorder(),
              ),
            ),
            const SizedBox(height: 12),
            TextField(
              controller: _allowanceController,
              keyboardType: TextInputType.number,
              decoration: const InputDecoration(
                labelText: 'Uang bulanan',
                border: OutlineInputBorder(),
              ),
            ),
            const SizedBox(height: 12),
            TextField(
              controller: _expectedDailySpendController,
              keyboardType: TextInputType.number,
              decoration: const InputDecoration(
                labelText: 'Expected spend per hari',
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
    final monthlyAllowance = _allowanceController.text.trim().isEmpty
        ? null
        : num.tryParse(_allowanceController.text);
    final expectedDailySpend = _expectedDailySpendController.text.trim().isEmpty
        ? null
        : num.tryParse(_expectedDailySpendController.text);

    if (_nameController.text.trim().isEmpty ||
        (_allowanceController.text.trim().isNotEmpty &&
            monthlyAllowance == null) ||
        (_expectedDailySpendController.text.trim().isNotEmpty &&
            expectedDailySpend == null)) {
      ScaffoldMessenger.of(
        context,
      ).showSnackBar(const SnackBar(content: Text('Lengkapi data profil.')));
      return;
    }

    setState(() => _isSaving = true);

    try {
      await ref
          .read(profileRepositoryProvider)
          .updateProfile(
            name: _nameController.text.trim(),
            university: _universityController.text.trim(),
            phoneNumber: _phoneController.text.trim(),
            monthlyAllowance: monthlyAllowance,
            expectedDailySpend: expectedDailySpend,
          );

      if (mounted) {
        ProfileScreen._invalidateFinancialViews(ref);
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

class _TimeSkipDialog extends ConsumerStatefulWidget {
  const _TimeSkipDialog({required this.profile});

  final Map<String, dynamic> profile;

  @override
  ConsumerState<_TimeSkipDialog> createState() => _TimeSkipDialogState();
}

class _TimeSkipDialogState extends ConsumerState<_TimeSkipDialog> {
  final _daysController = TextEditingController();
  var _isSaving = false;

  @override
  void dispose() {
    _daysController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final currentSkip = widget.profile['timeSkipDays'] as int? ?? 0;

    return AlertDialog(
      title: const Text('Timeskip'),
      content: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text('Saat ini: $currentSkip hari'),
          const SizedBox(height: 12),
          TextField(
            controller: _daysController,
            keyboardType: TextInputType.number,
            decoration: const InputDecoration(
              labelText: 'Tambah berapa hari?',
              border: OutlineInputBorder(),
            ),
          ),
        ],
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
              : const Text('Jalankan'),
        ),
      ],
    );
  }

  Future<void> _save() async {
    final additionalDays = int.tryParse(_daysController.text.trim());

    if (additionalDays == null || additionalDays <= 0) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Isi jumlah hari timeskip.')),
      );
      return;
    }

    setState(() => _isSaving = true);

    try {
      await ref.read(profileRepositoryProvider).timeSkip(days: additionalDays);

      if (mounted) {
        ProfileScreen._invalidateFinancialViews(ref);
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

String _currency(Object? value) {
  return AppFormatters.currency(value, fallback: '-');
}
