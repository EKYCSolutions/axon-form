import 'package:axon_form_flutter/axon_form.dart';
import 'package:axon_form_flutter/src/core/axon_form_provider.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

class PageBuilder extends StatefulWidget {
  const PageBuilder({
    super.key,
    required this.page,
    this.pageBuilder,
    this.fieldBuilder,
  });

  final AxonFormPage page;
  final Widget? Function(
    BuildContext context,
    AxonFormPage page,
    List<AxonFormNode> nodes,
    Widget? Function(BuildContext context, AxonFormNode field)?,
  )?
  pageBuilder;
  final Widget? Function(BuildContext context, AxonFormNode field)?
  fieldBuilder;

  @override
  State<PageBuilder> createState() => _PageBuilderState();
}

class _PageBuilderState extends State<PageBuilder> {
  @override
  Widget build(BuildContext context) {
    return Selector<AxonFormProvider, List<AxonFormNode>>(
      selector: (context, provider) {
        final allNodes = widget.page.fieldIds
            .map((id) => provider.graph?.nodes["inputs"]?[id])
            .nonNulls
            .toList();
        allNodes.sort((a, b) => a.order.compareTo(b.order));
        return allNodes.where((n) => n.isVisible).toList();
      },
      shouldRebuild: (prev, next) =>
          prev.length != next.length ||
          !prev.every((n) => next.any((m) => m.id == n.id)),
      builder: (context, visibleNodes, _) {
        if (widget.pageBuilder != null) {
          final customWidget = widget.pageBuilder!(
            context,
            widget.page,
            visibleNodes,
            widget.fieldBuilder,
          );
          if (customWidget != null) return customWidget;
        }

        return SingleChildScrollView(
          child: Column(
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
                  height: 1.4,
                  color: Colors.grey[600],
                ),
              ),
              ...visibleNodes.map(
                (n) => AxonFormFieldBuilder(
                  node: n,
                  fieldBuilder: widget.fieldBuilder,
                ),
              ),
              const Divider(),
            ],
          ),
        );
      },
    );
  }
}
