import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import 'features/auth/auth_controller.dart';
import 'features/auth/login_screen.dart';
import 'features/home/home_screen.dart';
import 'shared/theme/app_colors.dart';
import 'shared/theme/app_spacing.dart';
import 'shared/theme/app_theme.dart';
import 'shared/widgets/app_card.dart';
import 'shared/widgets/app_state_widgets.dart';

class StudentFinancialTrackerApp extends ConsumerStatefulWidget {
  const StudentFinancialTrackerApp({super.key});

  @override
  ConsumerState<StudentFinancialTrackerApp> createState() =>
      _StudentFinancialTrackerAppState();
}

class _StudentFinancialTrackerAppState
    extends ConsumerState<StudentFinancialTrackerApp> {
  final _scaffoldMessengerKey = GlobalKey<ScaffoldMessengerState>();
  String? _lastShownAuthMessage;

  @override
  Widget build(BuildContext context) {
    final authState = ref.watch(authControllerProvider);

    ref.listen<AsyncValue<AuthState>>(authControllerProvider, (_, next) {
      final state = next.maybeWhen(data: (value) => value, orElse: () => null);
      final message = state?.successMessage;

      if (state == null) {
        _lastShownAuthMessage = null;
        return;
      }

      if (message == null) {
        _lastShownAuthMessage = null;
        return;
      }

      if (message == _lastShownAuthMessage) {
        return;
      }

      _lastShownAuthMessage = message;
      WidgetsBinding.instance.addPostFrameCallback((_) {
        _scaffoldMessengerKey.currentState
          ?..clearSnackBars()
          ..showSnackBar(SnackBar(content: Text(message)));
      });
    });

    return MaterialApp(
      scaffoldMessengerKey: _scaffoldMessengerKey,
      title: 'SakuAman',
      debugShowCheckedModeBanner: false,
      theme: AppTheme.light(),
      home: authState.when(
        data: (state) =>
            state.isAuthenticated ? const HomeScreen() : const LoginScreen(),
        loading: () => const _LoadingScreen(),
        error: (error, stackTrace) =>
            AuthErrorScreen(message: error.toString()),
      ),
    );
  }
}

class _LoadingScreen extends StatelessWidget {
  const _LoadingScreen();

  @override
  Widget build(BuildContext context) {
    return const Scaffold(body: AppLoadingState());
  }
}

class AuthErrorScreen extends ConsumerWidget {
  const AuthErrorScreen({required this.message, super.key});

  final String message;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final colorScheme = Theme.of(context).colorScheme;
    final textTheme = Theme.of(context).textTheme;

    return Scaffold(
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(20),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              Align(
                alignment: Alignment.centerLeft,
                child: TextButton.icon(
                  onPressed: () {
                    ref
                        .read(authControllerProvider.notifier)
                        .resetUnauthenticated();
                  },
                  icon: const Icon(Icons.arrow_back),
                  label: const Text('Kembali'),
                ),
              ),
              Expanded(
                child: Center(
                  child: ConstrainedBox(
                    constraints: const BoxConstraints(maxWidth: 360),
                    child: AppCard(
                      color: colorScheme.errorContainer.withValues(alpha: 0.24),
                      borderColor: colorScheme.error.withValues(alpha: 0.18),
                      padding: AppInsets.cardLarge,
                      child: Column(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Container(
                            width: 52,
                            height: 52,
                            decoration: BoxDecoration(
                              color: AppColors.dangerSoft,
                              borderRadius: BorderRadius.circular(AppRadius.md),
                            ),
                            child: Icon(
                              Icons.error_outline,
                              color: colorScheme.error,
                            ),
                          ),
                          const SizedBox(height: 16),
                          Text(
                            'Registrasi gagal',
                            textAlign: TextAlign.center,
                            style: textTheme.titleMedium?.copyWith(
                              fontWeight: FontWeight.w800,
                              color: colorScheme.onSurface,
                            ),
                          ),
                          const SizedBox(height: 8),
                          Text(
                            message,
                            textAlign: TextAlign.center,
                            style: textTheme.bodyMedium?.copyWith(
                              color: colorScheme.onSurfaceVariant,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                ),
              ),
              const SizedBox(height: 48),
            ],
          ),
        ),
      ),
    );
  }
}
