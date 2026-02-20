import 'package:axon_form_flutter/axon_form_flutter.dart';
import 'package:axon_form_flutter_example/widgets/shared/buttons.dart';
import 'package:flutter/material.dart';



// Enum for message variants
enum FlashMessageVariant { success, danger, warning, info, infoPrimary }

extension FlashMessageVariantColor on FlashMessageVariant {
  Color get iconColor {
    switch (this) {
      case FlashMessageVariant.danger:
        return Colors.red;
      case FlashMessageVariant.warning:
        return Colors.amber;
      case FlashMessageVariant.success:
        return Colors.green;
      case FlashMessageVariant.info:
        return Colors.grey;
      case FlashMessageVariant.infoPrimary:
        return Colors.blue;
      default:
        return Colors.green;
    }
  }

  Color get backgroudColor {
    switch (this) {
      case FlashMessageVariant.danger:
        return Colors.red.withOpacity(0.1);
      case FlashMessageVariant.warning:
        return Colors.amber.withOpacity(0.1);
      case FlashMessageVariant.info:
        return Colors.grey.withOpacity(0.1);
      case FlashMessageVariant.infoPrimary:
        return Colors.blue.withOpacity(0.1);
      case FlashMessageVariant.success:
      default:
        return Colors.green.withOpacity(0.1);
    }
  }

  Color get textColor {
    switch (this) {
      case FlashMessageVariant.danger:
        return Colors.red;
      case FlashMessageVariant.warning:
        return Colors.amber[800]!;
      case FlashMessageVariant.info:
        return Colors.grey;
      case FlashMessageVariant.infoPrimary:
        return Colors.blue;
      case FlashMessageVariant.success:
      default:
        return Colors.green;
    }
  }
}

class FlashMessage extends StatelessWidget {
  final String? content;
  final Widget? icon;
  final FlashMessageVariant variant;
  final Widget? widget;
  final Function()? onPressed;
  final String? buttonLabel;
  final Widget? action;
  final EdgeInsets? padding;
  final BorderRadiusGeometry? borderRadius;

  const FlashMessage({
    super.key,
    this.content,
    this.icon,
    this.variant = FlashMessageVariant.success,
    this.widget,
    this.onPressed,
    this.buttonLabel,
    this.action,
    this.padding,
    this.borderRadius,
  }) : assert((content != null && widget == null) ||
            (content == null && widget != null));

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: padding ?? const EdgeInsets.all(8),
      decoration: BoxDecoration(
        borderRadius: borderRadius ?? BorderRadius.circular(8),
        color: variant.backgroudColor,
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        mainAxisAlignment: MainAxisAlignment.start,
        crossAxisAlignment: CrossAxisAlignment.center,
        children: [
          if (icon != null) icon!,
          widget ??
              Expanded(
                child: Padding(
                  padding: const EdgeInsets.all(4),
                  child: Text(

                    content!,
                    style: context.textTheme.bodySmall?.copyWith(
                      color: variant.textColor,
                      height: 1.8,
                    ),
                  ),
                ),
              ),
          if (onPressed != null)
            Buttons.text(
              context,
              title: buttonLabel ?? "ចូល",
              onPressed: onPressed,
              // color: variant.textColor,
            ),
          if (action != null) action!,
        ],
      ),
    );
  }
}
