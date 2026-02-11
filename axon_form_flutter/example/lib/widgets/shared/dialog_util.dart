
import 'package:axon_form_flutter/axon_form_flutter.dart';
import 'package:axon_form_flutter_example/widgets/shared/constant.dart';
import 'package:flutter/material.dart';
import 'package:modal_bottom_sheet/modal_bottom_sheet.dart' show showMaterialModalBottomSheet;

class DialogUtil {
  static Future<T?> showBottomSheet<T>({
    required BuildContext context,
    required Widget child,
    bool expand = true,
    bool isDismissible = true,
    bool enableDrag = true,
    backgroundColor = Colors.transparent,
  }) async {
    return await showMaterialModalBottomSheet(
        context: context,
        backgroundColor: backgroundColor,
        bounce: true,
        barrierColor: Colors.black.withOpacity(0.5),
        useRootNavigator: true,
        expand: expand,
        isDismissible: isDismissible,
        enableDrag: enableDrag,
        builder: (BuildContext context) {
          return SafeArea(
            bottom: false,
            child: Column(
   
              mainAxisSize: MainAxisSize.min,
              children: [
                Center(
                  child: Container(
                    clipBehavior: Clip.hardEdge,
                    width: 48,
                    height: 6,
                    margin: Constants.containerPadding.copyWith(bottom: 8),
                    decoration: BoxDecoration(
                      color: context.colorScheme.surfaceContainer,
                      borderRadius: BorderRadius.circular(6),
                    ),
                  ),
                ),
                if (expand) Expanded(child: child),
                if (!expand) child,
              ],
            ),
          );
        });
  }
}