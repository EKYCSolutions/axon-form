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
      body: AxonForm(
        filePath: 'assets/example.json',
        onSubmit: (result) {
          print("FORM RESULT OUTSIDE: $result");
        },
        pageBuilder: (context, page, nodes) {
          // if (page.id == "p1_account") {
          //   return SingleChildScrollView(
          //     child: Column(
          //       crossAxisAlignment: CrossAxisAlignment.start,
          //       children: [
          //         Text("page title ${page.title}"),
          //         Text("page desc ${page.description}"),

          //         ...nodes.map((n) {
          //           return AxonFormFieldBuilder(node: n);
          //         }),
          //       ],
          //     ),
          //   );
          // }
          return null;
        },
        pageNavigatorBuilder:
            (context, currentPage, pageCount, nextPage, prevPage) {
              return null;
              // return Container(
              //   child: Row(
              //     children: [
              //       TextButton(onPressed: prevPage, child: Text('prev')),
              //       Text('Page: $currentPage'),
              //       TextButton(onPressed: nextPage, child: Text('next')),
              //     ],
              //   ),
              // );
            },
        fieldBuilder: (context, node) {
          if ([
            "pob_prov",
            "pob_dist",
            "pob_comm",
            "pob_vill",
          ].contains(node.id)) {
            return CustomAddressBottomSheetDropdown(node: node);
          }

          if (node.fieldType == FieldType.text) {
            return AxonTextInput(
              node: node,
              builder: (context, field, controller, onChanged, errorText) {
                return Container(
                  padding: EdgeInsets.symmetric(
                    horizontal: 20.0,
                    vertical: 5.0,
                  ),
                  decoration: BoxDecoration(
                    color: Colors.teal.withAlpha(20),
                    borderRadius: BorderRadius.circular(16.0),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(field.label, style: TextStyle(fontSize: 12.0)),
                      TextField(
                        decoration: InputDecoration(
                          isDense: true,
                          border: InputBorder.none,
                          prefixIcon: Icon(Icons.person),
                          prefixIconConstraints: BoxConstraints(
                            minWidth: 20, // Adjust as needed
                            minHeight: 20, // Adjust as needed
                            maxWidth: 20,
                            maxHeight: 20,
                          ),
                        ),
                        controller: controller,
                        onChanged: onChanged,
                      ),
                      if (errorText != null)
                        Text(errorText, style: TextStyle(color: Colors.red)),
                    ],
                  ),
                );
              },
            );
          }

          if (node.id == "f_born_in") {
            return AxonRadioInput(
              node: node,
              builder:
                  (
                    context,
                    field,
                    options,
                    selectedValue,
                    onChanged,
                    errorText,
                  ) {
                    return Container(
                      child: Row(
                        children: [
                          ...options.asMap().entries.map((entry) {
                            final int index = entry.key;
                            final AxonFormNode node = entry.value;

                            return Expanded(
                              child: InkWell(
                                onTap: () {
                                  onChanged(node.id);
                                },
                                child: Container(
                                  height: 100.0,
                                  decoration: BoxDecoration(
                                    border: Border.all(
                                      color: Colors.black.withAlpha(20),
                                    ),
                                    color: selectedValue == node.id
                                        ? Colors.blueAccent.withAlpha(20)
                                        : Colors.transparent,
                                    borderRadius: BorderRadius.circular(20.0),
                                  ),
                                  child: Column(
                                    mainAxisAlignment: MainAxisAlignment.center,
                                    children: [
                                      Icon(
                                        node.value == "domestic"
                                            ? Icons.map
                                            : Icons.public,
                                      ),
                                      Text(node.label, style: TextStyle()),
                                      if (errorText != null)
                                        Text(errorText, style: TextStyle()),
                                    ],
                                  ),
                                ),
                              ),
                            );
                          }),
                        ],
                      ),
                    );
                  },
            );
          }

          return null;
        },
      ),
    );
  }
}
