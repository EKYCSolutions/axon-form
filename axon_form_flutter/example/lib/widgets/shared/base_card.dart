import 'package:flutter/material.dart';
import 'package:liquid_glass_renderer/liquid_glass_renderer.dart';

class BaseCard extends StatelessWidget {
  const BaseCard({
    super.key,
    required this.child,
    this.width = double.infinity,
    this.backgroundColor,
    this.padding,
    this.margin,
    this.borderRadius,
  });

  final Widget child;
  final double width;
  final Color? backgroundColor;
  final EdgeInsetsGeometry? padding;
  final EdgeInsetsGeometry? margin;
  final BorderRadius? borderRadius;

  @override
  Widget build(BuildContext context) {
    return Container(
      width: width,
      decoration: BoxDecoration(
        borderRadius: borderRadius ?? BorderRadius.circular(16),
        color: backgroundColor ?? Theme.of(context).colorScheme.surface,
      ),
      padding: padding ?? EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      margin: margin,
      child: child,
    );

    return LiquidGlassLayer(
      // settings: LiquidGlassSettings(blur: 10.0, ),
      child: LiquidStretch(
        stretch: 0.2,
        interactionScale: 1.05,
        resistance: 0.5,
        child: LiquidGlass(
          shape: LiquidRoundedSuperellipse(borderRadius: 20),
          // child: GlassGlow(
          //   glowColor: Colors.white24,
          //   glowRadius: .4,
            child: Container(
              clipBehavior: Clip.hardEdge,
              decoration: BoxDecoration(
                borderRadius: borderRadius ?? BorderRadius.circular(16),
                color: backgroundColor?.withOpacity(0.2) ??
                    Theme.of(context)
                        .colorScheme
                        .onSurface
                        .withOpacity(0.1),
              ),
              margin:
                  padding ?? EdgeInsets.all(8),
              padding:
                  padding ?? EdgeInsets.all(8),

              width: width,
              child: child,
            ),
          // ),
        ),
      ),
    );
  }
}
