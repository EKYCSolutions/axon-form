import 'package:axon_form_flutter/src/core/axon_form_provider.dart';
import 'package:axon_form_flutter/src/core/components/builders/form_builder.dart';
import 'package:axon_form_flutter/src/core/models/node.dart';
import 'package:axon_form_flutter/src/core/models/page.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

class AxonForm extends StatefulWidget {
  const AxonForm({
    super.key,
    required this.filePath,
    required this.onSubmit,
    this.pageBuilder,
    this.pageNavigatorBuilder,
    this.fieldBuilder,
  });

  // The asset path to the form configuration file.
  final String filePath;
  final void Function(Map<String, dynamic> result) onSubmit;

  //
  final Widget? Function(
    BuildContext context,
    AxonFormPage page,
    List<AxonFormNode> nodes,
  )?
  pageBuilder;
  final Widget? Function(
    BuildContext context,
    int currentPage,
    int pageCount,
    void Function() nextPage,
    void Function() prevPage,
  )?
  pageNavigatorBuilder;
  final Widget? Function(BuildContext context, AxonFormNode field)?
  fieldBuilder;

  @override
  State<AxonForm> createState() => _AxonFormState();
}

class _AxonFormState extends State<AxonForm> {
  @override
  Widget build(BuildContext context) {
    return ChangeNotifierProvider(
      lazy: false,
      create: (_) => AxonFormProvider(widget.filePath),
      child: Selector<AxonFormProvider, String>(
        selector: (context, provider) {
          if (provider.graph?.pagesToShow == null) return "";
          // Sort keys to ensure stable comparison string
          var keys = provider.graph!.pagesToShow.map((e) => e.id).toList();
          keys.sort();
          return keys.join(',');
        },
        builder: (context, _, __) {
          var provider = context.read<AxonFormProvider>();
          if (provider.isLoading) {
            return const Center(child: CircularProgressIndicator());
          }

          var pagesList = provider.graph?.pagesToShow;
          if (pagesList == null || pagesList.isEmpty) {
            return const SizedBox.shrink();
          }

          return FormBuilder(
            pages: pagesList,
            onSubmit: widget.onSubmit,
            pageBuilder: widget.pageBuilder,
            pageNavigatorBuilder: widget.pageNavigatorBuilder,
            fieldBuilder: widget.fieldBuilder,
          );
        },
      ),
    );
  }
}
