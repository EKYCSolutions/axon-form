import 'package:flutter/material.dart';

class AxonFormNumberInputStyle
    extends ThemeExtension<AxonFormNumberInputStyle> {
  const AxonFormNumberInputStyle({this.decoration});

  final InputDecoration? decoration;

  @override
  AxonFormNumberInputStyle copyWith({InputDecoration? decoration}) {
    return AxonFormNumberInputStyle(decoration: decoration ?? this.decoration);
  }

  @override
  ThemeExtension<AxonFormNumberInputStyle> lerp(
    covariant ThemeExtension<AxonFormNumberInputStyle>? other,
    double t,
  ) {
    if (other is! AxonFormNumberInputStyle) {
      return this;
    }
    return AxonFormNumberInputStyle(
      decoration: t < 0.5 ? decoration : other.decoration,
    );
  }

  // Helper to create a fallback based on the current context
  static AxonFormNumberInputStyle fallback(BuildContext context) {
    return AxonFormNumberInputStyle();
  }
}
