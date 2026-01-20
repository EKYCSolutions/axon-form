import 'package:flutter/material.dart';

class AxonFormCheckboxInputStyle
    extends ThemeExtension<AxonFormCheckboxInputStyle> {
  const AxonFormCheckboxInputStyle({this.titleStyle, this.activeColor});

  final TextStyle? titleStyle;
  final Color? activeColor;

  @override
  AxonFormCheckboxInputStyle copyWith({
    TextStyle? titleStyle,
    Color? activeColor,
  }) {
    return AxonFormCheckboxInputStyle(
      titleStyle: titleStyle ?? this.titleStyle,
      activeColor: activeColor ?? this.activeColor,
    );
  }

  @override
  ThemeExtension<AxonFormCheckboxInputStyle> lerp(
    covariant ThemeExtension<AxonFormCheckboxInputStyle>? other,
    double t,
  ) {
    if (other is! AxonFormCheckboxInputStyle) {
      return this;
    }
    return AxonFormCheckboxInputStyle(
      titleStyle: t < 0.5 ? titleStyle : other.titleStyle,
      activeColor: t < 0.5 ? activeColor : other.activeColor,
    );
  }

  // Helper to create a fallback based on the current context
  static AxonFormCheckboxInputStyle fallback(BuildContext context) {
    return AxonFormCheckboxInputStyle();
  }
}
