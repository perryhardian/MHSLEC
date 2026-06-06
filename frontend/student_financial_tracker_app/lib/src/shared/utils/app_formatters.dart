import 'package:intl/intl.dart';

class AppFormatters {
  const AppFormatters._();

  static final _currencyFormatter = NumberFormat.currency(
    locale: 'id_ID',
    symbol: 'Rp',
    decimalDigits: 0,
  );

  static String currency(Object? value, {String fallback = 'Rp0'}) {
    final number = numberValue(value);
    return number == null ? fallback : _currencyFormatter.format(number);
  }

  static num? numberValue(Object? value) {
    if (value == null) {
      return null;
    }
    if (value is num) {
      return value;
    }
    return num.tryParse('$value');
  }

  static num numberOrZero(Object? value) => numberValue(value) ?? 0;

  static String compactNumber(Object? value) {
    final number = numberOrZero(value);
    return NumberFormat.compactCurrency(
      locale: 'id_ID',
      symbol: 'Rp',
      decimalDigits: 0,
    ).format(number);
  }

  static String month(DateTime value) =>
      DateFormat.yMMMM('id_ID').format(value);

  static String shortDate(DateTime value) {
    return DateFormat.MMMd('id_ID').format(value);
  }

  static String fullDate(DateTime value) {
    return DateFormat.yMMMMEEEEd('id_ID').format(value);
  }

  static String dateTime(Object? value) {
    final date = DateTime.tryParse('$value');
    if (date == null) {
      return '';
    }
    return DateFormat.yMMMd('id_ID').add_Hm().format(date.toLocal());
  }
}
