import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import 'features/auth/auth_controller.dart';
import 'features/auth/login_screen.dart';
import 'features/home/home_screen.dart';

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
      final state = next.maybeWhen(
        data: (value) => value,
        orElse: () => null,
      );
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
      title: 'Student Financial Tracker',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(
          seedColor: const Color(0xFF0F766E),
          brightness: Brightness.light,
        ),
        appBarTheme: const AppBarTheme(
          centerTitle: false,
          surfaceTintColor: Colors.transparent,
        ),
        cardTheme: CardThemeData(
          elevation: 0,
          color: Colors.white,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(8),
            side: const BorderSide(color: Color(0xFFE5E7EB)),
          ),
        ),
        inputDecorationTheme: InputDecorationTheme(
          filled: true,
          fillColor: Colors.white,
          contentPadding: const EdgeInsets.symmetric(
            horizontal: 14,
            vertical: 12,
          ),
          border: OutlineInputBorder(
            borderRadius: BorderRadius.circular(8),
          ),
          enabledBorder: OutlineInputBorder(
            borderRadius: BorderRadius.circular(8),
            borderSide: const BorderSide(color: Color(0xFFD1D5DB)),
          ),
        ),
        filledButtonTheme: FilledButtonThemeData(
          style: FilledButton.styleFrom(
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(8),
            ),
          ),
        ),
        outlinedButtonTheme: OutlinedButtonThemeData(
          style: OutlinedButton.styleFrom(
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(8),
            ),
          ),
        ),
        scaffoldBackgroundColor: const Color(0xFFF7FAF9),
        useMaterial3: true,
      ),
      home: authState.when(
        data: (state) => state.isAuthenticated
            ? const HomeScreen()
            : const LoginScreen(),
        loading: () => const _LoadingScreen(),
        error: (error, stackTrace) => AuthErrorScreen(message: error.toString()),
      ),
    );
  }
}

class _LoadingScreen extends StatelessWidget {
  const _LoadingScreen();

  @override
  Widget build(BuildContext context) {
    return const Scaffold(
      body: Center(child: CircularProgressIndicator()),
    );
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
                    child: DecoratedBox(
                      decoration: BoxDecoration(
                        color: colorScheme.errorContainer.withValues(
                          alpha: 0.35,
                        ),
                        border: Border.all(
                          color: colorScheme.error.withValues(alpha: 0.18),
                        ),
                        borderRadius: BorderRadius.circular(8),
                      ),
                      child: Padding(
                        padding: const EdgeInsets.symmetric(
                          horizontal: 20,
                          vertical: 24,
                        ),
                        child: Column(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            Container(
                              width: 48,
                              height: 48,
                              decoration: BoxDecoration(
                                color: colorScheme.error.withValues(
                                  alpha: 0.12,
                                ),
                                shape: BoxShape.circle,
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
                                fontWeight: FontWeight.w700,
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
              ),
              const SizedBox(height: 48),
            ],
          ),
        ),
      ),
    );
  }
}
