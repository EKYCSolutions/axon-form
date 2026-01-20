import 'package:axon_form_flutter/src/core/axon_form_provider.dart';
import 'package:axon_form_flutter/src/core/models/node.dart';
import 'package:flutter/widgets.dart';
import 'package:provider/provider.dart';

abstract class AxonBaseInput extends StatefulWidget {
  final AxonFormNode node;
  const AxonBaseInput({super.key, required this.node});

  // Centralized access to the controller/provider
  AxonFormProvider getController(BuildContext context) {
    return context.read<AxonFormProvider>();
  }
}
