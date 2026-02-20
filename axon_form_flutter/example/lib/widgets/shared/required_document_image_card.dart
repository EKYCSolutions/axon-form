import 'package:flutter/material.dart';

class RequiredDocumentImageCard extends StatelessWidget {
  const RequiredDocumentImageCard({super.key});

  @override
  Widget build(BuildContext context) {
    return Container(
      child: Stack(
        children: [
          Positioned(
            child: Icon(Icons.image, color: Colors.grey[300]),
            // Image.asset(AssetsUtils.docImageCard),
          ),
          Positioned(
            left: 24,
            top: 24,
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
              decoration: ShapeDecoration(
                color: Colors.white.withAlpha(41),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(17),
                ),
              ),
              child: Row(
                mainAxisSize: MainAxisSize.min,
                mainAxisAlignment: MainAxisAlignment.start,
                crossAxisAlignment: CrossAxisAlignment.center,
                children: [
                  Container(
                    width: 20,
                    height: 20,
                    clipBehavior: Clip.antiAlias,
                    decoration: const BoxDecoration(),
                    child: Stack(
                      children: [
                        Positioned(
                          left: 3.06,
                          top: 1.67,
                          child: SizedBox(
                            width: 13.89,
                            height: 16.67,
                            child: Icon(Icons.star, color: Colors.red[300]),
                            // Image.asset(AssetsUtils.docImageCardStar),
                          ),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(width: 4),
                  const Text(
                    'ជាមួយនឹងបញ្ញាសិប្បនិម្មិត',
                    style: TextStyle(
                      color: Color(0xFFF6F7F8),
                      fontSize: 12,
                      fontFamily: 'KantumruyPro',
                      fontWeight: FontWeight.w500,
                      height: 1.2,
                    ),
                  ),
                ],
              ),
            ),
          ),
          Positioned(
            left: 24,
            bottom: 24,
            child: SizedBox(
              width: 152,
              child: Text(
                'សូមភ្ជាប់ឯកសារជាតម្រូវការដូចខាងក្រោម',
                style: TextStyle(
                  color: Colors.grey[300],
                  fontSize: 24,
                  fontFamily: 'KantumruyPro',
                  fontWeight: FontWeight.w700,
                  height: 1.3,
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
