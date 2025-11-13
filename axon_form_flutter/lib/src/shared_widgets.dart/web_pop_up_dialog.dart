import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';

class WebPopUpDialog extends StatelessWidget {
  const WebPopUpDialog({super.key, required this.child});

  final Widget child;
  @override
  Widget build(BuildContext context) {
    return Center(
      child: Container(
        width: 800,
        // color: context.colorScheme.background,
        child: Wrap(
          // crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            SizedBox(
              height: 40,
              child: Align(
                alignment: Alignment.centerRight,
                child: GestureDetector(
                  onTap: () {
                    // context.navigator.pop();
                    Navigator.of(context).pop();
                  },
                  child: Icon(Icons.close_outlined),
                ),
              ),
            ),
            child,
          ],
        ),
      ),
    );
  }
}
