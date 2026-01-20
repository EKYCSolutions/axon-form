/// Axon Form - Dynamic Form System for Flutter
///
/// A comprehensive form generation system that creates forms from JSON configuration
/// with built-in state management, validation, and extensive customization options.
///
/// ## Quick Start
///
/// ```dart
/// import 'package:axon_form/axon_form.dart';
///
/// final config = FormConfig.fromJson(jsonData);
///
/// DynamicForm(
///   config: config,
///   onSubmit: (data) => print(data),
/// );
/// ```
///
/// ## Main Exports
///
/// - [DynamicForm] - Main form widget
/// - [FormConfig] - Configuration model
/// - [FieldType] - Enum for field types
/// - [FormStateNotifier] - State management
/// - [FormTheme] - Styling configuration
/// - [FormBuilders] - Custom builders
library;

// Configuration
export 'src/config/config.dart';
//
export 'src/core/axon_form_core.dart';
// Core
export 'src/dynamic_form.dart';
// Models
export 'src/models/models.dart';
// State Management
export 'src/state/state.dart';
export 'src/widgets/default_navigation.dart';
export 'src/widgets/default_progress.dart';
// Optionally export widgets for advanced customization
export 'src/widgets/form_field_factory.dart';
