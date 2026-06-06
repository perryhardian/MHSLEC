import 'package:flutter/material.dart';

class AppSpacing {
  const AppSpacing._();

  static const double xs = 4;
  static const double sm = 8;
  static const double md = 12;
  static const double lg = 16;
  static const double xl = 24;
  static const double xxl = 32;
}

class AppRadius {
  const AppRadius._();

  static const double xs = 4;
  static const double sm = 6;
  static const double md = 8;
}

class AppInsets {
  const AppInsets._();

  static const screen = EdgeInsets.fromLTRB(16, 16, 16, 96);
  static const card = EdgeInsets.all(16);
  static const cardLarge = EdgeInsets.all(20);
  static const input = EdgeInsets.symmetric(horizontal: 14, vertical: 14);
}
