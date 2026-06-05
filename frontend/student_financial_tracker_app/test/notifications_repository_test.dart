import 'package:dio/dio.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:student_financial_tracker_app/src/features/notifications/notifications_repository.dart';
import 'package:student_financial_tracker_app/src/features/savings_goals/savings_goals_repository.dart';

const _baseUrl = String.fromEnvironment(
  'API_BASE_URL',
  defaultValue: 'http://localhost:3000',
);

void main() {
  test('generates and marks notifications from the backend', () async {
    final dio = Dio(
      BaseOptions(
        baseUrl: _baseUrl,
        headers: {'Content-Type': 'application/json'},
      ),
    );
    final unique = DateTime.now().millisecondsSinceEpoch;

    final authResponse = await dio.post<Map<String, dynamic>>(
      '/auth/register',
      data: {
        'name': 'Notifications Tester',
        'email': 'notifications-$unique@example.com',
        'password': 'password123',
      },
    );
    final tokens = authResponse.data!['tokens'] as Map<String, dynamic>;
    dio.options.headers['Authorization'] = 'Bearer ${tokens['accessToken']}';

    await SavingsGoalsRepository(dio).create(
      name: 'Dana darurat notification test',
      targetAmount: 1000000,
    );

    final repository = NotificationsRepository(dio);
    await repository.generate();
    final notifications = await repository.findAll();

    expect(notifications, isNotEmpty);

    await repository.markAsRead(notifications.first['id'] as String);
    await repository.markAllAsRead();

    final updatedNotifications = await repository.findAll();
    expect(updatedNotifications.first['status'], 'READ');
  });
}
