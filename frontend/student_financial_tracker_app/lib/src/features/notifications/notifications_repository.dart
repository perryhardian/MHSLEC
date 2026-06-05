import 'package:dio/dio.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../core/api/api_client.dart';
import '../../core/session/session_controller.dart';

final notificationsRepositoryProvider =
    Provider<NotificationsRepository>((ref) {
  return NotificationsRepository(ref.watch(dioProvider));
});

final notificationsProvider = FutureProvider<List<Map<String, dynamic>>>((ref) {
  ref.watch(sessionControllerProvider);
  return ref.watch(notificationsRepositoryProvider).findAll();
});

final unreadNotificationsCountProvider = FutureProvider<int>((ref) async {
  final notifications = await ref.watch(notificationsProvider.future);
  return notifications.where((item) => item['status'] == 'UNREAD').length;
});

class NotificationsRepository {
  NotificationsRepository(this._dio);

  final Dio _dio;

  Future<List<Map<String, dynamic>>> findAll() async {
    try {
      final response = await _dio.get('/notifications');
      return (response.data as List<dynamic>)
          .map((item) => item as Map<String, dynamic>)
          .toList();
    } catch (error) {
      throw mapDioError(error);
    }
  }

  Future<void> generate() async {
    try {
      await _dio.post('/notifications/generate');
    } catch (error) {
      throw mapDioError(error);
    }
  }

  Future<void> markAsRead(String id) async {
    try {
      await _dio.patch('/notifications/$id/read');
    } catch (error) {
      throw mapDioError(error);
    }
  }

  Future<void> markAllAsRead() async {
    try {
      await _dio.patch('/notifications/read-all');
    } catch (error) {
      throw mapDioError(error);
    }
  }

  Future<void> delete(String id) async {
    try {
      await _dio.delete('/notifications/$id');
    } catch (error) {
      throw mapDioError(error);
    }
  }
}
