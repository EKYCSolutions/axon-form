import 'dart:convert';

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
              onSubmit: (result) {},
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
