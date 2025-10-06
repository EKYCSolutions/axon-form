import 'package:axon_form_flutter/axon_form_flutter.dart';
import 'package:flutter/material.dart' hide Page;

typedef FieldBuilder =
    Widget Function(
      BuildContext context,
      Node node,
      FormFieldSetter<String> onSaved,
    );

class FormBuilder extends StatefulWidget {
  final FormGraph formGraph;
  final Map<FieldType, FieldBuilder>? customFieldBuilders;
  final void Function(Map<String, dynamic>)? onChanged;

  const FormBuilder({
    super.key,
    required this.formGraph,
    this.customFieldBuilders,
    this.onChanged,
  });
  @override
  State<FormBuilder> createState() => _FormBuilderState();
}

class _FormBuilderState extends State<FormBuilder> {
  @override
  void initState() {
    _fieldBuilders = _initializeBuilders();
    super.initState();
  }

  final Map<String, dynamic> _formData = {};
  final _formKey = GlobalKey<FormState>();
  final PageController _pageController = PageController();
  int _currentPage = 0;
  late final Map<FieldType, FieldBuilder> _fieldBuilders;

  Map<FieldType, FieldBuilder> _initializeBuilders() {
    final Map<FieldType, FieldBuilder> defaultBuilders = {
      FieldType.text: (context, node, onSaved) => BaseTextInput(
        label: node.label ?? "LABEL",
        onChanged: (value) => _formData[node.fieldName!] = value,
        validator: (value) =>
            Validators.validate(value, node.validationRules ?? []),
      ),
      FieldType.dropdown: (context, node, onSaved) {
        final options = widget.formGraph.getOptionsForNode(node.id ?? "");
        return BaseDropdownRadioSelectInput(
          options: options,
          sheetLabel: "Select",
          label: node.label ?? "LABEL",
          onSelected: (value) {
            _formData[node.fieldName!] = value?.label ?? "";
          },
          validator: (value) =>
              Validators.validate(value?.id, node.validationRules ?? []),
        );
      },
      FieldType.datetime: (context, node, onSaved) => BaseDatePickerInput(
        onChanged: (value) =>
            _formData[node.fieldName ?? node.label ?? ""] = value,
        label: node.label ?? "LABEL",
        validator: (value) =>
            Validators.validate(value, node.validationRules ?? []),
      ),
      FieldType.radio: (context, node, onSaved) {
        final options = widget.formGraph.getOptionsForNode(node.id ?? "");
        return BaseFormRadioGroupInput(
          options: options,
          labelText: node.label,
          onSelected: (value) {
            _formData[node.fieldName!] = value?.label;
          },
          validator: (value) =>
              Validators.validate(value?.id, node.validationRules ?? []),
        );
      },

      FieldType.file: (context, node, onSaved) => BaseFileInput(
        onChanged: (value) => _formData[node.fieldName!] = value,
        validator: (value) =>
            Validators.validate(value.toString(), node.validationRules ?? []),
        builder: (context, field) {
          return SizedBox(
            height: 60,
            child: Row(
              children: [
                Stack(
                  children: [
                    Container(
                      width: 60,
                      height: 60,
                      decoration: BoxDecoration(
                        borderRadius: BorderRadius.circular(50),
                      ),
                      child: const Center(
                        child: Icon(Icons.file_present_rounded),
                      ),
                    ),
                    if (field.value != null)
                      const Positioned(
                        bottom: 4,
                        right: 4,
                        child: Icon(Icons.check_circle),
                      )
                    else
                      const Positioned(
                        bottom: 4,
                        right: 4,
                        child: Icon(Icons.add_circle_rounded),
                      ),
                  ],
                ),
                const SizedBox(width: 8),
                Expanded(flex: 5, child: Text(node.label ?? "LABEL")),
                const Spacer(),
                field.value == null
                    ? const Icon(Icons.arrow_drop_down_rounded)
                    : IconButton(
                        onPressed: () {
                          field.didChange(null);
                        },
                        icon: const Icon(Icons.cancel),
                      ),
              ],
            ),
          );
        },
      ),
    };

    // If the user provides custom builders, merge them, giving precedence to the custom ones.
    if (widget.customFieldBuilders != null) {
      defaultBuilders.addAll(
        widget.customFieldBuilders!,
      ); // Add custom builders
    }
    return defaultBuilders;
  }

  void _nextPage() {
    if (_formKey.currentState!.validate()) {
      if (_currentPage < widget.formGraph.layout.pages.length - 1) {
        _pageController.nextPage(
          duration: const Duration(milliseconds: 300),
          curve: Curves.easeInOut,
        );
      } else {
        _submitForm();
      }
    }
  }

  void _submitForm() {
    _formKey.currentState!.save();

    if (_formKey.currentState!.validate()) {
      if (widget.onChanged != null) {
        widget.onChanged!(_formData);
      }
    }
    ScaffoldMessenger.of(
      context,
    ).showSnackBar(SnackBar(content: Text("Form submitted: $_formData")));
  }

  @override
  Widget build(BuildContext context) {
    final pages = widget.formGraph.layout.pages;
    return Form(
      key: _formKey,
      child: Column(
        children: [
          Expanded(
            child: PageView.builder(
              controller: _pageController,
              physics: const NeverScrollableScrollPhysics(), // Disable swiping
              onPageChanged: (index) {
                setState(() => _currentPage = index);
              },
              itemCount: pages.length,
              itemBuilder: (context, pageIndex) {
                final page = pages[pageIndex];

                return SingleChildScrollView(
                  padding: const EdgeInsets.all(16.0),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        page.title,
                        style: Theme.of(context).textTheme.headlineSmall,
                      ),

                      Padding(
                        padding: const EdgeInsets.only(top: 4.0, bottom: 12.0),
                        child: Text(page.desc),
                      ),
                      ...page.fields.map((fieldId) {
                        final node = widget.formGraph.getNodeById(fieldId);
                        if (node == null) {
                          return Text('Field with ID $fieldId not found');
                        }
                        final builder = _fieldBuilders[node.fieldType];

                        if (builder != null) {
                          return Padding(
                            padding: const EdgeInsets.symmetric(vertical: 8.0),
                            child: builder(
                              context,
                              node,
                              (value) => _formData[node.fieldName!] = value,
                            ),
                          );
                        } else {
                          // Fallback for an unsupported field type
                          return Text(
                            'Unsupported field type: ${node.fieldType}',
                          );
                        }
                      }).toList(),
                    ],
                  ),
                );
              },
            ),
          ),
          const SizedBox(height: 20),
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16),
            child: Row(
              children: [
                if (_currentPage > 0)
                  ElevatedButton(
                    onPressed: () {
                      _pageController.previousPage(
                        duration: const Duration(milliseconds: 300),
                        curve: Curves.easeInOut,
                      );
                    },
                    child: const Text("Back"),
                  ),
                const Spacer(),
                ElevatedButton(
                  onPressed: _nextPage,
                  child: Text(
                    _currentPage == pages.length - 1 ? "Submit" : "Next",
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 20),
        ],
      ),
    );
  }
}
