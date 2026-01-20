import 'package:flutter/material.dart';

class AxonFormPasswordInputStyle
    extends ThemeExtension<AxonFormPasswordInputStyle> {
  const AxonFormPasswordInputStyle({this.decoration});

  final InputDecoration? decoration;

  @override
  AxonFormPasswordInputStyle copyWith({InputDecoration? decoration}) {
    return AxonFormPasswordInputStyle(
      decoration: decoration ?? this.decoration,
    );
  }

  @override
  ThemeExtension<AxonFormPasswordInputStyle> lerp(
    covariant ThemeExtension<AxonFormPasswordInputStyle>? other,
    double t,
  ) {
    if (other is! AxonFormPasswordInputStyle) {
      return this;
    }
    return AxonFormPasswordInputStyle(
      decoration: t < 0.5 ? decoration : other.decoration,
    );
  }

  // Helper to create a fallback based on the current context
  static AxonFormPasswordInputStyle fallback(BuildContext context) {
    return AxonFormPasswordInputStyle(decoration: InputDecoration());
  }
}
