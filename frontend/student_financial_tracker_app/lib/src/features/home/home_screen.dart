import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../shared/theme/app_colors.dart';
import '../auth/auth_controller.dart';
import '../budgets/budgets_screen.dart';
import '../dashboard/dashboard_screen.dart';
import '../notifications/notifications_repository.dart';
import '../notifications/notifications_screen.dart';
import '../profile/profile_screen.dart';
import '../reports/reports_screen.dart';
import '../savings_goals/savings_goals_screen.dart';
import '../transactions/transactions_screen.dart';

class HomeScreen extends ConsumerStatefulWidget {
  const HomeScreen({super.key});

  @override
  ConsumerState<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends ConsumerState<HomeScreen> {
  var _selectedIndex = 0;

  static const _pages = [
    _PageMeta(
      title: 'Dashboard',
      subtitle: 'Ringkasan kondisi keuangan bulan ini',
      icon: Icons.dashboard_outlined,
      selectedIcon: Icons.dashboard,
      label: 'Dashboard',
    ),
    _PageMeta(
      title: 'Transaksi',
      subtitle: 'Pemasukan dan pengeluaran harian',
      icon: Icons.receipt_long_outlined,
      selectedIcon: Icons.receipt_long,
      label: 'Transaksi',
    ),
    _PageMeta(
      title: 'Budget',
      subtitle: 'Pantau batas pengeluaran per kategori',
      icon: Icons.account_balance_wallet_outlined,
      selectedIcon: Icons.account_balance_wallet,
      label: 'Budget',
    ),
    _PageMeta(
      title: 'Tabungan',
      subtitle: 'Target dan progres setoran',
      icon: Icons.savings_outlined,
      selectedIcon: Icons.savings,
      label: 'Tabungan',
    ),
    _PageMeta(
      title: 'Laporan',
      subtitle: 'Analisis bulanan dan performa budget',
      icon: Icons.bar_chart_outlined,
      selectedIcon: Icons.bar_chart,
      label: 'Laporan',
    ),
  ];

  @override
  Widget build(BuildContext context) {
    final page = _pages[_selectedIndex];

    return Scaffold(
      appBar: AppBar(
        titleSpacing: 16,
        title: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(page.title),
            const SizedBox(height: 2),
            Text(
              page.subtitle,
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
              style: Theme.of(context).textTheme.bodySmall?.copyWith(
                color: AppColors.slate,
                fontWeight: FontWeight.w500,
              ),
            ),
          ],
        ),
        actions: [
          Consumer(
            builder: (context, ref, _) {
              final unreadCount = ref.watch(unreadNotificationsCountProvider);
              final count = unreadCount.maybeWhen(
                data: (value) => value,
                orElse: () => 0,
              );

              return IconButton(
                tooltip: 'Notifikasi',
                onPressed: () => Navigator.of(context).push(
                  MaterialPageRoute<void>(
                    builder: (_) => const NotificationsScreen(),
                  ),
                ),
                icon: Badge(
                  isLabelVisible: count > 0,
                  label: Text('$count'),
                  child: const Icon(Icons.notifications_outlined),
                ),
              );
            },
          ),
          PopupMenuButton<String>(
            tooltip: 'Menu akun',
            icon: const Icon(Icons.account_circle_outlined),
            onSelected: (value) {
              if (value == 'profile') {
                Navigator.of(context).push(
                  MaterialPageRoute<void>(
                    builder: (_) => const ProfileScreen(),
                  ),
                );
              }
              if (value == 'logout') {
                ref.read(authControllerProvider.notifier).logout();
              }
            },
            itemBuilder: (context) => const [
              PopupMenuItem(
                value: 'profile',
                child: ListTile(
                  leading: Icon(Icons.person_outline),
                  title: Text('Profil'),
                ),
              ),
              PopupMenuItem(
                value: 'logout',
                child: ListTile(
                  leading: Icon(Icons.logout),
                  title: Text('Logout'),
                ),
              ),
            ],
          ),
          const SizedBox(width: 6),
        ],
      ),
      body: IndexedStack(
        index: _selectedIndex,
        children: const [
          DashboardScreen(),
          TransactionsScreen(),
          BudgetsScreen(),
          SavingsGoalsScreen(),
          ReportsScreen(),
        ],
      ),
      bottomNavigationBar: DecoratedBox(
        decoration: const BoxDecoration(
          color: AppColors.surface,
          border: Border(top: BorderSide(color: AppColors.border)),
        ),
        child: NavigationBar(
          selectedIndex: _selectedIndex,
          onDestinationSelected: (index) {
            setState(() => _selectedIndex = index);
          },
          destinations: [
            for (final page in _pages)
              NavigationDestination(
                icon: Icon(page.icon),
                selectedIcon: Icon(page.selectedIcon),
                label: page.label,
              ),
          ],
        ),
      ),
    );
  }
}

class _PageMeta {
  const _PageMeta({
    required this.title,
    required this.subtitle,
    required this.icon,
    required this.selectedIcon,
    required this.label,
  });

  final String title;
  final String subtitle;
  final IconData icon;
  final IconData selectedIcon;
  final String label;
}
