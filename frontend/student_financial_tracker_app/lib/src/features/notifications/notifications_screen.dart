import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../shared/theme/app_colors.dart';
import '../../shared/theme/app_spacing.dart';
import '../../shared/utils/app_formatters.dart';
import '../../shared/widgets/app_card.dart';
import '../../shared/widgets/app_state_widgets.dart';
import '../../shared/widgets/status_pill.dart';
import 'notifications_repository.dart';

class NotificationsScreen extends ConsumerWidget {
  const NotificationsScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final notifications = ref.watch(notificationsProvider);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Notifikasi'),
        actions: [
          IconButton(
            tooltip: 'Generate',
            onPressed: () => _generate(context, ref),
            icon: const Icon(Icons.auto_awesome),
          ),
          IconButton(
            tooltip: 'Tandai semua dibaca',
            onPressed: () => _markAllAsRead(context, ref),
            icon: const Icon(Icons.done_all),
          ),
        ],
      ),
      body: notifications.when(
        data: (items) {
          if (items.isEmpty) {
            return const AppEmptyState(
              icon: Icons.notifications_outlined,
              title: 'Belum ada notifikasi',
              message: 'Reminder budget dan tabungan akan muncul di sini.',
            );
          }

          return RefreshIndicator(
            onRefresh: () async {
              ref.invalidate(notificationsProvider);
              await ref.read(notificationsProvider.future);
            },
            child: ListView.separated(
              padding: AppInsets.screen,
              itemCount: items.length,
              separatorBuilder: (_, _) => const SizedBox(height: 12),
              itemBuilder: (context, index) {
                return _NotificationTile(notification: items[index]);
              },
            ),
          );
        },
        loading: () => const AppLoadingState(message: 'Memuat notifikasi...'),
        error: (error, stackTrace) => AppErrorState(
          message: error.toString(),
          onRetry: () => ref.invalidate(notificationsProvider),
        ),
      ),
    );
  }

  Future<void> _generate(BuildContext context, WidgetRef ref) async {
    try {
      await ref.read(notificationsRepositoryProvider).generate();
      ref.invalidate(notificationsProvider);
      if (context.mounted) {
        ScaffoldMessenger.of(
          context,
        ).showSnackBar(const SnackBar(content: Text('Notifikasi diperbarui.')));
      }
    } catch (error) {
      if (context.mounted) {
        ScaffoldMessenger.of(
          context,
        ).showSnackBar(SnackBar(content: Text(error.toString())));
      }
    }
  }

  Future<void> _markAllAsRead(BuildContext context, WidgetRef ref) async {
    try {
      await ref.read(notificationsRepositoryProvider).markAllAsRead();
      ref.invalidate(notificationsProvider);
    } catch (error) {
      if (context.mounted) {
        ScaffoldMessenger.of(
          context,
        ).showSnackBar(SnackBar(content: Text(error.toString())));
      }
    }
  }
}

class _NotificationTile extends ConsumerWidget {
  const _NotificationTile({required this.notification});

  final Map<String, dynamic> notification;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final isUnread = notification['status'] == 'UNREAD';

    return Dismissible(
      key: ValueKey(notification['id'] as String),
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
      onDismissed: (_) => _delete(ref),
      child: AppCard(
        padding: const EdgeInsets.symmetric(
          horizontal: AppSpacing.md,
          vertical: AppSpacing.sm,
        ),
        borderColor: isUnread
            ? AppColors.primary.withValues(alpha: 0.24)
            : AppColors.border,
        child: ListTile(
          contentPadding: EdgeInsets.zero,
          leading: Container(
            width: 44,
            height: 44,
            decoration: BoxDecoration(
              color: _colorForType(
                notification['type'] as String,
              ).withValues(alpha: 0.12),
              borderRadius: BorderRadius.circular(AppRadius.md),
            ),
            child: Icon(
              _iconForType(notification['type'] as String),
              color: _colorForType(notification['type'] as String),
            ),
          ),
          title: Text(
            notification['title'] as String,
            style: TextStyle(
              fontWeight: isUnread ? FontWeight.w700 : FontWeight.w500,
            ),
          ),
          subtitle: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const SizedBox(height: AppSpacing.xs),
              Text(notification['message'] as String),
              const SizedBox(height: AppSpacing.xs),
              Text(_formatDate(notification['createdAt'])),
            ],
          ),
          trailing: isUnread
              ? const StatusPill(label: 'Baru', color: AppColors.primary)
              : null,
          onTap: isUnread ? () => _markAsRead(ref) : null,
        ),
      ),
    );
  }

  Future<void> _markAsRead(WidgetRef ref) async {
    await ref
        .read(notificationsRepositoryProvider)
        .markAsRead(notification['id'] as String);
    ref.invalidate(notificationsProvider);
  }

  Future<void> _delete(WidgetRef ref) async {
    await ref
        .read(notificationsRepositoryProvider)
        .delete(notification['id'] as String);
    ref.invalidate(notificationsProvider);
  }

  IconData _iconForType(String type) {
    return switch (type) {
      'BUDGET_EXCEEDED' => Icons.warning_amber,
      'BUDGET_WARNING' => Icons.account_balance_wallet_outlined,
      'SAVINGS_REMINDER' => Icons.savings_outlined,
      _ => Icons.notifications_outlined,
    };
  }

  Color _colorForType(String type) {
    return switch (type) {
      'BUDGET_EXCEEDED' => AppColors.danger,
      'BUDGET_WARNING' => AppColors.warning,
      'SAVINGS_REMINDER' => AppColors.savings,
      _ => AppColors.primary,
    };
  }

  String _formatDate(Object? value) {
    return AppFormatters.dateTime(value);
  }
}
