import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../shared/theme/app_colors.dart';
import '../../shared/theme/app_spacing.dart';
import '../../shared/widgets/app_buttons.dart';
import '../../shared/widgets/app_card.dart';
import '../../shared/widgets/app_text_field.dart';
import 'auth_controller.dart';

class LoginScreen extends ConsumerStatefulWidget {
  const LoginScreen({super.key});

  @override
  ConsumerState<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends ConsumerState<LoginScreen> {
  final _nameController = TextEditingController();
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  var _isRegisterMode = false;
  var _obscurePassword = true;

  @override
  void dispose() {
    _nameController.dispose();
    _emailController.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final authState = ref.watch(authControllerProvider);
    final isLoading = authState.isLoading;
    final textTheme = Theme.of(context).textTheme;

    return Scaffold(
      body: SafeArea(
        child: Center(
          child: SingleChildScrollView(
            padding: const EdgeInsets.all(AppSpacing.xl),
            child: LayoutBuilder(
              builder: (context, constraints) {
                final isWide = MediaQuery.sizeOf(context).width >= 760;

                return ConstrainedBox(
                  constraints: const BoxConstraints(maxWidth: 920),
                  child: isWide
                      ? Row(
                          crossAxisAlignment: CrossAxisAlignment.center,
                          children: [
                            const Expanded(child: _AuthIntroPanel()),
                            const SizedBox(width: AppSpacing.xl),
                            SizedBox(
                              width: 420,
                              child: _AuthFormCard(
                                isRegisterMode: _isRegisterMode,
                                isLoading: isLoading,
                                hasError: authState.hasError,
                                errorMessage: authState.error?.toString(),
                                obscurePassword: _obscurePassword,
                                nameController: _nameController,
                                emailController: _emailController,
                                passwordController: _passwordController,
                                onSubmit: _submit,
                                onBackToLogin: _goBackToLogin,
                                onToggleMode: _toggleMode,
                                onTogglePassword: _togglePassword,
                              ),
                            ),
                          ],
                        )
                      : Column(
                          crossAxisAlignment: CrossAxisAlignment.stretch,
                          children: [
                            Row(
                              children: [
                                Container(
                                  width: 48,
                                  height: 48,
                                  decoration: BoxDecoration(
                                    color: AppColors.primaryLight,
                                    borderRadius: BorderRadius.circular(
                                      AppRadius.md,
                                    ),
                                  ),
                                  child: const Icon(
                                    Icons.account_balance_wallet,
                                    color: AppColors.primaryDark,
                                  ),
                                ),
                                const SizedBox(width: AppSpacing.md),
                                Expanded(
                                  child: Column(
                                    crossAxisAlignment:
                                        CrossAxisAlignment.start,
                                    children: [
                                      Text(
                                        'SakuAman',
                                        style: textTheme.titleLarge,
                                      ),
                                      Text(
                                        'Kontrol uang bulanan mahasiswa',
                                        style: textTheme.bodySmall?.copyWith(
                                          color: AppColors.slate,
                                        ),
                                      ),
                                    ],
                                  ),
                                ),
                              ],
                            ),
                            const SizedBox(height: AppSpacing.xl),
                            _AuthFormCard(
                              isRegisterMode: _isRegisterMode,
                              isLoading: isLoading,
                              hasError: authState.hasError,
                              errorMessage: authState.error?.toString(),
                              obscurePassword: _obscurePassword,
                              nameController: _nameController,
                              emailController: _emailController,
                              passwordController: _passwordController,
                              onSubmit: _submit,
                              onBackToLogin: _goBackToLogin,
                              onToggleMode: _toggleMode,
                              onTogglePassword: _togglePassword,
                            ),
                          ],
                        ),
                );
              },
            ),
          ),
        ),
      ),
    );
  }

  void _toggleMode() {
    ref.read(authControllerProvider.notifier).resetUnauthenticated();
    setState(() {
      _isRegisterMode = !_isRegisterMode;
    });
  }

  void _togglePassword() {
    setState(() => _obscurePassword = !_obscurePassword);
  }

  void _goBackToLogin() {
    ref.read(authControllerProvider.notifier).resetUnauthenticated();
    setState(() {
      _isRegisterMode = false;
      _passwordController.clear();
    });
  }

  Future<void> _submit() async {
    if (_emailController.text.trim().isEmpty ||
        _passwordController.text.length < 8 ||
        (_isRegisterMode && _nameController.text.trim().isEmpty)) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Isi data dengan benar. Password minimal 8 karakter.'),
        ),
      );
      return;
    }

    final controller = ref.read(authControllerProvider.notifier);

    if (_isRegisterMode) {
      await controller.register(
        name: _nameController.text.trim(),
        email: _emailController.text.trim(),
        password: _passwordController.text,
      );
      final nextState = ref.read(authControllerProvider);
      if (mounted && !nextState.hasError) {
        setState(() {
          _isRegisterMode = false;
          _nameController.clear();
          _passwordController.clear();
        });
      }
      return;
    }

    await controller.login(
      email: _emailController.text.trim(),
      password: _passwordController.text,
    );
  }
}

class _AuthIntroPanel extends StatelessWidget {
  const _AuthIntroPanel();

  @override
  Widget build(BuildContext context) {
    final textTheme = Theme.of(context).textTheme;

    return AppCard(
      color: AppColors.ink,
      borderColor: Colors.transparent,
      padding: AppInsets.cardLarge,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            width: 52,
            height: 52,
            decoration: BoxDecoration(
              color: Colors.white.withValues(alpha: 0.1),
              borderRadius: BorderRadius.circular(AppRadius.md),
            ),
            child: const Icon(
              Icons.account_balance_wallet,
              color: Colors.white,
            ),
          ),
          const SizedBox(height: AppSpacing.xl),
          Text(
            'Kelola uang kuliah, harian, dan tabungan dari satu tempat.',
            style: textTheme.headlineSmall?.copyWith(color: Colors.white),
          ),
          const SizedBox(height: AppSpacing.md),
          Text(
            'Dashboard ringkas untuk memantau saldo bulanan, budget kategori, pengeluaran terbesar, dan target tabungan.',
            style: textTheme.bodyMedium?.copyWith(
              color: Colors.white.withValues(alpha: 0.74),
            ),
          ),
          const SizedBox(height: AppSpacing.xl),
          const Wrap(
            spacing: AppSpacing.sm,
            runSpacing: AppSpacing.sm,
            children: [
              _AuthFeature(icon: Icons.pie_chart_outline, label: 'Analisis'),
              _AuthFeature(icon: Icons.savings_outlined, label: 'Tabungan'),
              _AuthFeature(
                icon: Icons.notifications_outlined,
                label: 'Reminder',
              ),
              _AuthFeature(icon: Icons.receipt_long_outlined, label: 'Riwayat'),
            ],
          ),
        ],
      ),
    );
  }
}

class _AuthFeature extends StatelessWidget {
  const _AuthFeature({required this.icon, required this.label});

  final IconData icon;
  final String label;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
      decoration: BoxDecoration(
        color: Colors.white.withValues(alpha: 0.08),
        borderRadius: BorderRadius.circular(AppRadius.md),
        border: Border.all(color: Colors.white.withValues(alpha: 0.1)),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(icon, color: AppColors.primaryLight, size: 18),
          const SizedBox(width: AppSpacing.sm),
          Text(
            label,
            style: Theme.of(context).textTheme.labelMedium?.copyWith(
              color: Colors.white,
              fontWeight: FontWeight.w700,
            ),
          ),
        ],
      ),
    );
  }
}

class _AuthFormCard extends StatelessWidget {
  const _AuthFormCard({
    required this.isRegisterMode,
    required this.isLoading,
    required this.hasError,
    required this.obscurePassword,
    required this.nameController,
    required this.emailController,
    required this.passwordController,
    required this.onSubmit,
    required this.onBackToLogin,
    required this.onToggleMode,
    required this.onTogglePassword,
    this.errorMessage,
  });

  final bool isRegisterMode;
  final bool isLoading;
  final bool hasError;
  final bool obscurePassword;
  final TextEditingController nameController;
  final TextEditingController emailController;
  final TextEditingController passwordController;
  final VoidCallback onSubmit;
  final VoidCallback onBackToLogin;
  final VoidCallback onToggleMode;
  final VoidCallback onTogglePassword;
  final String? errorMessage;

  @override
  Widget build(BuildContext context) {
    final textTheme = Theme.of(context).textTheme;

    return AppCard(
      padding: AppInsets.cardLarge,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          if (isRegisterMode || hasError) ...[
            Align(
              alignment: Alignment.centerLeft,
              child: TextButton.icon(
                onPressed: isLoading ? null : onBackToLogin,
                icon: const Icon(Icons.arrow_back),
                label: const Text('Kembali'),
              ),
            ),
            const SizedBox(height: AppSpacing.sm),
          ],
          Text(
            isRegisterMode ? 'Buat akun baru' : 'Masuk ke akunmu',
            style: textTheme.titleLarge,
          ),
          const SizedBox(height: AppSpacing.xs),
          Text(
            isRegisterMode
                ? 'Mulai catat pemasukan, pengeluaran, dan target tabungan.'
                : 'Pantau kondisi keuangan bulan ini dengan cepat.',
            style: textTheme.bodyMedium?.copyWith(color: AppColors.slate),
          ),
          const SizedBox(height: AppSpacing.xl),
          AnimatedSwitcher(
            duration: const Duration(milliseconds: 180),
            child: isRegisterMode
                ? Column(
                    key: const ValueKey('name-field'),
                    children: [
                      AppTextField(
                        controller: nameController,
                        label: 'Nama lengkap',
                        icon: Icons.person_outline,
                        textInputAction: TextInputAction.next,
                      ),
                      const SizedBox(height: AppSpacing.md),
                    ],
                  )
                : const SizedBox.shrink(key: ValueKey('empty-name-field')),
          ),
          AppTextField(
            controller: emailController,
            label: 'Email',
            icon: Icons.mail_outline,
            keyboardType: TextInputType.emailAddress,
            textInputAction: TextInputAction.next,
          ),
          const SizedBox(height: AppSpacing.md),
          AppTextField(
            controller: passwordController,
            label: 'Password',
            icon: Icons.lock_outline,
            obscureText: obscurePassword,
            textInputAction: TextInputAction.done,
            suffixIcon: IconButton(
              tooltip: obscurePassword
                  ? 'Tampilkan password'
                  : 'Sembunyikan password',
              onPressed: onTogglePassword,
              icon: Icon(
                obscurePassword
                    ? Icons.visibility_outlined
                    : Icons.visibility_off_outlined,
              ),
            ),
          ),
          const SizedBox(height: AppSpacing.lg),
          AppPrimaryButton(
            label: isRegisterMode ? 'Daftar' : 'Login',
            isLoading: isLoading,
            onPressed: onSubmit,
          ),
          const SizedBox(height: AppSpacing.sm),
          TextButton(
            onPressed: isLoading ? null : onToggleMode,
            child: Text(
              isRegisterMode
                  ? 'Sudah punya akun? Login'
                  : 'Belum punya akun? Register',
            ),
          ),
          if (hasError && errorMessage != null) ...[
            const SizedBox(height: AppSpacing.md),
            Container(
              padding: const EdgeInsets.all(AppSpacing.md),
              decoration: BoxDecoration(
                color: AppColors.dangerSoft,
                borderRadius: BorderRadius.circular(AppRadius.md),
                border: Border.all(
                  color: AppColors.danger.withValues(alpha: 0.18),
                ),
              ),
              child: Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Icon(Icons.error_outline, color: AppColors.danger),
                  const SizedBox(width: AppSpacing.sm),
                  Expanded(
                    child: Text(
                      errorMessage!,
                      style: textTheme.bodySmall?.copyWith(
                        color: AppColors.danger,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ],
        ],
      ),
    );
  }
}
