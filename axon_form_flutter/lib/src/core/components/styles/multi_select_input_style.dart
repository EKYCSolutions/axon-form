import 'package:flutter/material.dart';

class AxonFormMultiSelectInputStyle
    extends ThemeExtension<AxonFormMultiSelectInputStyle> {
  const AxonFormMultiSelectInputStyle({this.titleStyle, this.activeColor});

  final TextStyle? titleStyle;
  final Color? activeColor;

  @override
  AxonFormMultiSelectInputStyle copyWith({
    TextStyle? titleStyle,
    Color? activeColor,
  }) {
    return AxonFormMultiSelectInputStyle(
      titleStyle: titleStyle ?? this.titleStyle,
      activeColor: activeColor ?? this.activeColor,
    );
  }

  @override
  ThemeExtension<AxonFormMultiSelectInputStyle> lerp(
    covariant ThemeExtension<AxonFormMultiSelectInputStyle>? other,
    double t,
  ) {
    if (other is! AxonFormMultiSelectInputStyle) {
      return this;
    }
    return AxonFormMultiSelectInputStyle(
      titleStyle: t < 0.5 ? titleStyle : other.titleStyle,
      activeColor: t < 0.5 ? activeColor : other.activeColor,
    );
  }

  // Helper to create a fallback based on the current context
  static AxonFormMultiSelectInputStyle fallback(BuildContext context) {
    return AxonFormMultiSelectInputStyle();
  }
}
