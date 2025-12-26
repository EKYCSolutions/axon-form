import 'package:flutter/material.dart';

/// Configuration class for customizing form appearance
class FormTheme {
  final InputDecorationTheme? inputDecorationTheme;
  final TextStyle? labelStyle;
  final TextStyle? errorStyle;
  final TextStyle? pageTitleStyle;
  final TextStyle? pageDescriptionStyle;
  final EdgeInsets? fieldPadding;
  final EdgeInsets? pagePadding;
  final double? fieldSpacing;
  final ButtonStyle? primaryButtonStyle;
  final ButtonStyle? secondaryButtonStyle;
  final ProgressIndicatorThemeData? progressIndicatorTheme;
  final Color? checkboxActiveColor;
  final Color? radioActiveColor;

  const FormTheme({
    this.inputDecorationTheme,
    this.labelStyle,
    this.errorStyle,
    this.pageTitleStyle,
    this.pageDescriptionStyle,
    this.fieldPadding,
    this.pagePadding,
    this.fieldSpacing,
    this.primaryButtonStyle,
    this.secondaryButtonStyle,
    this.progressIndicatorTheme,
    this.checkboxActiveColor,
    this.radioActiveColor,
  });

  /// Default theme with Material Design styling
  static FormTheme defaultTheme() {
    return FormTheme(
      inputDecorationTheme: InputDecorationTheme(
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(8),
        ),
        contentPadding: EdgeInsets.symmetric(horizontal: 16, vertical: 12),
      ),
      labelStyle: TextStyle(fontSize: 16, fontWeight: FontWeight.w500),
      errorStyle: TextStyle(fontSize: 12, color: Colors.red),
      pageTitleStyle: TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
      pageDescriptionStyle: TextStyle(fontSize: 14, color: Colors.grey),
      fieldPadding: EdgeInsets.symmetric(vertical: 8.0),
      pagePadding: EdgeInsets.all(16),
      fieldSpacing: 24,
      primaryButtonStyle: ElevatedButton.styleFrom(
        padding: EdgeInsets.symmetric(horizontal: 24, vertical: 12),
      ),
      secondaryButtonStyle: OutlinedButton.styleFrom(
        padding: EdgeInsets.symmetric(horizontal: 24, vertical: 12),
      ),
    );
  }

  /// Copy with method for easy theme customization
  FormTheme copyWith({
    InputDecorationTheme? inputDecorationTheme,
    TextStyle? labelStyle,
    TextStyle? errorStyle,
    TextStyle? pageTitleStyle,
    TextStyle? pageDescriptionStyle,
    EdgeInsets? fieldPadding,
    EdgeInsets? pagePadding,
    double? fieldSpacing,
    ButtonStyle? primaryButtonStyle,
    ButtonStyle? secondaryButtonStyle,
    ProgressIndicatorThemeData? progressIndicatorTheme,
    Color? checkboxActiveColor,
    Color? radioActiveColor,
  }) {
    return FormTheme(
      inputDecorationTheme: inputDecorationTheme ?? this.inputDecorationTheme,
      labelStyle: labelStyle ?? this.labelStyle,
      errorStyle: errorStyle ?? this.errorStyle,
      pageTitleStyle: pageTitleStyle ?? this.pageTitleStyle,
      pageDescriptionStyle: pageDescriptionStyle ?? this.pageDescriptionStyle,
      fieldPadding: fieldPadding ?? this.fieldPadding,
      pagePadding: pagePadding ?? this.pagePadding,
      fieldSpacing: fieldSpacing ?? this.fieldSpacing,
      primaryButtonStyle: primaryButtonStyle ?? this.primaryButtonStyle,
      secondaryButtonStyle: secondaryButtonStyle ?? this.secondaryButtonStyle,
      progressIndicatorTheme: progressIndicatorTheme ?? this.progressIndicatorTheme,
      checkboxActiveColor: checkboxActiveColor ?? this.checkboxActiveColor,
      radioActiveColor: radioActiveColor ?? this.radioActiveColor,
    );
  }
}
