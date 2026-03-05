import 'package:flutter/material.dart';

class PageNavigationBar extends StatelessWidget {
  final int currentPage;
  final int pageCount;
  final void Function() nextPage;
  final void Function() prevPage;

  const PageNavigationBar({
    super.key,
    required this.currentPage,
    required this.pageCount,
    required this.nextPage,
    required this.prevPage,
  });

  @override
  Widget build(BuildContext context) {
    return Positioned(
      bottom: 0,
      left: 0,
      right: 0,
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: Colors.white,
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.05),
              blurRadius: 10,
              offset: const Offset(0, -5),
            ),
          ],
        ),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Row(
              children: List.generate(pageCount, (index) {
                return Expanded(
                  child: Container(
                    height: 6,
                    margin: const EdgeInsets.symmetric(horizontal: 4),
                    decoration: BoxDecoration(
                      // Logic: Active if index is less than or equal to current page
                      color: index <= currentPage
                          ? Theme.of(context).colorScheme.primary
                          : Colors.grey[200],
                      borderRadius: BorderRadius.circular(10),
                    ),
                  ),
                );
              }),
            ),
            const SizedBox(height: 16),
            Row(
              children: [
                Expanded(
                  child: OutlinedButton(
                    onPressed: currentPage > 0 ? () => prevPage() : null,
                    child: const Text("Back"),
                  ),
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: FilledButton(
                    onPressed: () => nextPage(),
                    child: Text(
                      currentPage == pageCount - 1 ? "Submit" : "Next",
                    ),
                  ),
                ),
              ],
            ),
            SizedBox(height: MediaQuery.of(context).padding.bottom),
          ],
        ),
      ),
    );
  }
}
