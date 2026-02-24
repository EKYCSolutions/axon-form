import 'dart:convert';

import 'package:axon_form_flutter/src/core/axon_form_provider.dart';
import 'package:axon_form_flutter/src/core/components/builders/form_builder.dart';
import 'package:axon_form_flutter/src/core/models/node.dart';
import 'package:axon_form_flutter/src/core/models/page.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:provider/provider.dart';

class AxonForm extends StatefulWidget {
  final void Function(Map<String, dynamic> result) onSubmit;

  //
  final Widget? Function(
    BuildContext context,
    AxonFormPage page,
    List<AxonFormNode> nodes,
    Widget? Function(BuildContext context, AxonFormNode field)?,
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

  final Future<Uint8List> Function() _loader;

  AxonForm.file(
    String filePath, {
    super.key,
    required this.onSubmit,
    this.pageBuilder,
    this.pageNavigatorBuilder,
    this.fieldBuilder,
  }) : _loader = (() async {
         try {
           final data = await rootBundle.load(filePath);
           return data.buffer.asUint8List();
         } catch (e) {
           rethrow;
         }
       });

  AxonForm.json(
    Map<String, dynamic> json, {
    super.key,
    required this.onSubmit,
    this.pageBuilder,
    this.pageNavigatorBuilder,
    this.fieldBuilder,
  }) : _loader = (() async {
         try {
           final String jsonString = jsonEncode(json);
           var fileBytes = utf8.encoder.convert(jsonString);
           if (fileBytes.length < 5) {
             throw Exception(
               'JSON data is a not valid AxonForm configuration.',
             );
           }
           return fileBytes;
         } catch (e) {
           rethrow;
         }
       });

  @override
  State<AxonForm> createState() => _AxonFormState();
}

class _AxonFormState extends State<AxonForm> {
  @override
  Widget build(BuildContext context) {
    return ChangeNotifierProvider(
      lazy: false,
      create: (_) => AxonFormProvider(widget._loader),
      child: Selector<AxonFormProvider, String>(
        selector: (context, provider) {
          if (provider.graph?.pagesToShow == null) return "";
          var keys = provider.graph!.pagesToShow
              .map((e) => e.id)
              .toList()
              .join(',');
          return keys;
        },
        builder: (context, _, __) {
          var provider = context.read<AxonFormProvider>();
          if (provider.isLoading) {
            return const Center(child: CircularProgressIndicator());
          }

          if (provider.errorMessage != null) {
            return Center(
              child: Text(
                provider.errorMessage!,
                style: TextStyle(color: Colors.redAccent),
              ),
            );
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
