import 'package:axon_form_flutter/src/core/axon_form_provider.dart';
import 'package:axon_form_flutter/src/core/components/builders/form_field_builder.dart';
import 'package:axon_form_flutter/src/core/models/page.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

class PageBuilder extends StatefulWidget {
  final AxonFormPage page;

  const PageBuilder({super.key, required this.page});

  @override
  State<PageBuilder> createState() => _PageBuilderState();
}

class _PageBuilderState extends State<PageBuilder> {
  @override
  Widget build(BuildContext context) {
    final controller = context.read<AxonFormProvider>();

    var nodes = widget.page.fieldIds
        .map((id) => controller.graph?.nodes["inputs"]?[id])
        .nonNulls
        .toList();

    nodes.sort((a, b) => a.order.compareTo(b.order));

    //
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          widget.page.title,
          style: const TextStyle(
            fontSize: 24,
            fontWeight: FontWeight.bold,
            color: Color(0xFF1A1A1A),
            letterSpacing: -0.5,
          ),
        ),
        const SizedBox(height: 8),
        Text(
          widget.page.description,
          style: TextStyle(
            fontSize: 15,
            height: 1.4, // Improves readability
            color: Colors.grey[600],
          ),
        ),
        ...nodes.map((n) {
          return AxonFormField(node: n);
        }),
        Divider(),
      ],
    );
  }
}
