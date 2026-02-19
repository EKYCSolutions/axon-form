import 'dart:convert';
import 'dart:typed_data';

import 'package:axon_form_flutter/axon_form_flutter.dart';
import 'package:axon_form_flutter_example/app_theme.dart';
import 'package:axon_form_flutter_example/model/document_requirement.dart';
import 'package:axon_form_flutter_example/widgets/custom_date_time_picker.dart';
import 'package:axon_form_flutter_example/widgets/custom_dropdown.dart';
import 'package:axon_form_flutter_example/provider/passport_application_form_provider.dart';
import 'package:axon_form_flutter_example/widgets/shared/base_card.dart';
import 'package:axon_form_flutter_example/widgets/custom_bottom_sheet_dropdown.dart';
import 'package:axon_form_flutter_example/widgets/custom_radio_group.dart';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:provider/provider.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [
        ChangeNotifierProvider(
          create: (_) => PassportApplicationFormProvider(),
        ),
      ],
      child: MaterialApp(
        title: 'Flutter Demo',
        home: const MyHomePage(),
        theme: ThemeData(
          //  scaffoldBackgroundColor: colorScheme.surface,
          scaffoldBackgroundColor: Colors.lightBlue.shade50,
          textTheme: GoogleFonts.notoSansKhmerTextTheme(
            Theme.of(context).textTheme,
          ),
          extensions: [
            AxonFormTextInputStyle(
              decoration: InputDecoration(
                prefixIcon: Icon(Icons.note_alt_outlined),
                suffix: Icon(Icons.check_circle_outline),
              ),
            ),
            AxonFormNumberInputStyle(
              decoration: InputDecoration(prefixIcon: Icon(Icons.numbers)),
            ),
            AxonFormPasswordInputStyle(),
            AxonFormFileInputStyle(),
            AxonFormRadioInputStyle(),
            AxonFormCheckboxInputStyle(),
            AxonFormDateInputStyle(),
            AxonFormMultiSelectInputStyle(),
            AxonFormDropdownInputStyle(isExpanded: true),
          ],
        ),
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

  Map<String, dynamic> formJson = {};
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _loadJson();
  }

  Future<void> _loadJson() async {
    final String jsonString = await DefaultAssetBundle.of(
      context,
      // ).loadString('assets/form.json');
    // ).loadString('assets/gdi-online-sample-latest.json');
    ).loadString('assets/gdi-online-sample-latest-latest.json');
    // ).loadString('assets/gdi-online-sample-new.json');

    setState(() {
      formJson = jsonDecode(jsonString);
      _isLoading = false;
    });
  }

  // @override
  // Widget build(BuildContext context) {
  //   return Scaffold(
  //     appBar: AppBar(
  //       backgroundColor: Theme.of(context).colorScheme.inversePrimary,
  //       title: const Text("Axon Form Example"),
  //     ),
  //     body: _isLoading
  //         ? CircularProgressIndicator()
  //         : AxonForm.json(
  //             formJson,
  //             onSubmit: (result) {
  //               String fullResult = JsonEncoder.withIndent(
  //                 '  ',
  //               ).convert(result);
  //               print("FORM RESULT OUTSIDE: $fullResult");
  //             },
  //           ),
  //   );
  // }
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: Theme.of(context).colorScheme.inversePrimary,
        title: const Text("Axon Form Example"),
      ),
      // body: AxonForm.file(
      //   'assets/gdi-online-sample.json',
      body: _isLoading
          ? CircularProgressIndicator()
          : AxonForm.json(
              formJson,
              onSubmit: (result) {
                String fullResult = JsonEncoder.withIndent(
                  '  ',
                ).convert(result);
                print("FORM RESULT OUTSIDE: $fullResult");
              },
              pageBuilder: (context, page, nodes) {
                if (page.id == "p1_account") {
                  return SingleChildScrollView(
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
                if (page.id == "dkttxeyxfa2fl7g") {
                  final passportApplicationFormProvider = Provider.of<
                      PassportApplicationFormProvider>(context, listen: true);
                      print("passportApplicationFormProvider ::: ${passportApplicationFormProvider.documentRequirement}");
                  return SingleChildScrollView(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text("page title ${page.title}"),
                        Text("page desc ${page.description}"),
                        ...nodes.map((n) {
                          return AxonFormFieldBuilder(node: n);
                        }),
                        ...passportApplicationFormProvider.documentRequirement?.personal ?.documentGroups.map((entry) {
                          return ListTile(
                            title: Text("${entry.document.nameEng} - ${entry.group}"),
                          );
                        }).toList() ?? [],
                      ],
                    ),
                  );
                }
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
                  return Padding(
                    padding: const EdgeInsets.only(
                      top: 8.0,
                      left: 8.0,
                      right: 8.0,
                    ),
                    child: AxonTextInput(
                      node: node,
                      builder:
                          (context, field, controller, onChanged, errorText) {
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
                                  Text(
                                    field.label,
                                    style: TextStyle(fontSize: 12.0),
                                  ),
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
                                    Text(
                                      errorText,
                                      style: TextStyle(color: Colors.red),
                                    ),
                                ],
                              ),
                            );
                          },
                    ),
                  );
                }

                if (node.fieldType == FieldType.date) {
                  return Padding(
                    padding: const EdgeInsets.only(
                      top: 8.0,
                      left: 8.0,
                      right: 8.0,
                    ),
                    child: AxonDateInput(
                      node: node,
                      builder:
                          (
                            context,
                            field,
                            selectedValue,
                            onChanged,
                            errorText,
                          ) {
                            return CustomDateTimePicker(
                              label: field.label,
                              name: field.label,
                              field: field,
                              selectedValue: selectedValue,
                              onChanged: onChanged,
                              errorText: errorText,
                            );
                          },
                    ),
                  );
                }

                if (node.id == "o9eix35hpavz744") {
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
                          return CustomRadioGroup(
                            context: context,
                            field: field,
                            options: options,
                            selectedValue: selectedValue,
                            onChanged: (value) {
                              onChanged(value);
                              if (value != null) {
                                final passportApplicationFormProvider =
                                    Provider.of<
                                      PassportApplicationFormProvider
                                    >(context, listen: false);
                                passportApplicationFormProvider
                                    .setSelectedSubServiceType(value, context);
                              }
                            },

                            errorText: errorText,
                          );
                        },
                  );
                }
                if (node.fieldType == FieldType.dropdown) {
                  return AxonDropdownInput(
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
                          return FormOptionSheet(
                            context: context,
                            field: field,
                            options: options,
                            selectedValue: selectedValue,
                            onChanged: onChanged,
                            errorText: errorText,
                            name: node.label,
                            sheetLabel: 'Select',
                            label: node.label,
                          );
                        },
                  );
                }

                if (node.fieldType == FieldType.addressDropdown) {
                  return AxonAddressDropdownInput(
                    node: node,
                    builder:
                        (
                          context,
                          field,
                          options,
                          selectedValue,
                          onChanged,
                          onSearch,
                          errorText,
                        ) {
                          return FormOptionSheet(
                            context: context,
                            field: field,
                            options: options,
                            selectedValue: selectedValue,
                            onChanged: onChanged,
                            errorText: errorText,
                            name: node.label,
                            sheetLabel: 'Select',
                            label: node.label,
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
                                          borderRadius: BorderRadius.circular(
                                            20.0,
                                          ),
                                        ),
                                        child: Column(
                                          mainAxisAlignment:
                                              MainAxisAlignment.center,
                                          children: [
                                            Icon(
                                              node.value == "domestic"
                                                  ? Icons.map
                                                  : Icons.public,
                                            ),
                                            Text(
                                              node.label,
                                              style: TextStyle(),
                                            ),
                                            if (errorText != null)
                                              Text(
                                                errorText,
                                                style: TextStyle(),
                                              ),
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
