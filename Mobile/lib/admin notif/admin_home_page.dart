import 'package:flutter/material.dart';

import '../mobile_config.dart';
import 'storage.dart';

class AdminHomePage extends StatefulWidget {
  final Color themeColor;
  final VoidCallback onOpenProgram;
  final VoidCallback onOpenNotifications;
  final VoidCallback onOpenQuestions;

  const AdminHomePage({
    super.key,
    required this.themeColor,
    required this.onOpenProgram,
    required this.onOpenNotifications,
    required this.onOpenQuestions,
  });

  @override
  State<AdminHomePage> createState() => _AdminHomePageState();
}

class _AdminHomePageState extends State<AdminHomePage> {
  int _notificationCount = 0;
  int _questionCount = 0;
  int _pendingQuestions = 0;
  bool _loading = true;

  @override
  void initState() {
    super.initState();
    _loadStats();
  }

  Future<void> _loadStats() async {
    final notifications = await AdminStorage.loadNotifications();
    final questions = await AdminStorage.loadQuestions();

    if (!mounted) return;
    setState(() {
      _notificationCount = notifications.length;
      _questionCount = questions.length;
      _pendingQuestions = questions.where((item) => !item.isAnswered).length;
      _loading = false;
    });
  }

  @override
  Widget build(BuildContext context) {
    return SafeArea(
      child: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: _loading
            ? const Center(
                child: Padding(
                padding: EdgeInsets.only(top: 100),
                child: CircularProgressIndicator(),
              ))
            : Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: <Widget>[
                  Container(
                    width: double.infinity,
                    padding: const EdgeInsets.all(28),
                    decoration: BoxDecoration(
                      color: widget.themeColor,
                      borderRadius: BorderRadius.circular(24),
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: <Widget>[
                        Text(
                          '${MobileConfig.appName} Admin',
                          style: const TextStyle(
                            fontSize: 28,
                            fontWeight: FontWeight.bold,
                            color: Colors.white,
                            height: 1.2,
                          ),
                        ),
                        const SizedBox(height: 12),
                        const Text(
                          'Manage notifications and moderate stream questions from one central ElMoultaqa dashboard.',
                          style: TextStyle(
                            fontSize: 14,
                            color: Colors.white,
                            height: 1.5,
                          ),
                        ),
                        const SizedBox(height: 20),
                        Wrap(
                          spacing: 16,
                          runSpacing: 12,
                          children: <Widget>[
                            _infoChip(Icons.notifications_active,
                                '$_notificationCount notifications'),
                            _infoChip(Icons.question_answer,
                                '$_questionCount questions'),
                            _infoChip(Icons.pending_actions,
                                '$_pendingQuestions pending'),
                          ],
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 28),
                  Row(
                    children: <Widget>[
                      Expanded(
                        child: _statCard(
                          _notificationCount.toString(),
                          'Notifications',
                        ),
                      ),
                      const SizedBox(width: 16),
                      Expanded(
                        child: _statCard(
                          _pendingQuestions.toString(),
                          'Pending Questions',
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 20),
                  Text(
                    'Admin Actions',
                    style: Theme.of(context).textTheme.titleLarge,
                  ),
                  const SizedBox(height: 12),
                  Row(
                    children: <Widget>[
                      Expanded(
                        child: _actionCard(
                          icon: Icons.calendar_month_outlined,
                          title: 'Program',
                          description:
                              'Review the conference schedule and sessions from the same template data used by attendees.',
                          onTap: widget.onOpenProgram,
                        ),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: _actionCard(
                          icon: Icons.notifications_active_outlined,
                          title: 'Notifications Management',
                          description:
                              'Create, publish, and delete notifications for mobile and web users.',
                          onTap: widget.onOpenNotifications,
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 12),
                  _actionCard(
                    icon: Icons.question_answer_outlined,
                    title: 'Stream Questions',
                    description:
                        'Review incoming questions and answer them from the live stream.',
                    onTap: widget.onOpenQuestions,
                  ),
                  const SizedBox(height: 20),
                  Text(
                    'About ${MobileConfig.appName}',
                    style: TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                      color: widget.themeColor,
                    ),
                  ),
                  const SizedBox(height: 12),
                  Card(
                    child: Padding(
                      padding: const EdgeInsets.all(16.0),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: <Widget>[
                          Text(
                            'This admin workspace follows the same structure as the attendee app, but focuses on publishing notifications and moderating user questions for ElMoultaqa.',
                            style: const TextStyle(
                              color: Colors.black87,
                              height: 1.4,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                ],
              ),
      ),
    );
  }

  Widget _infoChip(IconData icon, String label) {
    return Chip(
      avatar: Icon(icon, color: Colors.white, size: 18),
      label: Text(label, style: const TextStyle(color: Colors.white)),
      backgroundColor: Colors.white.withValues(alpha: 0.16),
      side: BorderSide(color: Colors.white.withValues(alpha: 0.25)),
    );
  }

  Widget _statCard(String value, String title) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(18),
        child: Column(
          children: <Widget>[
            Text(
              value,
              style: TextStyle(
                fontSize: 28,
                fontWeight: FontWeight.bold,
                color: widget.themeColor,
              ),
            ),
            const SizedBox(height: 4),
            Text(
              title,
              textAlign: TextAlign.center,
              style: const TextStyle(color: Colors.black54),
            ),
          ],
        ),
      ),
    );
  }

  Widget _actionCard({
    required IconData icon,
    required String title,
    required String description,
    required VoidCallback onTap,
  }) {
    return Card(
      child: InkWell(
        borderRadius: BorderRadius.circular(12),
        onTap: onTap,
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: <Widget>[
              Icon(icon, color: widget.themeColor, size: 28),
              const SizedBox(height: 14),
              Text(
                title,
                style: const TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.bold,
                ),
              ),
              const SizedBox(height: 8),
              Text(
                description,
                style: const TextStyle(color: Colors.black54, height: 1.35),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
