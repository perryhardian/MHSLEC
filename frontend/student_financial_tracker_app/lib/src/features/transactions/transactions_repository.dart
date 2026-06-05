import 'package:dio/dio.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../core/api/api_client.dart';
import '../../core/session/session_controller.dart';

final transactionsRepositoryProvider = Provider<TransactionsRepository>((ref) {
  return TransactionsRepository(ref.watch(dioProvider));
});

final transactionsProvider = FutureProvider<List<Map<String, dynamic>>>((ref) {
  ref.watch(sessionControllerProvider);
  return ref.watch(transactionsRepositoryProvider).findAll();
});

final expenseCategoriesProvider = FutureProvider<List<Map<String, dynamic>>>(
  (ref) {
    ref.watch(sessionControllerProvider);
    return ref.watch(transactionsRepositoryProvider).findCategories('EXPENSE');
  },
);

final incomeCategoriesProvider = FutureProvider<List<Map<String, dynamic>>>(
  (ref) {
    ref.watch(sessionControllerProvider);
    return ref.watch(transactionsRepositoryProvider).findCategories('INCOME');
  },
);

final dailyExpenseSettingProvider =
    FutureProvider<Map<String, dynamic>?>((ref) {
  ref.watch(sessionControllerProvider);
  return ref.watch(transactionsRepositoryProvider).getDailyExpenseSetting();
});

class TransactionsRepository {
  TransactionsRepository(this._dio);

  final Dio _dio;

  Future<List<Map<String, dynamic>>> findAll() async {
    try {
      final response = await _dio.get('/transactions');
      final data = response.data as Map<String, dynamic>;
      return (data['data'] as List<dynamic>)
          .map((item) => item as Map<String, dynamic>)
          .toList();
    } catch (error) {
      throw mapDioError(error);
    }
  }

  Future<List<Map<String, dynamic>>> findCategories(String type) async {
    try {
      final response = await _dio.get('/categories', queryParameters: {
        'type': type,
      });
      return (response.data as List<dynamic>)
          .map((item) => item as Map<String, dynamic>)
          .toList();
    } catch (error) {
      throw mapDioError(error);
    }
  }

  Future<void> create({
    required String categoryId,
    required String type,
    required num amount,
    required String title,
    required DateTime transactionAt,
  }) async {
    try {
      await _dio.post('/transactions', data: {
        'categoryId': categoryId,
        'type': type,
        'amount': amount,
        'title': title,
        'transactionAt': transactionAt.toIso8601String(),
      });
    } catch (error) {
      throw mapDioError(error);
    }
  }

  Future<void> update({
    required String id,
    required String categoryId,
    required String type,
    required num amount,
    required String title,
    required DateTime transactionAt,
  }) async {
    try {
      await _dio.patch('/transactions/$id', data: {
        'categoryId': categoryId,
        'type': type,
        'amount': amount,
        'title': title,
        'transactionAt': transactionAt.toIso8601String(),
      });
    } catch (error) {
      throw mapDioError(error);
    }
  }

  Future<void> delete(String id) async {
    try {
      await _dio.delete('/transactions/$id');
    } catch (error) {
      throw mapDioError(error);
    }
  }

  Future<Map<String, dynamic>?> getDailyExpenseSetting() async {
    try {
      final response = await _dio.get('/transactions/daily-expense-setting');
      return response.data as Map<String, dynamic>?;
    } catch (error) {
      throw mapDioError(error);
    }
  }

  Future<void> updateDailyExpenseSetting({
    required String categoryId,
    required String type,
    required num amount,
    required DateTime startDate,
    required bool isActive,
  }) async {
    try {
      final data = <String, dynamic>{
        'categoryId': categoryId,
        'type': type,
        'amount': amount,
        'title': 'Kebutuhan harian',
        'startDate': startDate.toIso8601String(),
        'isActive': isActive,
      };

      await _dio.patch('/transactions/daily-expense-setting', data: data);
    } catch (error) {
      throw mapDioError(error);
    }
  }
}
