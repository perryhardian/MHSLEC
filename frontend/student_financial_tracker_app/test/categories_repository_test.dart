import 'package:dio/dio.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:student_financial_tracker_app/src/features/categories/categories_repository.dart';

const _baseUrl = String.fromEnvironment(
  'API_BASE_URL',
  defaultValue: 'http://localhost:3000',
);

void main() {
  test('lists the three supported expense categories from the backend', () async {
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
        'name': 'Categories Tester',
        'email': 'categories-$unique@example.com',
        'password': 'password123',
      },
    );
    final tokens = authResponse.data!['tokens'] as Map<String, dynamic>;
    dio.options.headers['Authorization'] = 'Bearer ${tokens['accessToken']}';

    final repository = CategoriesRepository(dio);
    final categories = await repository.findAll('EXPENSE');
    final names = categories.map((item) => item['name']).toSet();

    expect(names, {
      'Kebutuhan Harian',
      'Kebutuhan Bulanan',
      'Belanja',
    });
  });
}
