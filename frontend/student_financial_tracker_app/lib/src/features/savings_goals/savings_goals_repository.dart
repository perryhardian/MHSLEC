import 'package:dio/dio.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../core/api/api_client.dart';
import '../../core/session/session_controller.dart';

final savingsGoalsRepositoryProvider = Provider<SavingsGoalsRepository>((ref) {
  return SavingsGoalsRepository(ref.watch(dioProvider));
});

final savingsGoalsProvider = FutureProvider<List<Map<String, dynamic>>>((ref) {
  ref.watch(sessionControllerProvider);
  return ref.watch(savingsGoalsRepositoryProvider).findAll();
});

class SavingsGoalsRepository {
  SavingsGoalsRepository(this._dio);

  final Dio _dio;

  Future<List<Map<String, dynamic>>> findAll() async {
    try {
      final response = await _dio.get('/savings-goals');
      return (response.data as List<dynamic>)
          .map((item) => item as Map<String, dynamic>)
          .toList();
    } catch (error) {
      throw mapDioError(error);
    }
  }

  Future<Map<String, dynamic>> create({
    required String name,
    required num targetAmount,
    DateTime? targetDate,
  }) async {
    try {
      final data = <String, dynamic>{
        'name': name,
        'targetAmount': targetAmount,
      };

      if (targetDate != null) {
        data['targetDate'] = targetDate.toIso8601String();
      }

      final response = await _dio.post('/savings-goals', data: data);
      return response.data as Map<String, dynamic>;
    } catch (error) {
      throw mapDioError(error);
    }
  }

  Future<void> update({
    required String id,
    required String name,
    required num targetAmount,
    DateTime? targetDate,
    String? status,
  }) async {
    try {
      final data = <String, dynamic>{
        'name': name,
        'targetAmount': targetAmount,
      };

      if (targetDate != null) {
        data['targetDate'] = targetDate.toIso8601String();
      }
      if (status != null) {
        data['status'] = status;
      }

      await _dio.patch('/savings-goals/$id', data: data);
    } catch (error) {
      throw mapDioError(error);
    }
  }

  Future<void> delete(String id) async {
    try {
      await _dio.delete('/savings-goals/$id');
    } catch (error) {
      throw mapDioError(error);
    }
  }

  Future<void> addContribution({
    required String goalId,
    required num amount,
    String? note,
    required DateTime contributedAt,
  }) async {
    try {
      final data = <String, dynamic>{
        'amount': amount,
        'contributedAt': contributedAt.toIso8601String(),
      };

      if (note != null && note.trim().isNotEmpty) {
        data['note'] = note.trim();
      }

      await _dio.post('/savings-goals/$goalId/contributions', data: data);
    } catch (error) {
      throw mapDioError(error);
    }
  }

  Future<Map<String, dynamic>?> getAutoContribution(String goalId) async {
    try {
      final response = await _dio.get(
        '/savings-goals/$goalId/auto-contribution',
      );
      return response.data as Map<String, dynamic>?;
    } catch (error) {
      throw mapDioError(error);
    }
  }

  Future<void> updateAutoContribution({
    required String goalId,
    required num amount,
    required DateTime startDate,
    required bool isActive,
  }) async {
    try {
      final data = <String, dynamic>{
        'amount': amount,
        'startDate': startDate.toIso8601String(),
        'isActive': isActive,
      };

      await _dio.patch('/savings-goals/$goalId/auto-contribution', data: data);
    } catch (error) {
      throw mapDioError(error);
    }
  }
}
