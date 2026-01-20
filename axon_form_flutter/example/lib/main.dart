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
    return MaterialApp(
      title: 'Flutter Demo',
      home: const MyHomePage(),
      theme: ThemeData(extensions: [
        
      ]
    ),
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

  @override
  void initState() {
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: Theme.of(context).colorScheme.inversePrimary,
        title: const Text("Axon Form Demo"),
      ),
      body: SingleChildScrollView(
        child: Column(
          children: [
            fileByte != null ? Image.memory(fileByte!) : Container(),
            AxonForm(
              // filePath: 'assets/example-graph-simple.json',
              filePath: 'assets/example.json',
              onSubmit: (result) {
                print("FORM RESULT OUTSIDE: $result");
                // var selectedFileBytes = base64Decode(result["f_avatar"]);
                // print("selected file bytesl ${selectedFileBytes.length}");

                // setState(() {
                //   fileByte = selectedFileBytes;
                // });
              },
              // pageBuilder: {
              //   "pageId": (context, page) {
              //     return Page2(
              //       page: page,
              //     );
              //   },
              // },
              // fieldBuilder: () {
              //   "nodeID": Container,
              // },
              // builder: (context, progress, form) {
              //   return Column(
              //     children: [
              //       form,
              //       BottomBar(),
              //     ],
              //   );
              // }
            ),
          ],
        ),
      ),
    );
  }
}

// class Page2 extends StatelessWidget {
//   const Page2({super.key, this.content});

//   @override
//   Widget build(BuildContext context) {
//     final axonFormProvider = context.watch<AxonFormProvider>();

//     return Scaffold(
//       body: Column(
//         children: [
//           fields[this.content.fieldId]
//         ],
//       ),
//     );
//   }
// }

// class AxonTextField extends StatelessWidget {
//   const AxonTextField({super.key});

//   @override
//   Widget build(BuildContext context) {
//     return const Placeholder();
//   }
// }
