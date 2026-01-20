import 'package:axon_form_flutter/src/core/axon_form_provider.dart';
import 'package:axon_form_flutter/src/core/components/builders/page_builder.dart';
import 'package:axon_form_flutter/src/core/models/page.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

class FormBuilder extends StatefulWidget {
  const FormBuilder({required this.pages, required this.onSubmit, super.key});

  final List<AxonFormPage> pages;
  final void Function(Map<String, dynamic> result) onSubmit;

  @override
  State<FormBuilder> createState() => _FormBuilderState();
}

class _FormBuilderState extends State<FormBuilder> {
  final form = GlobalKey<FormState>();

  @override
  Widget build(BuildContext context) {
    var controller = context.read<AxonFormProvider>();

    void onSubmit() {
      if (!form.currentState!.validate()) {
        return;
      }

      var result = controller.submitForm();
      print("result: $result");
      widget.onSubmit(result);
      // print("form result ${result}");
    }

    return Form(
      key: form,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          ...widget.pages.map((page) {
            return PageBuilder(page: page);
          }),
          TextButton(onPressed: onSubmit, child: Text("Submit")),
        ],
      ),
    );
  }
}
