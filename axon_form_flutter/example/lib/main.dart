import 'dart:typed_data';

import 'package:axon_form_flutter/axon_form_flutter.dart';
import 'package:axon_form_flutter_example/widgets/custom_bottom_sheet_dropdown.dart';
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
        title: const Text("Axon Form Example"),
      ),
      body: SingleChildScrollView(
        child: Column(
          children: [
            fileByte != null ? Image.memory(fileByte!) : Container(),
            AxonForm(
              filePath: 'assets/example.json',
              onSubmit: (result) {
                print("FORM RESULT OUTSIDE: $result");
              },
              pageBuilder: (context, page, nodes) {
                if (page.id == "p1_account") {
                  return Container(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text("page title ${page.title}"),
                        Text("page desc ${page.description}"),
                        ...nodes.map((n) {
                          return AxonFormFieldBuilder(node: n);
                        }),
                      ],
                    ),
                  );
                }

                return null;
              },
              fieldBuilder: (context, node) {
                if ([
                  "pob_prov",
                  "pob_dist",
                  "pob_comm",
                  "pob_vill",
                ].contains(node.id)) {
                  // return CustomAddressDropdown(node: node);
                  return CustomAddressBottomSheetDropdown(node: node);
                }

                return null;
              },
            ),
          ],
        ),
      ),
    );
  }
}
