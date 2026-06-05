import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

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

    return Scaffold(
      body: SafeArea(
        child: Center(
          child: SingleChildScrollView(
            padding: const EdgeInsets.all(24),
            child: ConstrainedBox(
              constraints: const BoxConstraints(maxWidth: 420),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  if (_isRegisterMode || authState.hasError) ...[
                    Align(
                      alignment: Alignment.centerLeft,
                      child: TextButton.icon(
                        onPressed: isLoading ? null : _goBackToLogin,
                        icon: const Icon(Icons.arrow_back),
                        label: const Text('Kembali'),
                      ),
                    ),
                    const SizedBox(height: 8),
                  ],
                  const Icon(Icons.account_balance_wallet, size: 56),
                  const SizedBox(height: 16),
                  Text(
                    'Student Financial Tracker',
                    textAlign: TextAlign.center,
                    style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                          fontWeight: FontWeight.w700,
                        ),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    'Kelola uang bulanan, budget, dan target tabungan.',
                    textAlign: TextAlign.center,
                    style: Theme.of(context).textTheme.bodyMedium,
                  ),
                  const SizedBox(height: 28),
                  if (_isRegisterMode) ...[
                    TextField(
                      controller: _nameController,
                      decoration: const InputDecoration(
                        labelText: 'Nama',
                        prefixIcon: Icon(Icons.person),
                        border: OutlineInputBorder(),
                      ),
                    ),
                    const SizedBox(height: 12),
                  ],
                  TextField(
                    controller: _emailController,
                    keyboardType: TextInputType.emailAddress,
                    decoration: const InputDecoration(
                      labelText: 'Email',
                      prefixIcon: Icon(Icons.mail),
                      border: OutlineInputBorder(),
                    ),
                  ),
                  const SizedBox(height: 12),
                  TextField(
                    controller: _passwordController,
                    obscureText: true,
                    decoration: const InputDecoration(
                      labelText: 'Password',
                      prefixIcon: Icon(Icons.lock),
                      border: OutlineInputBorder(),
                    ),
                  ),
                  const SizedBox(height: 18),
                  FilledButton(
                    onPressed: isLoading ? null : _submit,
                    child: isLoading
                        ? const SizedBox(
                            width: 18,
                            height: 18,
                            child: CircularProgressIndicator(strokeWidth: 2),
                          )
                        : Text(_isRegisterMode ? 'Register' : 'Login'),
                  ),
                  TextButton(
                    onPressed: isLoading
                        ? null
                        : () {
                            ref
                                .read(authControllerProvider.notifier)
                                .resetUnauthenticated();
                            setState(() {
                              _isRegisterMode = !_isRegisterMode;
                            });
                          },
                    child: Text(
                      _isRegisterMode
                          ? 'Sudah punya akun? Login'
                          : 'Belum punya akun? Register',
                    ),
                  ),
                  if (authState.hasError)
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.stretch,
                      children: [
                        Text(
                          authState.error.toString(),
                          textAlign: TextAlign.center,
                          style: TextStyle(
                            color: Theme.of(context).colorScheme.error,
                          ),
                        ),
                        const SizedBox(height: 12),
                        OutlinedButton.icon(
                          onPressed: isLoading ? null : _goBackToLogin,
                          icon: const Icon(Icons.arrow_back),
                          label: const Text('Kembali ke Login'),
                        ),
                      ],
                    ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
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
