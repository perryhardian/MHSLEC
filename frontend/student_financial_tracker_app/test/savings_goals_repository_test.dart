import 'package:dio/dio.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:student_financial_tracker_app/src/features/savings_goals/savings_goals_repository.dart';

const _baseUrl = String.fromEnvironment(
  'API_BASE_URL',
  defaultValue: 'http://localhost:3000',
);

void main() {
  test('creates savings goal and adds contribution from the backend', () async {
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
        'name': 'Savings Tester',
        'email': 'savings-$unique@example.com',
        'password': 'password123',
      },
    );
    final tokens = authResponse.data!['tokens'] as Map<String, dynamic>;
    dio.options.headers['Authorization'] = 'Bearer ${tokens['accessToken']}';

    final repository = SavingsGoalsRepository(dio);
    final createdGoal = await repository.create(
      name: 'Dana laptop test',
      targetAmount: 3000000,
    );

    await repository.addContribution(
      goalId: createdGoal['id'] as String,
      amount: 250000,
      note: 'Setoran awal test',
      contributedAt: DateTime.utc(2026, 6, 3),
    );

    final goals = await repository.findAll();
    final goal = goals.firstWhere(
      (item) => item['id'] == createdGoal['id'],
    );

    expect(goal['name'], 'Dana laptop test');
    expect(goal['currentAmount'], 250000);
    expect(goal['progressPercentage'], greaterThan(0));

    await repository.update(
      id: createdGoal['id'] as String,
      name: 'Dana laptop updated',
      targetAmount: 3500000,
      targetDate: DateTime.utc(2026, 12, 31),
      status: 'ACTIVE',
    );

    final updatedGoals = await repository.findAll();
    final updatedGoal = updatedGoals.firstWhere(
      (item) => item['id'] == createdGoal['id'],
    );

    expect(updatedGoal['name'], 'Dana laptop updated');
    expect(num.parse('${updatedGoal['targetAmount']}'), 3500000);

    await repository.delete(createdGoal['id'] as String);

    final deletedGoals = await repository.findAll();
    expect(
      deletedGoals.any((item) => item['id'] == createdGoal['id']),
      isFalse,
    );
  });
}
