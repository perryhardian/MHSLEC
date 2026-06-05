import 'package:dio/dio.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:student_financial_tracker_app/src/features/reports/reports_repository.dart';
import 'package:student_financial_tracker_app/src/features/transactions/transactions_repository.dart';

const _baseUrl = String.fromEnvironment(
  'API_BASE_URL',
  defaultValue: 'http://localhost:3000',
);

void main() {
  test('fetches monthly report from the backend', () async {
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
        'name': 'Reports Tester',
        'email': 'reports-$unique@example.com',
        'password': 'password123',
      },
    );
    final tokens = authResponse.data!['tokens'] as Map<String, dynamic>;
    dio.options.headers['Authorization'] = 'Bearer ${tokens['accessToken']}';

    final transactionsRepository = TransactionsRepository(dio);
    final categories = await transactionsRepository.findCategories('EXPENSE');
    final category = categories.firstWhere(
      (item) => item['name'] == 'Makanan',
      orElse: () => categories.first,
    );

    await transactionsRepository.create(
      categoryId: category['id'] as String,
      type: 'EXPENSE',
      amount: 12000,
      title: 'Report test expense',
      transactionAt: DateTime.utc(2026, 6, 3),
    );

    final report = await ReportsRepository(dio).getMonthlyReport(
      month: 6,
      year: 2026,
    );

    expect(report['summary'], isA<Map<String, dynamic>>());
    expect(report['expenseByCategory'], isA<List<dynamic>>());
    expect(report['budgetPerformance'], isA<List<dynamic>>());
    expect(report['transactions'], isA<List<dynamic>>());
  });
}
