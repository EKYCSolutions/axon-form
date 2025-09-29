



import 'package:flutter/material.dart';


final colorScheme = ColorScheme(
    brightness: Brightness.light,
    primary: Color(0xFF0E2180),
    surfaceContainer: Color(0xFFFFFFFF),
    onPrimary: Color(0xFFFFFFFF),
    secondary: Color(0xFF4D8CE4),
    onSecondary: Color(0xFFFFFFFF),
    error: Color(0xFFCB444A),
    onError: Color(0xFFFFFFFF),
    surface: Color(0xFFF6F7F8),
    surfaceDim: Color(0xFFE1E3E6),
    onSurface: Color(0xFF000000),
    onSurfaceVariant: Color(0xFF919599),
    tertiary: Color(0xFF53A451),
    tertiaryContainer: Color(0xFFDDEDDC),
    onTertiary: Color(0xFF53A451),
  );




   
  final inputDecorationTheme = InputDecorationTheme(
    errorStyle: const TextStyle(fontSize: 12, fontWeight: FontWeight.w600),
    hintStyle: TextStyle(
      color: colorScheme.onSurface.withOpacity(.2),
    ),
    isDense: true,
    border: InputBorder.none,
    errorMaxLines: 1,
  );

  final appBarTheme = AppBarTheme(
    backgroundColor: colorScheme.surface.withOpacity(0.2),
    foregroundColor: colorScheme.onSurface,
    shadowColor: colorScheme.surface,
    surfaceTintColor: Colors.transparent,
  );

  final  textTheme = TextTheme(
    headlineLarge: TextStyle(
        fontSize: 32, height: 40 / 32, fontWeight: FontWeight.bold), // H1
    headlineMedium: TextStyle(
      fontSize: 24,
      height: 32 / 24,
      fontWeight: FontWeight.bold,
    ), // H2
    headlineSmall: TextStyle(
        fontSize: 16, height: 16 / 16, fontWeight: FontWeight.bold), // H3
    bodyLarge: TextStyle(fontSize: 24), //B1
    bodyMedium: TextStyle(fontSize: 18), //B2
    bodySmall: TextStyle(fontSize: 16), // B3
    labelMedium:
        TextStyle(fontSize: 14, height: 20 / 14, letterSpacing: 0), // B4
    labelSmall: TextStyle(
      fontSize: 12,
      height: 18 / 12,
      letterSpacing: 0,
    ), // Caption
    displayLarge: TextStyle(
      fontSize: 72,
      fontWeight: FontWeight.bold,
    ),
  );


  final buttonTheme = ButtonThemeData(
    buttonColor: colorScheme.primary,
    splashColor: colorScheme.primaryFixedDim,
    shape: RoundedRectangleBorder(
      borderRadius: BorderRadius.circular(25),
    ),
  );
  final elevatedButtonTheme = ElevatedButtonThemeData(
    style: ButtonStyle(
      backgroundColor: WidgetStateProperty.resolveWith((states) {
        if (states.contains(WidgetState.disabled)) {
          return colorScheme.onSurfaceVariant.withOpacity(0.6);
        }
        return colorScheme.primary;
        // return states.contains(WidgetState.)
        //           ? colorScheme.primary
        //           : null;
      }),
      foregroundColor: WidgetStatePropertyAll(colorScheme.onPrimary),
      textStyle: WidgetStatePropertyAll(
        textTheme.labelSmall?.copyWith(
          color: colorScheme.onPrimary,
        ),
      ),
      shape: WidgetStatePropertyAll(
        RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(25),
        ),
      ),
      elevation: const WidgetStatePropertyAll(0),
    ),
  );

  final themeData = ThemeData(
    useMaterial3: true,
    scaffoldBackgroundColor: colorScheme.surface,
    inputDecorationTheme: inputDecorationTheme,
    appBarTheme: appBarTheme,
    buttonTheme: buttonTheme,
    elevatedButtonTheme: elevatedButtonTheme,
    colorScheme: colorScheme,
    textTheme: textTheme,
  );

