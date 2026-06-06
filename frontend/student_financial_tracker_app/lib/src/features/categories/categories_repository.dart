import 'package:dio/dio.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../core/api/api_client.dart';
import '../../core/session/session_controller.dart';

final categoriesRepositoryProvider = Provider<CategoriesRepository>((ref) {
  return CategoriesRepository(ref.watch(dioProvider));
});

final selectedCategoryTypeProvider =
    NotifierProvider<SelectedCategoryType, String>(SelectedCategoryType.new);

final categoriesProvider = FutureProvider<List<Map<String, dynamic>>>((ref) {
  ref.watch(sessionControllerProvider);
  final type = ref.watch(selectedCategoryTypeProvider);
  return ref.watch(categoriesRepositoryProvider).findAll(type);
});

class CategoriesRepository {
  CategoriesRepository(this._dio);

  final Dio _dio;

  Future<List<Map<String, dynamic>>> findAll(String type) async {
    try {
      final response = await _dio.get(
        '/categories',
        queryParameters: {'type': type},
      );
      return (response.data as List<dynamic>)
          .map((item) => item as Map<String, dynamic>)
          .toList();
    } catch (error) {
      throw mapDioError(error);
    }
  }

  Future<void> create({
    required String name,
    required String type,
    String? color,
    String? icon,
  }) async {
    try {
      final data = <String, dynamic>{'name': name, 'type': type};

      if (color != null) {
        data['color'] = color;
      }
      if (icon != null) {
        data['icon'] = icon;
      }

      await _dio.post('/categories', data: data);
    } catch (error) {
      throw mapDioError(error);
    }
  }

  Future<void> delete(String id) async {
    try {
      await _dio.delete('/categories/$id');
    } catch (error) {
      throw mapDioError(error);
    }
  }
}

class SelectedCategoryType extends Notifier<String> {
  @override
  String build() => 'EXPENSE';

  void setType(String type) {
    state = type;
  }
}
