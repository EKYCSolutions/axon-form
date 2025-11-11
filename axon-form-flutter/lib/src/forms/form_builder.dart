import 'dart:convert';
import 'package:axon_form_flutter/axon_form_flutter.dart';
import 'package:flutter/material.dart' hide Page;
import 'package:flutter/services.dart';
import 'package:provider/provider.dart';
import 'package:axon_form_flutter/src/forms/providers/form_provider_state.dart';

typedef FieldBuilder =
    Widget Function(
      BuildContext context,
      Node node,
      FormFieldSetter<String> onSaved,
    );

class FormBuilder extends StatefulWidget {
  final Map<FieldType, FieldBuilder>? customFieldBuilders;
  final void Function(Map<String, dynamic>)? onChanged;

  // Provide only widget slots (appearance). Actions remain internal.
  final Widget? customBack;
  final Widget? customNext;
  final String jsonPath;

  const FormBuilder({
    super.key,
    required this.jsonPath,
    this.customFieldBuilders,
    this.onChanged,
    this.customBack,
    this.customNext,
  });
  @override
  State<FormBuilder> createState() => _FormBuilderState();
}

class _FormBuilderState extends State<FormBuilder> {
  @override
  void initState() {
    super.initState();
    // create an empty provider and start loading the form graph
    _formProvider = FormProviderState();
    _formProvider!.populateFormGraph(jsonPath: widget.jsonPath).catchError((e) {
      if (mounted) {
        ScaffoldMessenger.of(
          context,
        ).showSnackBar(SnackBar(content: Text('Failed to load form: $e')));
      }
    });
    _fieldBuilders = _initializeBuilders();
  }

  // The provider instance we create after loading the graph.
  FormProviderState? _formProvider;

  // remember builders rely on BuildContext at runtime to access provider and provider.formGraph
  late final Map<FieldType, FieldBuilder> _fieldBuilders;

  Map<FieldType, FieldBuilder> _initializeBuilders() {
    final Map<FieldType, FieldBuilder> defaultBuilders = {
      FieldType.text: (context, node, onSaved) {
        final state = Provider.of<FormProviderState>(context, listen: false);
        return BaseTextInput(
          label: node.label ?? "LABEL",

          onChanged: (value) {
            if (value == null) return;
            // widget.core.validateField(node.id!, value);
            state.updateField(node.fieldName!, value);
          },
          validator: (value) {
            return Validators.validate(value, node.validationRules ?? []);
          },
        );
      },
      FieldType.dropdown: (context, node, onSaved) {
        final state = Provider.of<FormProviderState>(context, listen: false);
        final options = state.formGraph?.getOptionsForNode(node.id ?? "") ?? [];
        return BaseDropdownRadioSelectInput(
          options: options,
          sheetLabel: "Select",
          label: node.label ?? "LABEL",
          onSelected: (value) {
            // widget.core.validateField(node.id!, value!.id!);
            state.updateField(node.fieldName!, value);
          },
          initialValue: state.formData[node.fieldName!],
          validator: (value) =>
              Validators.validate(value?.id, node.validationRules ?? []),
        );
      },
      FieldType.datetime: (context, node, onSaved) {
        final state = Provider.of<FormProviderState>(context, listen: false);
        return BaseDatePickerInput(
          onChanged: (value) =>
              state.updateField(node.fieldName ?? node.label ?? "", value),
          label: node.label ?? "LABEL",
          validator: (value) =>
              Validators.validate(value, node.validationRules ?? []),
        );
      },
      FieldType.radio: (context, node, onSaved) {
        final state = Provider.of<FormProviderState>(context, listen: false);
        final options = state.formGraph?.getOptionsForNode(node.id ?? "") ?? [];
        return BaseFormRadioGroupInput(
          options: options,
          labelText: node.label,
          onSelected: (value) {
            // widget.core.validateField(node.id!, value!.id!);
            state.updateField(node.fieldName!, value);
          },
          initialValue: state.formData[node.fieldName!],
          validator: (value) =>
              Validators.validate(value?.id, node.validationRules ?? []),
        );
      },
      FieldType.file: (context, node, onSaved) {
        final state = Provider.of<FormProviderState>(context, listen: false);
        return BaseFileInput(
          onChanged: (value) => state.updateField(node.fieldName!, value),
          validator: (value) =>
              Validators.validate(value.toString(), node.validationRules ?? []),
          builder: (context, field) {
            final val = state.formData[node.fieldName!];
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
                      Positioned(
                        bottom: 4,
                        right: 4,
                        child: val != null
                            ? const Icon(Icons.check_circle)
                            : const Icon(Icons.add_circle_rounded),
                      ),
                    ],
                  ),
                  const SizedBox(width: 8),
                  Expanded(flex: 5, child: Text(node.label ?? "LABEL")),
                  const Spacer(),
                  val == null
                      ? const Icon(Icons.arrow_drop_down_rounded)
                      : IconButton(
                          onPressed: () {
                            state.updateField(node.fieldName!, null);
                            field.didChange(null);
                          },
                          icon: const Icon(Icons.cancel),
                        ),
                ],
              ),
            );
          },
        );
      },
    };

    if (widget.customFieldBuilders != null) {
      defaultBuilders.addAll(widget.customFieldBuilders!);
    }
    return defaultBuilders;
  }

  @override
  void dispose() {
    // Dispose provider if we created it
    _formProvider?.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    // _form_provider is non-null after initState
    final provider = _formProvider!;
    return ChangeNotifierProvider<FormProviderState>.value(
      value: provider,
      child: Consumer<FormProviderState>(
        builder: (context, state, _) {
          if (state.isLoading) {
            return const Center(child: CircularProgressIndicator());
          }

          final pages = state.formGraph!.layout.pages;
          return Column(
            children: [
              Expanded(
                child: PageView.builder(
                  controller: state.pageController,
                  physics: const NeverScrollableScrollPhysics(),
                  onPageChanged: (index) {
                    state.onPageChanged(index);
                  },
                  itemCount: pages.length,
                  itemBuilder: (context, pageIndex) {
                    final page = pages[pageIndex];
                    return SingleChildScrollView(
                      padding: const EdgeInsets.all(16.0),
                      child: Form(
                        key: state.formKeys[pageIndex],
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              page.title,
                              style: Theme.of(context).textTheme.headlineSmall,
                            ),
                            Padding(
                              padding: const EdgeInsets.only(
                                top: 4.0,
                                bottom: 12.0,
                              ),
                              child: Text(page.desc),
                            ),
                            ...page.fields.map((fieldId) {
                              final node = state.formGraph!.getNodeById(
                                fieldId,
                              );
                              if (node == null) {
                                return Text('Field with ID $fieldId not found');
                              }
                              final builder = _fieldBuilders[node.fieldType];
                              if (builder != null) {
                                return Padding(
                                  padding: const EdgeInsets.symmetric(
                                    vertical: 8.0,
                                  ),
                                  child: builder(context, node, (value) {
                                    state.updateField(node.fieldName!, value);
                                  }),
                                );
                              }
                              return Text(
                                'No builder found for field type ${node.fieldType}',
                              );
                            }).toList(),
                          ],
                        ),
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
                    if (state.currentPage > 0)
                      widget.customBack != null
                          ? InkWell(
                              onTap: () => state.previousPage(),
                              child: widget.customBack,
                            )
                          : ElevatedButton(
                              onPressed: () => state.previousPage(),
                              child: const Text('Back'),
                            ),
                    const Spacer(),
                    widget.customNext != null
                        ? InkWell(
                            onTap: () async {
                              final submitted = await state.advanceOrSubmit(
                                onSubmitted: widget.onChanged,
                              );
                              if (submitted) {
                                // var result = widget.core.getPageFormValue("l31b5tuusxexxej");
                                // print("form result >> $result");
                                ScaffoldMessenger.of(context).showSnackBar(
                                  SnackBar(
                                    content: Text(
                                      'Form submitted: ${state.formData}',
                                    ),
                                  ),
                                );
                              }
                            },
                            child: widget.customNext,
                          )
                        : ElevatedButton(
                            onPressed: () async {
                              final submitted = await state.advanceOrSubmit(
                                onSubmitted: widget.onChanged,
                              );
                              if (submitted) {
                                // var result = widget.core.getPageFormValue("l31b5tuusxexxej");
                                // print("form result >> $result");
                                ScaffoldMessenger.of(context).showSnackBar(
                                  SnackBar(
                                    content: Text(
                                      'Form submitted: ${state.formData}',
                                    ),
                                  ),
                                );
                              }
                            },
                            child: Text(state.isLastPage ? 'Submit' : 'Next'),
                          ),
                  ],
                ),
              ),
              const SizedBox(height: 20),
            ],
          );
        },
      ),
    );
  }
}
