import 'package:dio/dio.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:student_financial_tracker_app/src/features/dashboard/dashboard_repository.dart';

void main() {
  test('DashboardRepository fetches dashboard summary from API', () async {
    final dio = Dio(
      BaseOptions(
        baseUrl: const String.fromEnvironment(
          'API_BASE_URL',
          defaultValue: 'http://localhost:3000',
        ),
        headers: {'Content-Type': 'application/json'},
      ),
    );
    final email =
        'flutter-dashboard-${DateTime.now().millisecondsSinceEpoch}@example.com';
    final authResponse = await dio.post<Map<String, dynamic>>(
      '/auth/register',
      data: {
        'name': 'Flutter Dashboard Test',
        'email': email,
        'password': 'password123',
      },
    );
    final tokens = authResponse.data!['tokens'] as Map<String, dynamic>;
    dio.options.headers['Authorization'] = 'Bearer ${tokens['accessToken']}';

    final repository = DashboardRepository(dio);
    final dashboard = await repository.getDashboard();

    expect(dashboard['summary'], isA<Map<String, dynamic>>());
    expect(dashboard['financialHealthScore'], isA<Map<String, dynamic>>());
  });
}
