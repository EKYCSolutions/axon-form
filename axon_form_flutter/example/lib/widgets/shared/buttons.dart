import 'package:axon_form_flutter/axon_form_flutter.dart';
import 'package:flutter/material.dart';


class Buttons {
  // static Widget primary(
  //   BuildContext context, {
  //   required String title,
  //   required void Function()? onPressed,
  //   Widget? icon,
  //   bool enable = true,
  // }) {
  //   return Container(
  //     width: MediaQuery.of(context).size.width * 0.9,
  //     height: 52.0,
  //     decoration: BoxDecoration(boxShadow: [
  //       BoxShadow(
  //         color: enable
  //             ? context.colorScheme.primary.withOpacity(.4)
  //             : Colors.transparent,
  //         offset: const Offset(0, 8),
  //         blurRadius: 32,
  //         spreadRadius: -4,
  //       )
  //     ]),
  //     child: TextButton(
  //       onPressed: enable ? onPressed : null,
  //       style: TextButton.styleFrom(
  //         backgroundColor: enable
  //             ? context.colorScheme.primary.withOpacity(.88)
  //             : context.colorScheme.surfaceDim,
  //       ),
  //       child: Row(
  //         mainAxisAlignment: MainAxisAlignment.center,
  //         children: [
  //           if (icon != null) icon,
  //           if (icon != null && title.isNotEmpty) const SizedBox(width: 4),
  //           Text(
  //             title,
  //             style: TextStyle(
  //               color: enable
  //                   ? Colors.white
  //                   : context.colorScheme.onSurface.withOpacity(.3),
  //               fontWeight: FontWeight.w500,
  //             ),
  //           ),
  //         ],
  //       ),
  //     ),
  //   );
  // }

  static Widget danger(
    BuildContext context, {
    required String title,
    required void Function()? onPressed,
    Widget? icon,
    bool enable = true,
  }) {
    return Container(
      width: MediaQuery.of(context).size.width * 0.9,
      height: 52.0,
      decoration: BoxDecoration(boxShadow: [
        BoxShadow(
          color: enable ? Colors.red.withOpacity(.4) : Colors.transparent,
          offset: const Offset(0, 8),
          blurRadius: 32,
          spreadRadius: -4,
        )
      ]),
      child: TextButton(
        onPressed: enable ? onPressed : null,
        style: TextButton.styleFrom(
          backgroundColor: enable
              ? Colors.red.withOpacity(.88)
              : context.colorScheme.surfaceDim,
        ),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            if (icon != null)
              Padding(
                padding: const EdgeInsets.only(right: 4),
                child: icon,
              ),
            Text(

              title,
              style: context.textTheme.bodySmall?.copyWith(
                color: enable
                    ? context.colorScheme.onPrimary
                    : context.colorScheme.onSurface.withOpacity(.3),
              ),
            )
          ],
        ),
      ),
    );
  }

  static Widget text(
    BuildContext context, {
    required String title,
    required void Function()? onPressed,
    Color? color,
  }) {
    return SizedBox(
      height: 52.0,
      child: TextButton(
        onPressed: onPressed,
        child: Text(

          title,
          style: context.textTheme.bodySmall?.copyWith(
            color: color ?? context.colorScheme.primary.withOpacity(0.88),
          ),
        ),
      ),
    );
  }

  static Widget primary(
    BuildContext context, {
    required String title,
    required void Function()? onPressed,
    Widget? icon,
    bool showShadow = false,
    bool enable = true,
  }) {
    return Container(
      height: 52,
      decoration: BoxDecoration(boxShadow: [
        BoxShadow(
          color: (enable && showShadow)
              ? context.colorScheme.primary.withOpacity(.4)
              : Colors.transparent,
          offset: const Offset(0, 8),
          blurRadius: 32,
          spreadRadius: -4,
        )
      ]),
      child: ElevatedButton(
        onPressed: enable ? onPressed : null,
        child: Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            if (icon != null) icon,
            if (icon != null && title.isNotEmpty) const SizedBox(width: 4),
            Text(
              title,
              style: context.textTheme.bodySmall?.copyWith(color: context.colorScheme.onPrimary),
            )
          ],
        ),
      ),
    );
  }

  static Widget secondary(
    BuildContext context, {
    required String title,
    required void Function()? onPressed,
    Widget? icon,
    bool showShadow = false,
    bool enable = true,
    EdgeInsets? padding,
  }) {
    return Container(
      height: 52,
      decoration: BoxDecoration(boxShadow: [
        BoxShadow(
          color: (enable && showShadow)
              ? context.colorScheme.secondary.withOpacity(.4)
              : Colors.transparent,
          offset: const Offset(0, 8),
          blurRadius: 32,
          spreadRadius: -4,
        )
      ]),
      child: ElevatedButton(
        onPressed: enable ? onPressed : null,
        style: ElevatedButton.styleFrom(
          backgroundColor: context.colorScheme.secondary.withOpacity(0.1),
          padding: padding,
        ),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            if (icon != null) icon,
            if (icon != null && title.isNotEmpty) const SizedBox(width: 8),
            Text(
              title,
              style: context.textTheme.bodySmall?.copyWith(color: context.colorScheme.primary),
            )
          ],
        ),
      ),
    );
  }

  static Widget caption(
    BuildContext context, {
    required String title,
    required void Function()? onPressed,
    Widget? icon,
    bool showShadow = false,
    bool enable = true,
    EdgeInsets? padding,
  }) {
    return Container(
      height: 52,
      decoration: BoxDecoration(boxShadow: [
        BoxShadow(
          color: (enable && showShadow)
              ? context.colorScheme.secondary.withOpacity(.4)
              : Colors.transparent,
          offset: const Offset(0, 8),
          blurRadius: 32,
          spreadRadius: -4,
        )
      ]),
      child: ElevatedButton(
        onPressed: enable ? onPressed : null,
        style: ElevatedButton.styleFrom(
          backgroundColor: context.colorScheme.secondary.withOpacity(0.1),
          padding: padding,
        ),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            if (icon != null) icon,
            if (icon != null && title.isNotEmpty) const SizedBox(width: 8),
            Text(
              title,
              style: context.textTheme.bodySmall?.copyWith(color: context.colorScheme.primary),
            )
          ],
        ),
      ),
    );
  }
}
