import 'dart:convert';
import 'dart:typed_data';

import 'package:axon_form_flutter/axon_form_flutter.dart';
import 'package:flutter/material.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return Builder(
      builder: (context) {
        return MaterialApp(
          title: 'Axon Form Flutter Example App',
          home: const MyHomePage(),
        );
      },
    );
  }
}

class MyHomePage extends StatefulWidget {
  const MyHomePage({super.key});

  @override
  State<MyHomePage> createState() => _MyHomePageState();
}

class _MyHomePageState extends State<MyHomePage> {
  Uint8List? fileByte;
  Map<String, dynamic> formJson = {};
  final bool _isLoading = true;

  // @override
  // void initState() {
  //   super.initState();
  //   _loadJson();
  // }

  // Future<void> _loadJson() async {
  //   final String jsonString = await DefaultAssetBundle.of(
  //     context,
  //   ).loadString('assets/example.json');

  //   setState(() {
  //     formJson = jsonDecode(jsonString);
  //     _isLoading = false;
  //   });
  // }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: FutureBuilder<String>(
        future: DefaultAssetBundle.of(
          context,
        ).loadString('assets/example.json'),
        builder: (context, snapshot) {
          if (snapshot.connectionState != ConnectionState.done) {
            return const Center(child: CircularProgressIndicator());
          }
          if (snapshot.hasError || !snapshot.hasData) {
            return const Center(child: Text('Error loading form JSON'));
          }
          final formJson = jsonDecode(snapshot.data!);
          return SafeArea(
            bottom: false,
            child: AxonForm.json(
              formJson,
              onSubmit: (result) {
                String fullResult = JsonEncoder.withIndent(
                  '  ',
                ).convert(result);
                print("Form result: $fullResult");
              },
              pageBuilder: (context, page, nodes, fieldBuilder) {
                return null;
              },
              pageNavigatorBuilder:
                  (context, pages, currentPage, pageCount, nextPage, prevPage) {
                    return null;
                  },
              fieldBuilder: (context, node) {
                return null;
              },
            ),
          );
        },
      ),
    );
  }
}
