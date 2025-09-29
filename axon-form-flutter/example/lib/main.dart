import 'dart:convert';

import 'package:axon_form_flutter/axon_form_flutter.dart';
import 'package:example/app_theme.dart';
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
  // Use 'late final' for variables initialized once in initState.
  FormGraph? formGraph;
  AxonFormCore core = AxonFormCore();

  @override
  void initState() {
    populateFormGraph();
    core.initialize('assets/example-graph-simple.json');
    super.initState();
  }

  populateFormGraph() async {
    final String jsonString = await rootBundle.loadString(
      // 'assets/example-graph.json',
      'assets/example-graph-simple.json',
    );
    final Map<String, dynamic> jsonMap = json.decode(jsonString);

    setState(() {
      formGraph = FormGraph.fromJson(jsonMap);
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: Theme.of(context).colorScheme.inversePrimary,
        title: const Text("Axon Form Demo"),
      ),
      body: formGraph == null
          ? const Center(child: CircularProgressIndicator())
          : FormBuilder(formGraph: formGraph!),
    );
  }
}
