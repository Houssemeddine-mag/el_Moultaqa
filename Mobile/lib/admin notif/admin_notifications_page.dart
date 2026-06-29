import 'package:flutter/material.dart';

import 'models.dart';
import 'storage.dart';

class AdminNotificationsPage extends StatefulWidget {
  final Color themeColor;
  const AdminNotificationsPage({super.key, required this.themeColor});

  @override
  State<AdminNotificationsPage> createState() => _AdminNotificationsPageState();
}

class _AdminNotificationsPageState extends State<AdminNotificationsPage> {
  final GlobalKey<FormState> _formKey = GlobalKey<FormState>();
  final TextEditingController _titleController = TextEditingController();
  final TextEditingController _messageController = TextEditingController();

  List<AdminNotification> _notifications = <AdminNotification>[];
  String _type = 'general';
  String _priority = 'normal';
  bool _loading = true;
  bool _saving = false;

  @override
  void initState() {
    super.initState();
    _loadNotifications();
  }

  @override
  void dispose() {
    _titleController.dispose();
    _messageController.dispose();
    super.dispose();
  }

  Future<void> _loadNotifications() async {
    final notifications = await AdminStorage.loadNotifications();
    if (!mounted) return;
    setState(() {
      _notifications = notifications;
      _loading = false;
    });
  }

  InputDecoration _fieldDecoration({
    required String label,
    required IconData icon,
  }) {
    return InputDecoration(
      labelText: label,
      prefixIcon: Icon(icon, color: widget.themeColor),
      filled: true,
      fillColor: Colors.white,
      contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
      border: OutlineInputBorder(
        borderRadius: BorderRadius.circular(18),
        borderSide: BorderSide(color: Colors.grey.withValues(alpha: 0.25)),
      ),
      enabledBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(18),
        borderSide: BorderSide(color: Colors.grey.withValues(alpha: 0.25)),
      ),
      focusedBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(18),
        borderSide: BorderSide(color: widget.themeColor, width: 1.8),
      ),
    );
  }

  Future<void> _publish() async {
    if (!_formKey.currentState!.validate()) return;

    setState(() => _saving = true);
    final notification = AdminNotification(
      id: DateTime.now().microsecondsSinceEpoch.toString(),
      title: _titleController.text.trim(),
      message: _messageController.text.trim(),
      type: _type,
      priority: _priority,
      createdAt: DateTime.now(),
    );

    final updated = <AdminNotification>[notification, ..._notifications];
    await AdminStorage.saveNotifications(updated);
    if (!mounted) return;

    setState(() {
      _notifications = updated;
      _saving = false;
      _titleController.clear();
      _messageController.clear();
      _type = 'general';
      _priority = 'normal';
    });

    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text('Notification published.')),
    );
  }

  Future<void> _delete(String id) async {
    final updated = _notifications.where((item) => item.id != id).toList();
    await AdminStorage.saveNotifications(updated);
    if (!mounted) return;
    setState(() => _notifications = updated);
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
                ),
              )
            : Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: <Widget>[
                  Text(
                    'Notifications Management',
                    style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                          color: widget.themeColor,
                          fontWeight: FontWeight.bold,
                        ),
                  ),
                  const SizedBox(height: 10),
                  Card(
                    elevation: 0,
                    color: widget.themeColor.withValues(alpha: 0.08),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(20),
                    ),
                    child: Padding(
                      padding: const EdgeInsets.all(16),
                      child: Row(
                        children: <Widget>[
                          Container(
                            width: 48,
                            height: 48,
                            decoration: BoxDecoration(
                              color: widget.themeColor.withValues(alpha: 0.16),
                              borderRadius: BorderRadius.circular(14),
                            ),
                            child: Icon(
                              Icons.notifications_active_outlined,
                              color: widget.themeColor,
                            ),
                          ),
                          const SizedBox(width: 14),
                          Expanded(
                            child: Text(
                              'Compose and publish polished conference notices for both mobile and web attendees.',
                              style: TextStyle(
                                color: Colors.grey[800],
                                height: 1.4,
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                  const SizedBox(height: 12),
                  Card(
                    child: Padding(
                      padding: const EdgeInsets.all(16),
                      child: Form(
                        key: _formKey,
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: <Widget>[
                            const Text(
                              'Compose Notification',
                              style: TextStyle(
                                fontSize: 18,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                            const SizedBox(height: 12),
                            Row(
                              children: <Widget>[
                                  Expanded(
                                    child: DropdownButtonFormField<String>(
                                      isExpanded: true,
                                      value: _type,
                                      decoration: const InputDecoration(
                                        labelText: 'Type',
                                      ),
                                      items: const <DropdownMenuItem<String>>[
                                        DropdownMenuItem(
                                            value: 'general',
                                            child: Text('General')),
                                        DropdownMenuItem(
                                            value: 'session',
                                            child: Text('Session')),
                                        DropdownMenuItem(
                                            value: 'conference',
                                            child: Text('Conference')),
                                        DropdownMenuItem(
                                            value: 'urgent',
                                            child: Text('Urgent')),
                                        DropdownMenuItem(
                                            value: 'announcement',
                                            child: Text('Announcement')),
                                      ],
                                      onChanged: (value) {
                                        if (value == null) return;
                                        setState(() => _type = value);
                                      },
                                    ),
                                  ),
                                  const SizedBox(width: 12),
                                  Expanded(
                                    child: DropdownButtonFormField<String>(
                                      isExpanded: true,
                                      value: _priority,
                                      decoration: const InputDecoration(
                                        labelText: 'Priority',
                                      ),
                                      items: const <DropdownMenuItem<String>>[
                                        DropdownMenuItem(
                                            value: 'normal',
                                            child: Text('Normal')),
                                        DropdownMenuItem(
                                            value: 'high', child: Text('High')),
                                      ],
                                      onChanged: (value) {
                                        if (value == null) return;
                                        setState(() => _priority = value);
                                      },
                                    ),
                                  ),
                              ],
                            ),
                            const SizedBox(height: 12),
                            TextFormField(
                              controller: _titleController,
                              decoration: _fieldDecoration(
                                label: 'Title',
                                icon: Icons.title,
                              ),
                              validator: (value) =>
                                  (value == null || value.trim().isEmpty)
                                      ? 'Title is required'
                                      : null,
                            ),
                            const SizedBox(height: 12),
                            TextFormField(
                              controller: _messageController,
                              minLines: 3,
                              maxLines: 5,
                              decoration: _fieldDecoration(
                                label: 'Message',
                                icon: Icons.message_outlined,
                              ),
                              validator: (value) =>
                                  (value == null || value.trim().isEmpty)
                                      ? 'Message is required'
                                      : null,
                            ),
                            const SizedBox(height: 16),
                            SizedBox(
                              width: double.infinity,
                              child: ElevatedButton.icon(
                                onPressed: _saving ? null : _publish,
                                icon: const Icon(Icons.send),
                                label: Text(_saving
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
                  Text(
                    'Published Notifications',
                    style: Theme.of(context).textTheme.titleLarge,
                  ),
                  const SizedBox(height: 10),
                  if (_notifications.isEmpty)
                    Card(
                      elevation: 0,
                      color: Colors.white,
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(22),
                        side: BorderSide(
                            color: Colors.grey.withValues(alpha: 0.12)),
                      ),
                      child: Padding(
                        padding: const EdgeInsets.all(20),
                        child: Row(
                          children: <Widget>[
                            Container(
                              width: 52,
                              height: 52,
                              decoration: BoxDecoration(
                                color:
                                    widget.themeColor.withValues(alpha: 0.10),
                                borderRadius: BorderRadius.circular(16),
                              ),
                              child: Icon(
                                Icons.notifications_off_outlined,
                                color: widget.themeColor,
                              ),
                            ),
                            const SizedBox(width: 14),
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: <Widget>[
                                  Text(
                                    'No notifications yet',
                                    style: TextStyle(
                                      fontSize: 16,
                                      fontWeight: FontWeight.bold,
                                      color: Colors.grey[850],
                                    ),
                                  ),
                                  const SizedBox(height: 4),
                                  Text(
                                    'Published notifications will appear here with their type and priority.',
                                    style: TextStyle(
                                      color: Colors.grey[600],
                                      height: 1.35,
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          ],
                        ),
                      ),
                    )
                  else
                    ..._notifications.map((item) {
                      return Card(
                        child: ListTile(
                          leading: CircleAvatar(
                            backgroundColor:
                                widget.themeColor.withValues(alpha: 0.12),
                            child: Icon(
                              item.priority == 'high'
                                  ? Icons.priority_high
                                  : Icons.notifications,
                              color: widget.themeColor,
                            ),
                          ),
                          title: Text(item.title),
                          subtitle: Text(
                            '${item.message}\n${item.type.toUpperCase()} • ${item.priority.toUpperCase()}',
                          ),
                          isThreeLine: true,
                          trailing: IconButton(
                            icon: const Icon(Icons.delete_outline),
                            onPressed: () => _delete(item.id),
                          ),
                        ),
                      );
                    }),
                ],
              ),
      ),
    );
  }
}
