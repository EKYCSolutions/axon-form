import 'package:flutter/material.dart';

class Constants {
  static EdgeInsets containerPadding = const EdgeInsets.symmetric(
    horizontal: 16,
    vertical: 8,
  );
  static EdgeInsets containerPaddingHorizontal = const EdgeInsets.symmetric(
    horizontal: 16,
    vertical: 0,
  );
  static EdgeInsets containerPaddingVertical = const EdgeInsets.symmetric(
    horizontal: 0,
    vertical: 8,
  );

  static EdgeInsets containerPaddingHalf = const EdgeInsets.symmetric(
    horizontal: 8,
    vertical: 8,
  );

  static BorderRadius containerRadius = BorderRadius.circular(16);
  static BorderRadius baseCardRadius = BorderRadius.circular(24);

  static const renewalReasonExpired = "1";
  static const renewalReasonLost = "2";
  static const renewalReasonDamaged = "3";
  static const renewalReasonCorrectData = "4";
}
