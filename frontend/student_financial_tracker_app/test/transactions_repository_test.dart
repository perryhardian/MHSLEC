import 'package:dio/dio.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:student_financial_tracker_app/src/features/transactions/transactions_repository.dart';

void main() {
  test('TransactionsRepository creates and lists transactions', () async {
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
        'flutter-transactions-${DateTime.now().millisecondsSinceEpoch}@example.com';
    final authResponse = await dio.post<Map<String, dynamic>>(
      '/auth/register',
      data: {
        'name': 'Flutter Transactions Test',
        'email': email,
        'password': 'password123',
      },
    );
    final tokens = authResponse.data!['tokens'] as Map<String, dynamic>;
    dio.options.headers['Authorization'] = 'Bearer ${tokens['accessToken']}';

    final repository = TransactionsRepository(dio);
    final categories = await repository.findCategories('EXPENSE');
    final category = categories.firstWhere(
      (item) => item['name'] == 'Makanan',
      orElse: () => categories.first,
    );

    await repository.create(
      categoryId: category['id'] as String,
      type: 'EXPENSE',
      amount: 15000,
      title: 'Flutter test transaction',
      transactionAt: DateTime.utc(2026, 6, 3),
    );

    final transactions = await repository.findAll();

    expect(transactions, isNotEmpty);
    expect(transactions.first['title'], 'Flutter test transaction');

    await repository.update(
      id: transactions.first['id'] as String,
      categoryId: category['id'] as String,
      type: 'EXPENSE',
      amount: 20000,
      title: 'Flutter updated transaction',
      transactionAt: DateTime.utc(2026, 6, 4),
    );

    final updatedTransactions = await repository.findAll();

    expect(updatedTransactions.first['title'], 'Flutter updated transaction');
    expect(num.parse('${updatedTransactions.first['amount']}'), 20000);

    await repository.delete(updatedTransactions.first['id'] as String);

    final deletedTransactions = await repository.findAll();

    expect(
      deletedTransactions.any(
        (item) => item['id'] == updatedTransactions.first['id'],
      ),
      isFalse,
    );
  });
}
