import 'package:dio/dio.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../session/session_controller.dart';
import '../storage/token_storage.dart';

const defaultBaseUrl = String.fromEnvironment(
  'API_BASE_URL',
  defaultValue: 'http://localhost:3000',
);

final dioProvider = Provider<Dio>((ref) {
  final storage = ref.watch(tokenStorageProvider);
  final dio = Dio(
    BaseOptions(
      baseUrl: defaultBaseUrl,
      connectTimeout: const Duration(seconds: 10),
      receiveTimeout: const Duration(seconds: 10),
      headers: {'Content-Type': 'application/json'},
    ),
  );

  dio.interceptors.add(
    QueuedInterceptorsWrapper(
      onRequest: (options, handler) async {
        final token = await storage.readAccessToken();

        if (token != null && token.isNotEmpty) {
          options.headers['Authorization'] = 'Bearer $token';
        }

        handler.next(options);
      },
      onError: (error, handler) async {
        final statusCode = error.response?.statusCode;
        final requestOptions = error.requestOptions;
        final hasRetried = requestOptions.extra['retried'] == true;
        final isAuthRequest = requestOptions.path.startsWith('/auth/');

        if (statusCode != 401 || hasRetried || isAuthRequest) {
          handler.next(error);
          return;
        }

        final refreshToken = await storage.readRefreshToken();

        if (refreshToken == null || refreshToken.isEmpty) {
          handler.next(error);
          return;
        }

        try {
          final refreshDio = Dio(
            BaseOptions(
              baseUrl: defaultBaseUrl,
              connectTimeout: const Duration(seconds: 10),
              receiveTimeout: const Duration(seconds: 10),
              headers: {'Content-Type': 'application/json'},
            ),
          );

          final refreshResponse = await refreshDio.post(
            '/auth/refresh',
            data: {'refreshToken': refreshToken},
          );
          final tokens =
              (refreshResponse.data as Map<String, dynamic>)['tokens']
                  as Map<String, dynamic>;
          final accessToken = tokens['accessToken'] as String;
          final nextRefreshToken = tokens['refreshToken'] as String;

          await storage.saveTokens(
            accessToken: accessToken,
            refreshToken: nextRefreshToken,
          );

          final retryOptions = Options(
            method: requestOptions.method,
            headers: {
              ...requestOptions.headers,
              'Authorization': 'Bearer $accessToken',
            },
            responseType: requestOptions.responseType,
            contentType: requestOptions.contentType,
            extra: {...requestOptions.extra, 'retried': true},
            followRedirects: requestOptions.followRedirects,
            listFormat: requestOptions.listFormat,
            receiveDataWhenStatusError:
                requestOptions.receiveDataWhenStatusError,
            receiveTimeout: requestOptions.receiveTimeout,
            requestEncoder: requestOptions.requestEncoder,
            responseDecoder: requestOptions.responseDecoder,
            sendTimeout: requestOptions.sendTimeout,
            validateStatus: requestOptions.validateStatus,
          );

          final response = await dio.request<dynamic>(
            requestOptions.path,
            data: requestOptions.data,
            queryParameters: requestOptions.queryParameters,
            options: retryOptions,
            cancelToken: requestOptions.cancelToken,
            onReceiveProgress: requestOptions.onReceiveProgress,
            onSendProgress: requestOptions.onSendProgress,
          );

          handler.resolve(response);
        } catch (_) {
          await storage.clear();
          ref.read(sessionControllerProvider.notifier).notifyTokenCleared();
          handler.next(error);
        }
      },
    ),
  );

  return dio;
});

class ApiException implements Exception {
  const ApiException(this.message);

  final String message;

  @override
  String toString() => message;
}

ApiException mapDioError(Object error) {
  if (error is! DioException) {
    return ApiException(error.toString());
  }

  final responseData = error.response?.data;

  if (responseData is Map<String, dynamic>) {
    final message = responseData['message'];

    if (message is List) {
      return ApiException(message.join(', '));
    }

    if (message is String) {
      return ApiException(message);
    }
  }

  if (error.type == DioExceptionType.connectionError) {
    return const ApiException('Tidak bisa terhubung ke server API.');
  }

  return ApiException(error.message ?? 'Terjadi kesalahan.');
}
