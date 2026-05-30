import 'package:flutter/material.dart';

class NotificationBell extends StatelessWidget {
  final int notificationCount;
  final VoidCallback onPressed;
  final Color color;

  const NotificationBell({
    Key? key,
    this.notificationCount = 0,
    required this.onPressed,
    this.color = const Color(0xFF0D7E52),
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Stack(
      alignment: Alignment.center,
      children: [
        IconButton(
          icon: Icon(Icons.notifications, color: color),
          onPressed: onPressed,
        ),
        if (notificationCount > 0)
          Positioned(
            right: 8,
            top: 8,
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
              decoration: BoxDecoration(
                color: Colors.red,
                borderRadius: BorderRadius.circular(10),
              ),
              child: Text(
                notificationCount > 99 ? '99+' : notificationCount.toString(),
                style: const TextStyle(
                  color: Colors.white,
                  fontSize: 10,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ),
          ),
      ],
    );
  }
}
