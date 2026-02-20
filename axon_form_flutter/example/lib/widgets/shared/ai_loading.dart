import 'package:axon_form_flutter/axon_form_flutter.dart';
import 'package:axon_form_flutter_example/widgets/shared/constant.dart';
import 'package:axon_form_flutter_example/widgets/shared/gdi_icon.dart';
import 'package:flutter/material.dart';
import 'package:glowy_borders/glowy_borders.dart';


class AiLoading extends StatefulWidget {
  const AiLoading({super.key});

  @override
  State<AiLoading> createState() => _AiLoadingState();
}

class _AiLoadingState extends State<AiLoading> with TickerProviderStateMixin {
  AnimationController? _controller;
  Animation<double>? _animation;
  AnimationController? _markerController;
  Animation<double>? _markerAnimation;

  bool scaleMarker = false;
  bool showGradientBorder = false;

  String loadingText = "កំពុងផ្ទៀងផ្ទាត់ទិន្នន័យ";

  // AnimationController? _text1Controller;
  // AnimationController? _text2Controller;
  // AnimationController? _text3Controller;
  // AnimationController? _text4Controller;
  // Animation<Offset>? _text1Animation;
  // Animation<Offset>? _text2Animation;
  // Animation<Offset>? _text3Animation;
  // Animation<Offset>? _text4Animation;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(duration: Durations.long2, vsync: this);
    _animation = Tween<double>(begin: 0.0, end: 1.0).animate(
      CurvedAnimation(
        parent: _controller!,
        curve: Curves.easeInOut,
      ),
    );
    _markerController =
        AnimationController(duration: Durations.long2, vsync: this);
    _markerAnimation = Tween<double>(begin: 1.0, end: 1.2).animate(
      CurvedAnimation(
        parent: _markerController!,
        curve: Curves.easeInOutQuad,
      ),
    );

    Future.delayed(const Duration(seconds: 2), () {
      _controller!.forward();

      _markerController!.repeat(reverse: true);
      Future.delayed(const Duration(seconds: 2), () {
        if (context.mounted) {
          setState(() {
            scaleMarker = true;
          });
        }
      });
      Future.delayed(const Duration(seconds: 2, milliseconds: 450), () {
        if (context.mounted) {
          setState(() {
            showGradientBorder = true;
          });
        }
      });

      Future.delayed(const Duration(seconds: 7), () async {
        if (context.mounted) {
          setState(() {
            loadingText = "ទាញយកទិន្នន័យ";
          });
        }
        await Future.delayed(const Duration(seconds: 6));
        if (context.mounted) {
          setState(() {
            loadingText = "ផ្ទៀងផ្ទាត់ភាពត្រឹមត្រូវ";
          });
        }
        await Future.delayed(const Duration(seconds: 8));
        if (context.mounted) {
          setState(() {
            loadingText = "រៀបចំបញ្ចប់ការងារ";
          });
        }
      });
    });
  }

  @override
  void dispose() {
    _controller?.dispose();
    _markerController?.dispose();

    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Stack(
      children: [
        AnimatedPositioned(
          duration: Durations.medium3,
          curve: Curves.easeInOut,
          left: 0,
          right: 0,
          top: scaleMarker ? 0 : 280,
          bottom: 0,
          child: AnimatedScale(
            duration: Durations.medium3,
            curve: Curves.easeInOut,
            scale: scaleMarker ? 1 : 3,
            child: Center(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.center,
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  AnimatedBuilder(
                    animation: _animation!,
                    builder: (context, child) {
                      return Opacity(
                        opacity: _animation!.value,
                        child: AnimatedBuilder(
                          animation: _markerAnimation!,
                          builder: (context, child) {
                            return Transform.scale(
                              scale: _markerAnimation!.value,
                              child:  GdiIcon(
                                color: Colors.green,
                                icon: "Sparkle_Filled",
                                height: 50,
                                width: 50,
                              ),
                            );
                          },
                        ),
                      );
                    },
                  ),
                  const SizedBox(
                    height: 24,
                  ),
                  AnimatedOpacity(
                    opacity: showGradientBorder ? 1 : 0,
                    duration: Durations.medium3,
                    child: AnimatedGradientBorder(
                      borderSize: 2,
                      glowSize: 1,
                      gradientColors: [
                        Colors.green.withOpacity(0.2),
                        Colors.green.withOpacity(0.6),
                        // Colors.green.withOpacity(0.2),
                        // Colors.green.withOpacity(0.2),
                        // Colors.green.withOpacity(0.6),
                      ],
                      borderRadius: Constants.containerRadius,
                      child: SizedBox(
                        width: 270,
                        height: 59,
                        child: Stack(
                          children: [
                            // Positioned.fill(
                            //   child: AnimatedBuilder(
                            //     animation: _animation!,
                            //     builder: (context, child) {
                            //       return Opacity(
                            //         opacity: _animation!.value,
                            //         child: Shimmer.fromColors(
                            //           baseColor: context.successColor,
                            //           highlightColor: context.successLightColor
                            //               .withOpacity(0.8),
                            //           period: const Duration(seconds: 3),
                            //           child: Container(
                            //             decoration: BoxDecoration(
                            //               borderRadius:
                            //                   Constants.containerRadius,
                            //               color: context.colorScheme.primary,
                            //             ),
                            //             padding:
                            //                 Constants.containerPadding.copyWith(
                            //               left: 24,
                            //               right: 24,
                            //             ),
                            //             child: _content(context),
                            //           ),
                            //         ),
                            //       );
                            //     },
                            //   ),
                            // ),
                            Positioned.fill(
                              child: Container(
                                decoration: BoxDecoration(
                                  color: Colors.green[700],
                                  borderRadius: Constants.containerRadius,
                                ),
                                alignment: Alignment.center,
                                child: Container(
                                  // constraints: BoxConstraints.tight(Size(300, 50)),

                                  padding: Constants.containerPadding.copyWith(
                                    left: 24,
                                    right: 24,
                                  ),
                                  child: AnimatedBuilder(
                                      animation: _animation!,
                                      builder: (context, child) {
                                        return Opacity(
                                          opacity: _animation!.value,
                                          child: Transform.translate(
                                            offset:
                                                Offset(0, _animation!.value),
                                            child: Transform.scale(
                                              scale: _animation!.value,
                                              child: _content(context),
                                            ),
                                          ),
                                        );
                                      }),
                                ),
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),
        ),
      ],
    );
  }

  Widget _content(BuildContext context) {
    return Padding(
        padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 8),
        child: Stack(
          children: [
            Center(
              child: AnimatedSwitcher(
                duration: Durations.medium2,
                transitionBuilder: (Widget child, Animation<double> animation) {
                  return FadeTransition(
                    opacity: Tween<double>(
                      begin: 0, // Start at center (exiting) or right (entering)
                      end: 1,
                    ).animate(animation),
                    child: child,
                  );
                },
                child: Text(
                  key: ValueKey(loadingText),

                  loadingText,
                  style: context.textTheme.bodyMedium?.copyWith(
                    color: context.colorScheme.onPrimary,
                    fontWeight: FontWeight.w500,
                  ),
                ),
              ),
            )
          ],
        ));
  }
}
