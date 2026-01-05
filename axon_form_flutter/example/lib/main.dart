import 'dart:convert';

import 'package:axon_form_flutter/axon_form_flutter.dart';
import 'package:axon_form_flutter_example/app_theme.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  // This widget is the root of your application.
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Flutter Demo',
      theme: themeData,
      home: const MyHomePage(),
    );
  }
}

class MyHomePage extends StatefulWidget {
  const MyHomePage({super.key});

  @override
  State<MyHomePage> createState() => _MyHomePageState();
}

class _MyHomePageState extends State<MyHomePage> {
  Map<String, dynamic> rawFormJson = {};
  Map<String, dynamic> formData = {};
  //
  bool _isLoading = true;

  AxonFormCore _core = AxonFormCore();

  Future<void> readJson() async {
    final String response = await rootBundle.loadString(
      'assets/example-graph-simple.json',
    );
    final Map<String, dynamic> data = json.decode(response);
    setState(() {
      rawFormJson = data;
      _isLoading = false;
    });
  }

  @override
  void initState() {
    super.initState();
    readJson();

    WidgetsBinding.instance.addPostFrameCallback((_) async {
      await _initializeAxonForm();
    });
  }

  Future<void> _initializeAxonForm() async {
    await _core.initialize('assets/example-graph-simple.json');
    await _core.initializeAddress('assets/sample-address.json');
    var provinces = _core.getOptionNodes("kXhgdF5qwqEjdG5B1Alrd");
    print("provinces: $provinces");
  }

  void _handleFormSubmit(Map<String, dynamic> data) {
    setState(() {
      formData = data;
    });
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text("Form submitted successfully!"),
        backgroundColor: Colors.green,
      ),
    );

    // Print the data for debugging
    print("Form Data: $formData");
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: Theme.of(context).colorScheme.inversePrimary,
        title: const Text("Axon Form Demo"),
      ),
      body: _isLoading || rawFormJson.isEmpty
          ? Column(children: [Center(child: Text("Loading"))])
          : DynamicForm(
              config: FormConfig.fromJson(rawFormJson),
              theme: FormTheme(
                inputDecorationTheme: InputDecorationTheme(
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                  fillColor: Colors.grey[50],
                  filled: true,
                  contentPadding: EdgeInsets.symmetric(
                    horizontal: 16,
                    vertical: 12,
                  ),
                ),
                labelStyle: TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.w600,
                  color: Colors.indigo[900],
                ),
                primaryButtonStyle: ElevatedButton.styleFrom(
                  backgroundColor: Colors.indigo,
                  foregroundColor: Colors.white,
                  padding: EdgeInsets.symmetric(horizontal: 32, vertical: 16),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(8),
                  ),
                ),
                checkboxActiveColor: Colors.indigo,
                radioActiveColor: Colors.indigo,
              ),
              builders: FormBuilders(
                // Custom field wrapper - adds card around each field
                fieldWrapperBuilder: (context, field) => Card(
                  elevation: 2,
                  margin: const EdgeInsets.symmetric(vertical: 8.0),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Padding(
                    padding: const EdgeInsets.all(12.0),
                    child: field,
                  ),
                ),

                // Custom field builders
                fieldBuilders: {
                  // Custom text field with icon and character counter
                  FieldType.text: (context, node, formState, theme) {
                    final currentValue =
                        formState.getValue(node.fieldName)?.toString() ?? '';
                    return Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        TextFormField(
                          initialValue: currentValue,
                          decoration: InputDecoration(
                            labelText: node.label,
                            hintText:
                                node.placeholder ??
                                'Enter ${node.label.toLowerCase()}',
                            prefixIcon: Icon(
                              Icons.person_outline,
                              color: Colors.indigo,
                            ),
                            border: OutlineInputBorder(
                              borderRadius: BorderRadius.circular(12),
                            ),
                            enabledBorder: OutlineInputBorder(
                              borderRadius: BorderRadius.circular(12),
                              borderSide: BorderSide(color: Colors.grey[300]!),
                            ),
                            focusedBorder: OutlineInputBorder(
                              borderRadius: BorderRadius.circular(12),
                              borderSide: BorderSide(
                                color: Colors.indigo,
                                width: 2,
                              ),
                            ),
                            filled: true,
                            fillColor: Colors.white,
                            counterText: '${currentValue.length} characters',
                          ),
                          onChanged: (value) {
                            formState.setValue(node.fieldName, value);
                          },
                          validator: (value) {
                            // Add validation logic based on node.validationRules if needed
                            return null; // Placeholder; implement as per requirements
                          },
                        ),
                        if (formState.getError(node.fieldName) != null)
                          Padding(
                            padding: const EdgeInsets.only(
                              top: 8.0,
                              left: 12.0,
                            ),
                            child: Text(
                              formState.getError(node.fieldName)!,
                              style: TextStyle(
                                color: Colors.red[700],
                                fontSize: 12,
                              ),
                            ),
                          ),
                      ],
                    );
                  },

                  // Custom number field with increment/decrement buttons
                  FieldType.number: (context, node, formState, theme) {
                    final currentValue =
                        formState.getValue(node.fieldName) ?? 0;

                    return Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          node.label,
                          style: TextStyle(
                            fontSize: 16,
                            fontWeight: FontWeight.w600,
                            color: Colors.indigo[900],
                          ),
                        ),
                        SizedBox(height: 8),
                        Container(
                          decoration: BoxDecoration(
                            border: Border.all(color: Colors.grey[300]!),
                            borderRadius: BorderRadius.circular(12),
                          ),
                          child: Row(
                            children: [
                              IconButton(
                                icon: Icon(
                                  Icons.remove_circle_outline,
                                  color: Colors.indigo,
                                ),
                                onPressed: () {
                                  final newValue =
                                      (currentValue as int? ?? 0) - 1;
                                  if (newValue >= 0) {
                                    formState.setValue(
                                      node.fieldName,
                                      newValue,
                                    );
                                  }
                                },
                              ),
                              Expanded(
                                child: TextFormField(
                                  initialValue: currentValue.toString(),
                                  decoration: InputDecoration(
                                    border: InputBorder.none,
                                    hintText: node.placeholder ?? '0',
                                    contentPadding: EdgeInsets.symmetric(
                                      horizontal: 16,
                                    ),
                                  ),
                                  textAlign: TextAlign.center,
                                  keyboardType: TextInputType.number,
                                  inputFormatters: [
                                    FilteringTextInputFormatter.digitsOnly,
                                  ],
                                  onChanged: (value) {
                                    final numValue = int.tryParse(value);
                                    formState.setValue(
                                      node.fieldName,
                                      numValue,
                                    );
                                  },
                                ),
                              ),
                              IconButton(
                                icon: Icon(
                                  Icons.add_circle_outline,
                                  color: Colors.indigo,
                                ),
                                onPressed: () {
                                  final newValue =
                                      (currentValue as int? ?? 0) + 1;
                                  formState.setValue(node.fieldName, newValue);
                                },
                              ),
                            ],
                          ),
                        ),
                        if (formState.getError(node.fieldName) != null)
                          Padding(
                            padding: const EdgeInsets.only(
                              top: 8.0,
                              left: 12.0,
                            ),
                            child: Text(
                              formState.getError(node.fieldName)!,
                              style: TextStyle(
                                color: Colors.red[700],
                                fontSize: 12,
                              ),
                            ),
                          ),
                      ],
                    );
                  },

                  // Custom password field with strength indicator
                  FieldType.password: (context, node, formState, theme) {
                    return _CustomPasswordField(
                      node: node,
                      formState: formState,
                    );
                  },

                  // Custom checkbox with styled tile
                  FieldType.checkbox: (context, node, formState, theme) {
                    final value = formState.getValue(node.fieldName) ?? false;

                    return Container(
                      decoration: BoxDecoration(
                        color: value ? Colors.indigo[50] : Colors.white,
                        border: Border.all(
                          color: value ? Colors.indigo : Colors.grey[300]!,
                          width: 2,
                        ),
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: CheckboxListTile(
                        title: Text(
                          node.label,
                          style: TextStyle(
                            fontWeight: value
                                ? FontWeight.w600
                                : FontWeight.normal,
                          ),
                        ),
                        value: value,
                        activeColor: Colors.indigo,
                        onChanged: (newValue) {
                          formState.setValue(node.fieldName, newValue ?? false);
                        },
                        controlAffinity: ListTileControlAffinity.leading,
                      ),
                    );
                  },
                },

                // Custom navigation with icons and step counter
                navigationBuilder: (context, currentPage, totalPages, onNext, onPrevious, onSubmit) {
                  return Container(
                    padding: EdgeInsets.all(20),
                    decoration: BoxDecoration(
                      color: Colors.grey[50],
                      borderRadius: BorderRadius.vertical(
                        top: Radius.circular(20),
                      ),
                      boxShadow: [
                        BoxShadow(
                          color: Colors.black12,
                          blurRadius: 10,
                          offset: Offset(0, -2),
                        ),
                      ],
                    ),
                    child: Column(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        // Step indicator
                        Text(
                          'Step ${currentPage + 1} of $totalPages',
                          style: TextStyle(
                            fontSize: 14,
                            color: Colors.grey[600],
                            fontWeight: FontWeight.w500,
                          ),
                        ),
                        SizedBox(height: 16),
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            if (currentPage > 0)
                              OutlinedButton.icon(
                                onPressed: onPrevious,
                                icon: Icon(Icons.arrow_back),
                                label: Text('Previous'),
                                style: OutlinedButton.styleFrom(
                                  padding: EdgeInsets.symmetric(
                                    horizontal: 24,
                                    vertical: 12,
                                  ),
                                  side: BorderSide(color: Colors.indigo),
                                  foregroundColor: Colors.indigo,
                                ),
                              )
                            else
                              SizedBox(width: 100),

                            if (currentPage < totalPages - 1)
                              ElevatedButton.icon(
                                onPressed: () {
                                  print(
                                    "child node: ${_core.getChildNode("7fzhb9en55ntbeh")}",
                                  );
                                  // print(
                                  //   "isVisible: ${_core.isNodeVisible("7fzhb9en55ntbeh")}",
                                  // );
                                  // print(
                                  //   "valid: ${_core.validateField("t494fub1vww8jv2", "ss")}",
                                  // );
                                },
                                icon: Text('Next'),
                                label: Icon(Icons.arrow_forward),
                                style: ElevatedButton.styleFrom(
                                  backgroundColor: Colors.indigo,
                                  foregroundColor: const Color.fromARGB(
                                    255,
                                    81,
                                    69,
                                    69,
                                  ),
                                  padding: EdgeInsets.symmetric(
                                    horizontal: 24,
                                    vertical: 12,
                                  ),
                                ),
                              )
                            else
                              ElevatedButton.icon(
                                // onPressed: onSubmit,
                                onPressed: () {
                                  // print(
                                  //   "child: ${_core.getChildNode("kXhgdF5qwqEjdG5B1Alrd")}",
                                  // );
                                  // print(
                                  //   "province options: ${_core.getOptionNodes("kXhgdF5qwqEjdG5B1Alrd")}",
                                  // );
                                  print(
                                    "validate province: ${_core.validateAddressField("kXhgdF5qwqEjdG5B1Alrd", "kandal")}",
                                  );
                                  // print(
                                  //   "district options: ${_core.getOptionNodes("133vVgWuRSpGlx8a5YQkh")}",
                                  // );
                                  // print(
                                  //   "validate district: ${_core.validateAddressField("133vVgWuRSpGlx8a5YQkh", "phnom_penh")}",
                                  // );
                                  // print(
                                  //   "commmune options: ${_core.getOptionNodes("4sXQ1b71mN2zj32CRJWae")}",
                                  // );
                                  // print(
                                  //   "validate commmune: ${_core.validateAddressField("4sXQ1b71mN2zj32CRJWae", "preaek_ampil")}",
                                  // );
                                  // print(
                                  //   "village options: ${_core.getOptionNodes("rbBgG4U3nltmJpNmgadt4")}",
                                  // );
                                  // print(
                                  //   "validate village: ${_core.validateAddressField("rbBgG4U3nltmJpNmgadt4", "preaek_krabau_ti_bei")}",
                                  // );
                                },
                                icon: Text('Submit'),
                                label: Icon(Icons.check_circle),
                                style: ElevatedButton.styleFrom(
                                  backgroundColor: Colors.green,
                                  foregroundColor: Colors.white,
                                  padding: EdgeInsets.symmetric(
                                    horizontal: 24,
                                    vertical: 12,
                                  ),
                                ),
                              ),
                          ],
                        ),
                      ],
                    ),
                  );
                },

                // Custom progress indicator
                progressBuilder: (context, currentPage, totalPages) {
                  return Container(
                    padding: EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                    child: Row(
                      children: List.generate(totalPages, (index) {
                        final isActive = index <= currentPage;
                        final isCurrent = index == currentPage;

                        return Expanded(
                          child: Container(
                            margin: EdgeInsets.symmetric(horizontal: 2),
                            height: 6,
                            decoration: BoxDecoration(
                              color: isActive
                                  ? Colors.indigo
                                  : Colors.grey[300],
                              borderRadius: BorderRadius.circular(3),
                              boxShadow: isCurrent
                                  ? [
                                      BoxShadow(
                                        color: Colors.indigo.withOpacity(0.5),
                                        blurRadius: 4,
                                        spreadRadius: 1,
                                      ),
                                    ]
                                  : null,
                            ),
                          ),
                        );
                      }),
                    ),
                  );
                },

                // Custom page header
                pageHeaderBuilder: (context, page) {
                  return Container(
                    padding: EdgeInsets.all(20),
                    decoration: BoxDecoration(
                      gradient: LinearGradient(
                        colors: [Colors.indigo, Colors.purple],
                        begin: Alignment.topLeft,
                        end: Alignment.bottomRight,
                      ),
                      borderRadius: BorderRadius.circular(16),
                      boxShadow: [
                        BoxShadow(
                          color: Colors.indigo.withOpacity(0.3),
                          blurRadius: 10,
                          offset: Offset(0, 4),
                        ),
                      ],
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          children: [
                            Icon(
                              Icons.edit_document,
                              color: Colors.white,
                              size: 28,
                            ),
                            SizedBox(width: 12),
                            Expanded(
                              child: Text(
                                page.title,
                                style: TextStyle(
                                  fontSize: 24,
                                  fontWeight: FontWeight.bold,
                                  color: Colors.white,
                                ),
                              ),
                            ),
                          ],
                        ),
                        SizedBox(height: 8),
                        Text(
                          page.description,
                          style: TextStyle(fontSize: 16, color: Colors.white70),
                        ),
                      ],
                    ),
                  );
                },
              ),
              onSubmit: _handleFormSubmit,
            ),
    );
  }
}

// Custom password field widget with strength indicator
class _CustomPasswordField extends StatefulWidget {
  final FormNode node;
  final FormStateNotifier formState;

  const _CustomPasswordField({required this.node, required this.formState});

  @override
  State<_CustomPasswordField> createState() => _CustomPasswordFieldState();
}

class _CustomPasswordFieldState extends State<_CustomPasswordField> {
  bool _obscureText = true;
  String _password = '';

  String _getPasswordStrength() {
    if (_password.isEmpty) return '';
    if (_password.length < 6) return 'Weak';
    if (_password.length < 8) return 'Medium';
    if (_password.length >= 8 && _password.contains(RegExp(r'[0-9]'))) {
      return 'Strong';
    }
    return 'Medium';
  }

  Color _getStrengthColor() {
    final strength = _getPasswordStrength();
    switch (strength) {
      case 'Weak':
        return Colors.red;
      case 'Medium':
        return Colors.orange;
      case 'Strong':
        return Colors.green;
      default:
        return Colors.grey;
    }
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        TextFormField(
          initialValue: widget.formState.getValue(widget.node.fieldName) ?? '',
          obscureText: _obscureText,
          decoration: InputDecoration(
            labelText: widget.node.label,
            hintText: widget.node.placeholder,
            prefixIcon: Icon(Icons.lock_outline, color: Colors.indigo),
            suffixIcon: IconButton(
              icon: Icon(
                _obscureText ? Icons.visibility : Icons.visibility_off,
                color: Colors.grey,
              ),
              onPressed: () => setState(() => _obscureText = !_obscureText),
            ),
            border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
            filled: true,
            fillColor: Colors.white,
          ),
          onChanged: (value) {
            setState(() => _password = value);
            widget.formState.setValue(widget.node.fieldName, value);
          },
        ),
        if (_password.isNotEmpty) ...[
          SizedBox(height: 8),
          Row(
            children: [
              Expanded(
                child: LinearProgressIndicator(
                  value: _password.length / 12,
                  backgroundColor: Colors.grey[300],
                  valueColor: AlwaysStoppedAnimation(_getStrengthColor()),
                ),
              ),
              SizedBox(width: 8),
              Text(
                _getPasswordStrength(),
                style: TextStyle(
                  color: _getStrengthColor(),
                  fontWeight: FontWeight.w600,
                  fontSize: 12,
                ),
              ),
            ],
          ),
        ],
        if (widget.formState.getError(widget.node.fieldName) != null)
          Padding(
            padding: const EdgeInsets.only(top: 8.0, left: 12.0),
            child: Text(
              widget.formState.getError(widget.node.fieldName)!,
              style: TextStyle(color: Colors.red[700], fontSize: 12),
            ),
          ),
      ],
    );
  }
}
