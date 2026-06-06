import 'package:dio/dio.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../core/api/api_client.dart';
import '../../core/session/session_controller.dart';

final budgetsRepositoryProvider = Provider<BudgetsRepository>((ref) {
  return BudgetsRepository(ref.watch(dioProvider));
});

final budgetsProvider = FutureProvider<List<Map<String, dynamic>>>((ref) {
  ref.watch(sessionControllerProvider);
  return ref.watch(budgetsRepositoryProvider).findAll();
});

class BudgetsRepository {
  BudgetsRepository(this._dio);

  final Dio _dio;

  Future<List<Map<String, dynamic>>> findAll() async {
    try {
      final response = await _dio.get('/budgets');
      return (response.data as List<dynamic>)
          .map((item) => item as Map<String, dynamic>)
          .toList();
    } catch (error) {
      throw mapDioError(error);
    }
  }

  Future<void> create({
    String? categoryId,
    required String name,
    required num limitAmount,
    required DateTime startDate,
    required DateTime endDate,
  }) async {
    try {
      await _dio.post(
        '/budgets',
        data: {
          'categoryId': categoryId,
          'name': name,
          'limitAmount': limitAmount,
          'period': 'MONTHLY',
          'startDate': startDate.toIso8601String(),
          'endDate': endDate.toIso8601String(),
        },
      );
    } catch (error) {
      throw mapDioError(error);
    }
  }

  Future<void> update({
    required String id,
    String? categoryId,
    required String name,
    required num limitAmount,
    required DateTime startDate,
    required DateTime endDate,
  }) async {
    try {
      await _dio.patch(
        '/budgets/$id',
        data: {
          'categoryId': categoryId,
          'name': name,
          'limitAmount': limitAmount,
          'period': 'MONTHLY',
          'startDate': startDate.toIso8601String(),
          'endDate': endDate.toIso8601String(),
        },
      );
    } catch (error) {
      throw mapDioError(error);
    }
  }

  Future<void> delete(String id) async {
    try {
      await _dio.delete('/budgets/$id');
    } catch (error) {
      throw mapDioError(error);
    }
  }
}
