import 'package:dio/dio.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../core/api/api_client.dart';
import '../../core/storage/token_storage.dart';

final authRepositoryProvider = Provider<AuthRepository>((ref) {
  return AuthRepository(
    dio: ref.watch(dioProvider),
    tokenStorage: ref.watch(tokenStorageProvider),
  );
});

class AuthRepository {
  AuthRepository({required this.dio, required this.tokenStorage});

  final Dio dio;
  final TokenStorage tokenStorage;

  Future<void> login({required String email, required String password}) async {
    try {
      final response = await dio.post(
        '/auth/login',
        data: {'email': email, 'password': password},
      );
      await _saveTokenResponse(response.data as Map<String, dynamic>);
    } catch (error) {
      throw mapDioError(error);
    }
  }

  Future<void> register({
    required String name,
    required String email,
    required String password,
  }) async {
    try {
      await dio.post(
        '/auth/register',
        data: {'name': name, 'email': email, 'password': password},
      );
    } catch (error) {
      throw mapDioError(error);
    }
  }

  Future<void> logout() async {
    final refreshToken = await tokenStorage.readRefreshToken();

    if (refreshToken != null && refreshToken.isNotEmpty) {
      try {
        await dio.post('/auth/logout', data: {'refreshToken': refreshToken});
      } catch (_) {
        // Token is still cleared locally even when the server session is gone.
      }
    }

    await tokenStorage.clear();
  }

  Future<void> _saveTokenResponse(Map<String, dynamic> data) async {
    final tokens = data['tokens'] as Map<String, dynamic>;
    await tokenStorage.saveTokens(
      accessToken: tokens['accessToken'] as String,
      refreshToken: tokens['refreshToken'] as String,
    );
  }
}
