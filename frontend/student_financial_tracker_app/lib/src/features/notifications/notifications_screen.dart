import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:intl/intl.dart';

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
            return const Center(child: Text('Belum ada notifikasi.'));
          }

          return RefreshIndicator(
            onRefresh: () async => ref.invalidate(notificationsProvider),
            child: ListView.separated(
              padding: const EdgeInsets.all(16),
              itemCount: items.length,
              separatorBuilder: (_, _) => const SizedBox(height: 12),
              itemBuilder: (context, index) {
                return _NotificationTile(notification: items[index]);
              },
            ),
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
    );
  }

  Future<void> _generate(BuildContext context, WidgetRef ref) async {
    try {
      await ref.read(notificationsRepositoryProvider).generate();
      ref.invalidate(notificationsProvider);
      if (context.mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Notifikasi diperbarui.')),
        );
      }
    } catch (error) {
      if (context.mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text(error.toString())),
        );
      }
    }
  }

  Future<void> _markAllAsRead(BuildContext context, WidgetRef ref) async {
    try {
      await ref.read(notificationsRepositoryProvider).markAllAsRead();
      ref.invalidate(notificationsProvider);
    } catch (error) {
      if (context.mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text(error.toString())),
        );
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
        color: Colors.redAccent,
        child: const Icon(Icons.delete, color: Colors.white),
      ),
      onDismissed: (_) => _delete(ref),
      child: Card(
        margin: EdgeInsets.zero,
        child: ListTile(
          leading: CircleAvatar(
            child: Icon(_iconForType(notification['type'] as String)),
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
              Text(notification['message'] as String),
              const SizedBox(height: 4),
              Text(_formatDate(notification['createdAt'])),
            ],
          ),
          trailing: isUnread ? const Icon(Icons.fiber_manual_record) : null,
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

  String _formatDate(Object? value) {
    final date = DateTime.tryParse('$value');
    if (date == null) {
      return '';
    }
    return DateFormat.yMMMd('id_ID').add_Hm().format(date.toLocal());
  }
}
