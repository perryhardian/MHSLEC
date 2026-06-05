import 'package:dio/dio.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:student_financial_tracker_app/src/features/budgets/budgets_repository.dart';

const _baseUrl = String.fromEnvironment(
  'API_BASE_URL',
  defaultValue: 'http://localhost:3000',
);

void main() {
  test('creates and lists budgets from the backend', () async {
    final dio = Dio(
      BaseOptions(
        baseUrl: _baseUrl,
        headers: {'Content-Type': 'application/json'},
      ),
    );
    final unique = DateTime.now().microsecondsSinceEpoch;

    final registerResponse = await dio.post<Map<String, dynamic>>(
      '/auth/register',
      data: {
      'name': 'Budget Tester',
      'email': 'budget-$unique@example.com',
        'password': 'password123',
      },
    );

    final tokens = registerResponse.data!['tokens'] as Map<String, dynamic>;
    dio.options.headers['Authorization'] =
        'Bearer ${tokens['accessToken']}';

    final categoriesResponse = await dio.get('/categories', queryParameters: {
      'type': 'EXPENSE',
    });
    final categories = categoriesResponse.data as List<dynamic>;
    final category = categories.first as Map<String, dynamic>;

    final repository = BudgetsRepository(dio);
    await repository.create(
      categoryId: category['id'] as String,
      name: 'Budget makan test',
      limitAmount: 500000,
      startDate: DateTime(2026, 6),
      endDate: DateTime(2026, 6, 30, 23, 59, 59),
    );

    final budgets = await repository.findAll();

    expect(budgets, isNotEmpty);
    expect(
      budgets.any((budget) => budget['name'] == 'Budget makan test'),
      isTrue,
    );

    final budget = budgets.firstWhere(
      (item) => item['name'] == 'Budget makan test',
    );

    await repository.update(
      id: budget['id'] as String,
      categoryId: category['id'] as String,
      name: 'Budget makan updated',
      limitAmount: 750000,
      startDate: DateTime(2026, 6),
      endDate: DateTime(2026, 6, 30, 23, 59, 59),
    );

    final updatedBudgets = await repository.findAll();
    final updatedBudget = updatedBudgets.firstWhere(
      (item) => item['id'] == budget['id'],
    );

    expect(updatedBudget['name'], 'Budget makan updated');
    expect(num.parse('${updatedBudget['limitAmount']}'), 750000);

    await repository.delete(budget['id'] as String);

    final deletedBudgets = await repository.findAll();
    expect(
      deletedBudgets.any((item) => item['id'] == budget['id']),
      isFalse,
    );
  });
}
