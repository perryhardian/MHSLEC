import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../core/session/session_controller.dart';
import '../../core/storage/token_storage.dart';
import 'auth_repository.dart';

final authControllerProvider =
    AsyncNotifierProvider<AuthController, AuthState>(AuthController.new);

class AuthController extends AsyncNotifier<AuthState> {
  @override
  Future<AuthState> build() async {
    ref.watch(sessionControllerProvider);
    final storage = ref.watch(tokenStorageProvider);
    final token = await storage.readAccessToken();
    return AuthState(isAuthenticated: token != null && token.isNotEmpty);
  }

  Future<void> login({required String email, required String password}) async {
    state = const AsyncLoading();
    state = await AsyncValue.guard(() async {
      final repository = ref.read(authRepositoryProvider);
      await repository.login(email: email, password: password);
      ref.read(sessionControllerProvider.notifier).notifyTokenCleared();
      return const AuthState(
        isAuthenticated: true,
        successMessage: 'Login success',
      );
    });
  }

  Future<void> register({
    required String name,
    required String email,
    required String password,
  }) async {
    state = const AsyncLoading();
    state = await AsyncValue.guard(() async {
      final repository = ref.read(authRepositoryProvider);
      await repository.register(name: name, email: email, password: password);
      return const AuthState(
        isAuthenticated: false,
        successMessage: 'Register success',
      );
    });
  }

  Future<void> logout() async {
    await ref.read(authRepositoryProvider).logout();
    ref.read(sessionControllerProvider.notifier).notifyTokenCleared();
    state = const AsyncData(AuthState(isAuthenticated: false));
  }

  void resetUnauthenticated() {
    state = const AsyncData(AuthState(isAuthenticated: false));
  }
}

class AuthState {
  const AuthState({
    required this.isAuthenticated,
    this.successMessage,
  });

  final bool isAuthenticated;
  final String? successMessage;
}
