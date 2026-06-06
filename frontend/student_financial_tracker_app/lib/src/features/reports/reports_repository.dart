import 'package:dio/dio.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../core/api/api_client.dart';
import '../../core/session/session_controller.dart';

final reportsRepositoryProvider = Provider<ReportsRepository>((ref) {
  return ReportsRepository(ref.watch(dioProvider));
});

final selectedReportMonthProvider =
    NotifierProvider<SelectedReportMonth, DateTime>(SelectedReportMonth.new);

final monthlyReportProvider = FutureProvider<Map<String, dynamic>>((ref) {
  ref.watch(sessionControllerProvider);
  final month = ref.watch(selectedReportMonthProvider);
  return ref
      .watch(reportsRepositoryProvider)
      .getMonthlyReport(month: month.month, year: month.year);
});

class ReportsRepository {
  ReportsRepository(this._dio);

  final Dio _dio;

  Future<Map<String, dynamic>> getMonthlyReport({
    required int month,
    required int year,
  }) async {
    try {
      final response = await _dio.get(
        '/reports/monthly',
        queryParameters: {'month': month, 'year': year},
      );
      return response.data as Map<String, dynamic>;
    } catch (error) {
      throw mapDioError(error);
    }
  }
}

class SelectedReportMonth extends Notifier<DateTime> {
  @override
  DateTime build() {
    final now = DateTime.now();
    return DateTime(now.year, now.month);
  }

  void previousMonth() {
    state = DateTime(state.year, state.month - 1);
  }

  void nextMonth() {
    state = DateTime(state.year, state.month + 1);
  }
}
