import 'package:flutter/material.dart';
import 'package:flutter_svg/svg.dart';

class _SvgColorReplacer implements ColorMapper {
  const _SvgColorReplacer({
    required this.colors,
    required this.replacements,
  });

  final List<Color> colors;
  final List<Color> replacements;

  @override
  Color substitute(
      String? id, String elementName, String attributeName, Color color) {
    final colorIdx = colors.indexOf(color);
    if (colorIdx >= 0) return replacements[colorIdx];

    return color;
  }
}

class GdiIcon extends StatelessWidget {
  const GdiIcon({
    super.key,
    required this.icon,
    this.width = 24,
    this.height = 24,
    this.color,
  });

  final String icon;
  final double? width;
  final double? height;
  final Color? color;

  @override
  Widget build(BuildContext context) {
    if (color != null) {
      return SvgPicture(
        SvgAssetLoader(
          "assets/gdi_icon_set/$icon.svg",
          colorMapper: _SvgColorReplacer(
            colors: [
              const Color(0xFF000000),
            ],
            replacements: [
              color!,
            ],
          ),
        ),
        width: width,
        height: height,
      );
    }

    return SvgPicture.asset(
      "assets/gdi_icon_set/$icon.svg",
      width: width,
      height: height,
    );
  }
}
