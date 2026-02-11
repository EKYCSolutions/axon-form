import 'package:axon_form_flutter/axon_form_flutter.dart';
import 'package:axon_form_flutter_example/widgets/shared/gdi_icon.dart';
import 'package:flutter/material.dart';

class AiAutoFilledMarker extends StatelessWidget {
  const AiAutoFilledMarker({
    super.key,
    // required this.child,
  });

  // final Widget child;

  @override
  Widget build(BuildContext context) {
    return  GdiIcon(
      color: context.colorScheme.primary ,
      icon: "Sparkle_Filled",
    );
  }
}
