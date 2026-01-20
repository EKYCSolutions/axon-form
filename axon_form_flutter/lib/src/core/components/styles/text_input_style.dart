import 'package:flutter/material.dart';

class AxonFormTextInputStyle extends ThemeExtension<AxonFormTextInputStyle> {
  const AxonFormTextInputStyle({this.decoration});

  final InputDecoration? decoration;

  @override
  AxonFormTextInputStyle copyWith({InputDecoration? decoration}) {
    return AxonFormTextInputStyle(decoration: decoration ?? this.decoration);
  }

  @override
  ThemeExtension<AxonFormTextInputStyle> lerp(
    covariant ThemeExtension<AxonFormTextInputStyle>? other,
    double t,
  ) {
    if (other is! AxonFormTextInputStyle) {
      return this;
    }
    return AxonFormTextInputStyle(
      decoration: t < 0.5 ? decoration : other.decoration,
    );
  }

  // Helper to create a fallback based on the current context
  static AxonFormTextInputStyle fallback(BuildContext context) {
    return AxonFormTextInputStyle();
  }
}
