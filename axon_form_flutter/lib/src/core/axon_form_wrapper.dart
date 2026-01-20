import 'package:axon_form_flutter/src/core/axon_form_provider.dart';
import 'package:axon_form_flutter/src/core/components/builders/form_builder.dart';
import 'package:axon_form_flutter/src/core/models/page.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

class AxonForm extends StatefulWidget {
  const AxonForm({required this.filePath, required this.onSubmit, super.key});

  // The asset path to the form configuration file.
  final String filePath;
  final void Function(Map<String, dynamic> result) onSubmit;

  @override
  State<AxonForm> createState() => _AxonFormState();
}

class _AxonFormState extends State<AxonForm> {
  @override
  Widget build(BuildContext context) {
    return ChangeNotifierProvider(
      lazy: false,
      create: (_) => AxonFormProvider(widget.filePath),
      child: Selector<AxonFormProvider, List<dynamic>?>(
        selector: (context, provider) => provider.graph?.pages.values.toList(),
        builder: (context, pages, _) {
          if (pages == null || pages.isEmpty) {
            return const SizedBox.shrink();
          }

          return FormBuilder(
            pages: pages as List<AxonFormPage>,
            onSubmit: widget.onSubmit,
          );
        },
      ),
    );
  }
}
