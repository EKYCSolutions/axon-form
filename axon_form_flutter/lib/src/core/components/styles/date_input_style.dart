import 'package:flutter/material.dart';

class AxonFormDateInputStyle extends ThemeExtension<AxonFormDateInputStyle> {
  const AxonFormDateInputStyle({this.inputDecoration, this.labelStyle});

  final InputDecoration? inputDecoration;
  final TextStyle? labelStyle;

  @override
  AxonFormDateInputStyle copyWith({
    InputDecoration? inputDecoration,
    TextStyle? labelStyle,
  }) {
    return AxonFormDateInputStyle(
      inputDecoration: inputDecoration ?? this.inputDecoration,
      labelStyle: labelStyle ?? this.labelStyle,
    );
  }

  @override
  ThemeExtension<AxonFormDateInputStyle> lerp(
    covariant ThemeExtension<AxonFormDateInputStyle>? other,
    double t,
  ) {
    if (other is! AxonFormDateInputStyle) {
      return this;
    }
    return AxonFormDateInputStyle(
      inputDecoration: t < 0.5 ? inputDecoration : other.inputDecoration,
      labelStyle: t < 0.5 ? labelStyle : other.labelStyle,
    );
  }

  // Helper to create a fallback based on the current context
  static AxonFormDateInputStyle fallback(BuildContext context) {
    return AxonFormDateInputStyle(inputDecoration: InputDecoration());
  }
}
