import 'package:dio/dio.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../core/api/api_client.dart';
import '../../core/session/session_controller.dart';

final dashboardRepositoryProvider = Provider<DashboardRepository>((ref) {
  return DashboardRepository(ref.watch(dioProvider));
});

class DashboardRepository {
  DashboardRepository(this._dio);

  final Dio _dio;

  Future<Map<String, dynamic>> getDashboard() async {
    final response = await _dio.get('/analytics/dashboard');
    return response.data as Map<String, dynamic>;
  }
}

final dashboardProvider = FutureProvider<Map<String, dynamic>>((ref) {
  ref.watch(sessionControllerProvider);
  return ref.watch(dashboardRepositoryProvider).getDashboard();
});
