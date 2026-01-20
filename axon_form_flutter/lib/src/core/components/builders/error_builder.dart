import 'package:flutter/material.dart';

Widget buildError(BuildContext context, String error) {
  return Text(error, style: TextStyle(color: Colors.red, fontSize: 12));
}
