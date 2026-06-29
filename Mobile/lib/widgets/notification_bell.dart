import 'package:flutter/material.dart';

class NotificationBell extends StatefulWidget {
  final int notificationCount;
  final VoidCallback onPressed;
  final Color color;

  const NotificationBell({
    super.key,
    this.notificationCount = 0,
    required this.onPressed,
    this.color = const Color(0xFF0D7E52),
  });

  @override
  State<NotificationBell> createState() => _NotificationBellState();
}

class _NotificationBellState extends State<NotificationBell>
    with SingleTickerProviderStateMixin {
  late AnimationController _animController;
  late Animation<double> _scaleAnim;
  int _previousCount = 0;

  @override
  void initState() {
    super.initState();
    _animController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 300),
    );
    _scaleAnim = CurvedAnimation(
      parent: _animController,
      curve: Curves.elasticOut,
    );
    _previousCount = widget.notificationCount;
  }

  @override
  void didUpdateWidget(NotificationBell oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (widget.notificationCount > _previousCount) {
      _animController.forward(from: 0);
    }
    _previousCount = widget.notificationCount;
  }

  @override
  void dispose() {
    _animController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return IconButton(
      icon: Stack(
        clipBehavior: Clip.none,
        children: [
          Icon(Icons.notifications_outlined, color: widget.color, size: 26),
          if (widget.notificationCount > 0)
            Positioned(
              right: -4,
              top: -4,
              child: ScaleTransition(
                scale: _scaleAnim,
                child: Container(
                  padding: const EdgeInsets.symmetric(horizontal: 5, vertical: 2),
                  decoration: BoxDecoration(
                    color: Colors.red,
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(color: Colors.white, width: 1.5),
                    boxShadow: [
                      BoxShadow(
                        color: Colors.red.withValues(alpha: 0.4),
                        blurRadius: 4,
                        offset: const Offset(0, 1),
                      ),
                    ],
                  ),
                  constraints: const BoxConstraints(minWidth: 20, minHeight: 14),
                  child: Text(
                    widget.notificationCount > 99
                        ? '99+'
                        : widget.notificationCount.toString(),
                    style: const TextStyle(
                      color: Colors.white,
                      fontSize: 10,
                      fontWeight: FontWeight.bold,
                      height: 1,
                    ),
                    textAlign: TextAlign.center,
                  ),
                ),
              ),
            ),
        ],
      ),
      onPressed: widget.onPressed,
      splashRadius: 22,
      tooltip: 'Notifications',
    );
  }
}
