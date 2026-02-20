
import 'package:axon_form_flutter/axon_form_flutter.dart';
import 'package:axon_form_flutter_example/widgets/shared/ai_loading.dart';
import 'package:axon_form_flutter_example/widgets/shared/base_card.dart';
import 'package:axon_form_flutter_example/widgets/shared/buttons.dart';
import 'package:axon_form_flutter_example/widgets/shared/constant.dart';
import 'package:axon_form_flutter_example/widgets/shared/gdi_icon.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
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


  static showLoading<T>(
    context, [
    Future<T> Function()? callback,
  ]) async {
    showDialog(
        useRootNavigator: true,
        context: context,
        builder: (BuildContext context) {
          return const CupertinoActivityIndicator(
            color: Colors.white,
            radius: 18,
          );
        });
    if (callback == null) return;
    try {
      T res = await callback();
      Navigator.of(context, rootNavigator: true).pop();
      return res;
    } catch (e) {
      Navigator.of(context, rootNavigator: true).pop();

      rethrow;
    }
  }

  static showAiLoading<T>(
    context, [
    Future<T> Function()? callback,
  ]) async {
    showDialog(
        context: context,
        barrierDismissible: false,
        useSafeArea: false,
        builder: (BuildContext context) {
          return const AiLoading();
        });
    if (callback == null) return;
    try {
      T res = await callback();
      Navigator.of(context, rootNavigator: true).pop();
      return res;
    } catch (e) {
      Navigator.of(context, rootNavigator: true).pop();

      rethrow;
    }
  }



  static showErrorDialog(
    context, {
    String? title,
    Widget? content,
    Function()? onContinue,
  }) {
    showBottomSheet(
        context: context,
        expand: false,
        child: ErrorDialog(
          title: title,
          content: content,
          onContinue: onContinue,
        ));
  }
}

class ErrorDialog extends StatelessWidget {
  const ErrorDialog({
    super.key,
    this.title,
    this.content,
    this.onContinue,
  });
  final String? title;
  final Widget? content;
  final Function()? onContinue;

  @override
  Widget build(BuildContext context, ) {
    return Container(
      height: 400,
      padding: EdgeInsets.only(bottom: MediaQuery.of(context).padding.bottom),
      child: Material(
        color: Colors.transparent,
        elevation: 0,
        child: ClipRRect(
          borderRadius: Constants.baseCardRadius,
          child: BaseCard(
            margin: Constants.containerPadding,
            padding: Constants.containerPadding,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.center,
              mainAxisAlignment: MainAxisAlignment.start,
              children: [
                const SizedBox(height: 16),
                Text( title ?? "មាន​បញ្ហា​មួយ​បាន​កើត​ឡើង", style: context.textTheme.headlineSmall,),
                const Spacer(),
                GdiIcon(
                  icon: "Warning",
                  color: context.colorScheme.error,
                  height: 60,
                  width: 60,
                ),
                const SizedBox(height: 24),
                content ?? Text("សូមព្យាយាមម្តងទៀត។", style: context.textTheme.bodySmall,),
                const Spacer(),
                Buttons.primary(
                  context,
                  title: "Next",
                  onPressed: () {
                    if (onContinue != null) {
                      onContinue!();
                    } else {
                     context.pop();
                    }
                  },
                ),
                const SizedBox(height: 18)
              ],
            ),
          ),
        ),
      ),
    );
  }
}
