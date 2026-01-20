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
      theme: ThemeData(
        extensions: [
          AxonFormTextInputStyle(
            decoration: InputDecoration(
              labelStyle: TextStyle(color: Colors.red),
            ),
          ),
          AxonFormNumberInputStyle(
            decoration: InputDecoration(
              labelStyle: TextStyle(color: Colors.teal),
            ),
          ),
          AxonFormPasswordInputStyle(
            decoration: InputDecoration(
              labelStyle: TextStyle(color: Colors.blue),
            ),
          ),
          AxonFormFileInputStyle(
            selectFileBuilder: (context, placeholder, onFileSelect) {
              return OutlinedButton.icon(
                icon: Icon(Icons.upload_file),
                label: Text("DOG $placeholder}" ?? 'Choose File'),
                onPressed: () => onFileSelect(),
                style: ButtonStyle(
                  minimumSize: WidgetStateProperty.all(
                    const Size(double.infinity, 50),
                  ),
                ),
              );
            },
            showFileBuilder: (context, selectedFile, onFileRemoved) {
              return ListTile(
                contentPadding: EdgeInsets.zero,
                leading: Icon(Icons.file_present),
                title: Text("DOG ${selectedFile!.name}"),
                trailing: IconButton(
                  icon: Icon(Icons.close),
                  onPressed: () => onFileRemoved(),
                ),
              );
            },
          ),
          AxonFormRadioInputStyle(
            activeColor: Colors.orange,
            titleStyle: TextStyle(),
          ),
          AxonFormCheckboxInputStyle(
            activeColor: Colors.green,
            titleStyle: TextStyle(color: Colors.orange),
          ),
          AxonFormDateInputStyle(
            labelStyle: TextStyle(
              fontStyle: FontStyle.italic,
              color: Colors.blue,
            ),
          ),
          AxonFormMultiSelectInputStyle(
            activeColor: Colors.cyan,
            titleStyle: TextStyle(fontWeight: FontWeight.bold),
          ),
          AxonFormDropdownInputStyle(
            itemHeight: 80.0,
            selectedItemBuilder: (context, label) {
              return SizedBox(
                width: 250.0,
                child: Row(children: [Text("selected label: $label")]),
              );
            },
            itemBuilder: (context, label, isSelected) {
              return Container(
                decoration: BoxDecoration(color: Colors.blueAccent),
                child: Row(
                  children: [
                    isSelected ? Icon(Icons.check) : Container(),
                    Text("label: $label"),
                  ],
                ),
              );
            },
          ),
        ],
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
              filePath: 'assets/example.json',
              onSubmit: (result) {
                print("FORM RESULT OUTSIDE: $result");
                // var selectedFileBytes = base64Decode(result["f_avatar"]);
                // print("selected file bytesl ${selectedFileBytes.length}");

                // setState(() {
                //   fileByte = selectedFileBytes;
                // });
              },
              // pageBuilder: (context, page) {
              //   if (page.id == "dog") {
              //     return Custompage(
              //       page: page
              //     )
              //   }

              //   children:
              //     - title
              //     - desc

              //   return null;
              // },
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
