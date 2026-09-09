import 'package:flutter/material.dart';

import 'models.dart';
import 'storage.dart';

class AdminDashboardPage extends StatefulWidget {
  final Color themeColor;
  const AdminDashboardPage({super.key, required this.themeColor});

  @override
  State<AdminDashboardPage> createState() => _AdminDashboardPageState();
}

class _AdminDashboardPageState extends State<AdminDashboardPage>
    with SingleTickerProviderStateMixin {
  late final TabController _tabController;

  final GlobalKey<FormState> _notifFormKey = GlobalKey<FormState>();
  final TextEditingController _notifTitleController = TextEditingController();
  final TextEditingController _notifMessageController = TextEditingController();

  List<AdminNotification> _notifications = <AdminNotification>[];
  List<StreamQuestion> _questions = <StreamQuestion>[];

  String _notifType = 'general';
  String _notifPriority = 'normal';
  bool _loading = true;
  bool _sending = false;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 2, vsync: this);
    _loadData();
  }

  @override
  void dispose() {
    _tabController.dispose();
    _notifTitleController.dispose();
    _notifMessageController.dispose();
    super.dispose();
  }

  Future<void> _loadData() async {
    final notifications = await AdminStorage.loadNotifications();
    final questions = await AdminStorage.loadQuestions();

    if (!mounted) return;
    setState(() {
      _notifications = notifications;
      _questions = questions;
      _loading = false;
    });
  }

  Future<void> _sendNotification() async {
    if (!_notifFormKey.currentState!.validate()) return;

    setState(() => _sending = true);
    final notification = AdminNotification(
      id: DateTime.now().microsecondsSinceEpoch.toString(),
      title: _notifTitleController.text.trim(),
      message: _notifMessageController.text.trim(),
      type: _notifType,
      priority: _notifPriority,
      createdAt: DateTime.now(),
    );

    final updated = <AdminNotification>[notification, ..._notifications];
    await AdminStorage.saveNotifications(updated);

    if (!mounted) return;
    setState(() {
      _notifications = updated;
      _sending = false;
      _notifTitleController.clear();
      _notifMessageController.clear();
      _notifType = 'general';
      _notifPriority = 'normal';
    });

    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text('Notification saved and published.')),
    );
  }

  Future<void> _deleteNotification(String id) async {
    final updated = _notifications.where((item) => item.id != id).toList();
    await AdminStorage.saveNotifications(updated);
    if (!mounted) return;
    setState(() => _notifications = updated);
  }

  Future<void> _markAnswered(StreamQuestion question, String answer) async {
    final trimmedAnswer = answer.trim();
    if (trimmedAnswer.isEmpty) return;

    final updated = _questions.map((q) {
      if (q.id != question.id) return q;
      return q.copyWith(
        isAnswered: true,
        answer: trimmedAnswer,
        answeredAt: DateTime.now(),
      );
    }).toList();

    await AdminStorage.saveQuestions(updated);
    if (!mounted) return;
    setState(() {
      _questions = updated;
    });
  }

  Future<void> _openAnswerDialog(StreamQuestion question) async {
    final controller = TextEditingController();
    final answer = await showDialog<String>(
      context: context,
      builder: (context) {
        return AlertDialog(
          title: const Text('Answer question'),
          content: TextField(
            controller: controller,
            minLines: 2,
            maxLines: 4,
            decoration: const InputDecoration(
              hintText: 'Write your answer',
              border: OutlineInputBorder(),
            ),
          ),
          actions: <Widget>[
            TextButton(
              onPressed: () => Navigator.of(context).pop(),
              child: const Text('Cancel'),
            ),
            ElevatedButton(
              onPressed: () => Navigator.of(context).pop(controller.text),
              child: const Text('Save answer'),
            ),
          ],
        );
      },
    );
    controller.dispose();

    if (answer != null) {
      await _markAnswered(question, answer);
    }
  }

  Future<void> _deleteQuestion(String id) async {
    final updated = _questions.where((item) => item.id != id).toList();
    await AdminStorage.saveQuestions(updated);
    if (!mounted) return;
    setState(() => _questions = updated);
  }

  Future<void> _seedDemoQuestion() async {
    final q = StreamQuestion(
      id: DateTime.now().microsecondsSinceEpoch.toString(),
      author: 'Attendee',
      message: 'Can we get the slides after this session?',
      createdAt: DateTime.now(),
      isAnswered: false,
    );
    final updated = <StreamQuestion>[q, ..._questions];
    await AdminStorage.saveQuestions(updated);
    if (!mounted) return;
    setState(() => _questions = updated);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF7F8FA),
      appBar: AppBar(
        title: const Text('ElMoultaqa Admin Center'),
        backgroundColor: widget.themeColor,
        foregroundColor: Colors.white,
        bottom: TabBar(
          controller: _tabController,
          indicatorColor: Colors.white,
          tabs: const <Tab>[
            Tab(icon: Icon(Icons.notifications_active), text: 'Notifications'),
            Tab(icon: Icon(Icons.question_answer), text: 'Stream Questions'),
          ],
        ),
      ),
      body: _loading
          ? const Center(child: CircularProgressIndicator())
          : TabBarView(
              controller: _tabController,
              children: <Widget>[
                _buildNotificationsTab(),
                _buildQuestionsTab(),
              ],
            ),
    );
  }

  Widget _buildNotificationsTab() {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: <Widget>[
          Form(
            key: _notifFormKey,
            child: Card(
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: <Widget>[
                    const Text(
                      'Compose Notification',
                      style:
                          TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                    ),
                    const SizedBox(height: 12),
                    DropdownButtonFormField<String>(
                      initialValue: _notifType,
                      decoration:
                          const InputDecoration(labelText: 'Notification Type'),
                      items: const <DropdownMenuItem<String>>[
                        DropdownMenuItem(
                            value: 'general', child: Text('General')),
                        DropdownMenuItem(
                            value: 'session', child: Text('Session')),
                        DropdownMenuItem(
                            value: 'conference', child: Text('Conference')),
                        DropdownMenuItem(
                            value: 'urgent', child: Text('Urgent')),
                      ],
                      onChanged: (value) {
                        if (value == null) return;
                        setState(() => _notifType = value);
                      },
                    ),
                    const SizedBox(height: 12),
                    DropdownButtonFormField<String>(
                      initialValue: _notifPriority,
                      decoration: const InputDecoration(labelText: 'Priority'),
                      items: const <DropdownMenuItem<String>>[
                        DropdownMenuItem(
                            value: 'normal', child: Text('Normal')),
                        DropdownMenuItem(value: 'high', child: Text('High')),
                      ],
                      onChanged: (value) {
                        if (value == null) return;
                        setState(() => _notifPriority = value);
                      },
                    ),
                    const SizedBox(height: 12),
                    TextFormField(
                      controller: _notifTitleController,
                      decoration: const InputDecoration(labelText: 'Title'),
                      validator: (value) =>
                          (value == null || value.trim().isEmpty)
                              ? 'Title is required'
                              : null,
                    ),
                    const SizedBox(height: 12),
                    TextFormField(
                      controller: _notifMessageController,
                      minLines: 3,
                      maxLines: 5,
                      decoration: const InputDecoration(labelText: 'Message'),
                      validator: (value) =>
                          (value == null || value.trim().isEmpty)
                              ? 'Message is required'
                              : null,
                    ),
                    const SizedBox(height: 16),
                    SizedBox(
                      width: double.infinity,
                      child: ElevatedButton.icon(
                        onPressed: _sending ? null : _sendNotification,
                        icon: const Icon(Icons.send),
                        label: Text(_sending
                            ? 'Publishing...'
                            : 'Publish Notification'),
                        style: ElevatedButton.styleFrom(
                          backgroundColor: widget.themeColor,
                          foregroundColor: Colors.white,
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),
          const SizedBox(height: 18),
          const Text(
            'Notification History',
            style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
          ),
          const SizedBox(height: 10),
          if (_notifications.isEmpty)
            const Card(
              child: ListTile(
                leading: Icon(Icons.notifications_off_outlined),
                title: Text('No notifications yet.'),
              ),
            )
          else
            ..._notifications.map((item) {
              return Card(
                child: ListTile(
                  leading: CircleAvatar(
                    backgroundColor: item.priority == 'high'
                        ? Colors.red.withValues(alpha: 0.15)
                        : widget.themeColor.withValues(alpha: 0.15),
                    child: Icon(
                      item.priority == 'high'
                          ? Icons.priority_high
                          : Icons.info,
                      color: item.priority == 'high'
                          ? Colors.red
                          : widget.themeColor,
                    ),
                  ),
                  title: Text(item.title),
                  subtitle: Text(
                    '${item.message}\n${item.type.toUpperCase()} • ${item.priority.toUpperCase()}',
                  ),
                  isThreeLine: true,
                  trailing: IconButton(
                    icon: const Icon(Icons.delete_outline),
                    onPressed: () => _deleteNotification(item.id),
                  ),
                ),
              );
            }),
        ],
      ),
    );
  }

  Widget _buildQuestionsTab() {
    return Padding(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: <Widget>[
          Row(
            children: <Widget>[
              const Expanded(
                child: Text(
                  'Incoming Stream Questions',
                  style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                ),
              ),
              OutlinedButton.icon(
                onPressed: _seedDemoQuestion,
                icon: const Icon(Icons.add),
                label: const Text('Seed Demo'),
              ),
            ],
          ),
          const SizedBox(height: 10),
          Expanded(
            child: _questions.isEmpty
                ? const Card(
                    child: ListTile(
                      leading: Icon(Icons.inbox_outlined),
                      title: Text('No stream questions available.'),
                    ),
                  )
                : ListView.builder(
                    itemCount: _questions.length,
                    itemBuilder: (context, index) {
                      final question = _questions[index];
                      return Card(
                        child: Padding(
                          padding: const EdgeInsets.all(14),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: <Widget>[
                              Row(
                                children: <Widget>[
                                  Chip(
                                    label: Text(question.author),
                                    backgroundColor: widget.themeColor
                                        .withValues(alpha: 0.12),
                                  ),
                                  const SizedBox(width: 8),
                                  Chip(
                                    label: Text(question.isAnswered
                                        ? 'Answered'
                                        : 'Pending'),
                                    backgroundColor: question.isAnswered
                                        ? Colors.green.withValues(alpha: 0.15)
                                        : Colors.orange.withValues(alpha: 0.2),
                                  ),
                                  const Spacer(),
                                  IconButton(
                                    onPressed: () =>
                                        _deleteQuestion(question.id),
                                    icon: const Icon(Icons.delete_outline),
                                    tooltip: 'Remove',
                                  ),
                                ],
                              ),
                              const SizedBox(height: 6),
                              Text(
                                question.message,
                                style: const TextStyle(fontSize: 15),
                              ),
                              if (question.isAnswered &&
                                  question.answer != null &&
                                  question.answer!
                                      .trim()
                                      .isNotEmpty) ...<Widget>[
                                const SizedBox(height: 10),
                                Container(
                                  width: double.infinity,
                                  padding: const EdgeInsets.all(10),
                                  decoration: BoxDecoration(
                                    color: Colors.green.withValues(alpha: 0.08),
                                    borderRadius: BorderRadius.circular(10),
                                  ),
                                  child: Text('Answer: ${question.answer!}'),
                                ),
                              ] else ...<Widget>[
                                const SizedBox(height: 8),
                                Align(
                                  alignment: Alignment.centerRight,
                                  child: ElevatedButton.icon(
                                    onPressed: () =>
                                        _openAnswerDialog(question),
                                    icon: const Icon(Icons.done),
                                    label: const Text('Mark as answered'),
                                    style: ElevatedButton.styleFrom(
                                      backgroundColor: widget.themeColor,
                                      foregroundColor: Colors.white,
                                    ),
                                  ),
                                ),
                              ],
                            ],
                          ),
                        ),
                      );
                    },
                  ),
          ),
        ],
      ),
    );
  }
}
