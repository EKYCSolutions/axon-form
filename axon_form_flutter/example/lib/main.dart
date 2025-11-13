import 'package:axon_form_flutter/axon_form_flutter.dart';
import 'package:axon_form_flutter_example/app_theme.dart';
import 'package:flutter/material.dart';

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
  Map<String, dynamic> formData = {};

  @override
  void initState() {
    super.initState();
  }

  void _handleFormChange(Map<String, dynamic> data) {
    // Handle form data changes here
    formData = data;
    ScaffoldMessenger.of(
      context,
    ).showSnackBar(SnackBar(content: Text("Form submitted: $formData")));
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: Theme.of(context).colorScheme.inversePrimary,
        title: const Text("Axon Form Demo"),
      ),
      body: FormBuilder(
              jsonPath: 'assets/example.json',
              onChanged: _handleFormChange,
              customFieldBuilders: {
                //   FieldType.text: (context, node, onSaved) {
                //     return TextFormField(
                //       decoration: InputDecoration(
                //         labelText: node.label,
                //         hintText: node.subLabel,
                //       ),
                //       initialValue: formData[node.fieldName]?.toString() ?? '',
                //       onChanged: (value) {
                //         // Handle value change
                //       },
                //     );
                //   },
              },
            ),
    );
  }
}
